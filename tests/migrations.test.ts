import test from 'node:test';
import assert from 'node:assert/strict';
import {
  copyFile,
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import {
  applyMigrations,
  migrationDatabaseUrl,
  migrationErrorMessage,
  migrationsFolder,
} from '../scripts/migrations';

test('migration URL preserves credentials/database and only rewrites Neon pooler endpoints', () => {
  const pooled =
    'postgresql://editor:p%40ss@ep-test-pooler.eu-central-1.aws.neon.tech/blog?sslmode=require&channel_binding=require';
  assert.equal(
    migrationDatabaseUrl({ DATABASE_URL: pooled }),
    pooled.replace('-pooler', ''),
  );
  const custom = 'postgres://user:pass@custom-pooler.example/blog';
  assert.equal(migrationDatabaseUrl({ DATABASE_URL: custom }), custom);
  assert.equal(
    migrationDatabaseUrl({
      DATABASE_URL: pooled,
      MIGRATION_DATABASE_URL: custom,
    }),
    custom,
  );
  assert.equal(
    migrationDatabaseUrl({ DATABASE_URL: custom, MIGRATION_DATABASE_URL: '' }),
    custom,
  );
  assert.throws(() => migrationDatabaseUrl({}), /Set DATABASE_URL/);
  assert.throws(
    () => migrationDatabaseUrl({ DATABASE_URL: 'secret invalid value' }),
    /URL is invalid/,
  );
  assert.throws(
    () => migrationDatabaseUrl({ DATABASE_URL: 'https://example.com/blog' }),
    /PostgreSQL database/,
  );
  const message = migrationErrorMessage({
    code: '42601',
    detail: 'password=secret',
    query: 'private data',
  });
  assert.match(message, /42601/);
  assert.doesNotMatch(message, /secret|private data/);
  assert.doesNotMatch(
    migrationErrorMessage(new Error(pooled)),
    /p%40ss|ep-test/,
  );
});

// These tests CREATE/DROP their own databases. Require an explicit loopback
// PostgreSQL URL with CREATEDB rights; never accept a remote Neon connection.
const integration =
  process.env.TEST_DATABASE_DISPOSABLE === 'true' &&
  !!process.env.TEST_MIGRATIONS_DATABASE_URL;
async function withDatabase(
  run: (url: string, client: postgres.Sql) => Promise<void>,
) {
  const url = new URL(process.env.TEST_MIGRATIONS_DATABASE_URL!);
  assert.ok(
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname),
    'Migration tests require a local disposable PostgreSQL server',
  );
  const admin = postgres(url.toString(), { max: 1, onnotice: () => {} });
  const name = `migration_test_${crypto.randomUUID().replaceAll('-', '')}`;
  let client: postgres.Sql | undefined;
  try {
    await admin`CREATE DATABASE ${admin(name)}`;
    url.pathname = `/${name}`;
    client = postgres(url.toString(), { max: 1, onnotice: () => {} });
    await run(url.toString(), client);
  } finally {
    await client?.end();
    try {
      await admin`DROP DATABASE IF EXISTS ${admin(name)}`;
    } finally {
      await admin.end();
    }
  }
}

test(
  'fresh migration runners serialize, seed once, and preserve subsequent edits on reruns',
  { skip: !integration },
  async () => {
    await withDatabase(async (url, client) => {
      const journal = JSON.parse(
        await readFile(join(migrationsFolder, 'meta/_journal.json'), 'utf8'),
      );
      const counts = await Promise.all([
        applyMigrations(url),
        applyMigrations(url),
      ]);
      assert.deepEqual(
        counts.sort((a, b) => a - b),
        [0, journal.entries.length],
      );
      const [{ count }] =
        await client`SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations`;
      assert.equal(count, journal.entries.length);
      await client`UPDATE editor_options SET label = 'Edited label' WHERE kind = 'sports' AND value = 'ESCALADE_COUENNE'`;
      assert.equal(await applyMigrations(url), 0);
      const [sport] =
        await client`SELECT label FROM editor_options WHERE value = 'ESCALADE_COUENNE'`;
      assert.equal(sport.label, 'Edited label');
      const [{ count: sportCount }] =
        await client`SELECT count(*)::int AS count FROM editor_options WHERE kind = 'sports'`;
      assert.equal(sportCount, 9);
    });
  },
);

test(
  'an existing Drizzle database upgrades without changing articles; changed history is rejected',
  { skip: !integration },
  async () => {
    const folder = await mkdtemp(join(tmpdir(), 'blog-migrations-upgrade-'));
    try {
      const journal = JSON.parse(
        await readFile(join(migrationsFolder, 'meta/_journal.json'), 'utf8'),
      );
      const first = journal.entries[0];
      await mkdir(join(folder, 'meta'));
      await writeFile(
        join(folder, 'meta/_journal.json'),
        JSON.stringify({ ...journal, entries: [first] }),
      );
      await copyFile(
        join(migrationsFolder, `${first.tag}.sql`),
        join(folder, `${first.tag}.sql`),
      );
      await withDatabase(async (url, client) => {
        await migrate(drizzle(client), { migrationsFolder: folder });
        const data = {
          title: 'Existing article',
          content: '**Markdown**',
          participants: ['Ambre'],
          sports: ['ESCALADE_COUENNE'],
        };
        await client`INSERT INTO articles (id) VALUES ('existing')`;
        await client`INSERT INTO drafts (id, revision, data) VALUES ('existing', 8, ${JSON.stringify(data)}::jsonb)`;
        assert.equal(await applyMigrations(url), journal.entries.length - 1);
        const [draft] =
          await client`SELECT revision, data FROM drafts WHERE id = 'existing'`;
        assert.deepEqual(draft, { revision: 8, data });
        assert.equal(
          (
            await client`SELECT label FROM editor_options WHERE kind = 'participants'`
          )[0].label,
          'Ambre',
        );
        assert.equal(await applyMigrations(url), 0);
        await client`UPDATE drizzle.__drizzle_migrations SET hash = 'changed' WHERE id = 1`;
        await assert.rejects(applyMigrations(url), /history differs/);
      });
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  },
);

test(
  'failed SQL rolls back both schema and journal; a corrected migration can retry',
  { skip: !integration },
  async () => {
    const folder = await mkdtemp(join(tmpdir(), 'blog-migrations-'));
    try {
      await mkdir(join(folder, 'meta'));
      const entry = {
        idx: 0,
        version: '7',
        when: 1,
        tag: '0000_probe',
        breakpoints: true,
      };
      await writeFile(
        join(folder, 'meta/_journal.json'),
        JSON.stringify({
          version: '7',
          dialect: 'postgresql',
          entries: [entry],
        }),
      );
      const sql =
        'CREATE TABLE migration_probe (value text);\n--> statement-breakpoint\n';
      await writeFile(
        join(folder, '0000_probe.sql'),
        `${sql}SELECT definitely_invalid_sql;`,
      );
      await withDatabase(async (url, client) => {
        await assert.rejects(applyMigrations(url, folder));
        const [tables] =
          await client`SELECT to_regclass('public.migration_probe') AS probe, to_regclass('drizzle.__drizzle_migrations') AS journal`;
        assert.equal(tables.probe, null);
        assert.equal(tables.journal, null);
        await writeFile(
          join(folder, '0000_probe.sql'),
          `${sql}INSERT INTO migration_probe VALUES ('once');`,
        );
        assert.equal(await applyMigrations(url, folder), 1);
        assert.equal(await applyMigrations(url, folder), 0);
        assert.equal((await client`SELECT * FROM migration_probe`).length, 1);
      });
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  },
);
