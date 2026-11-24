import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import postgres from 'postgres';
import { emptyArticle, type Article } from '../lib/model';
import { sha256 } from '../lib/migration';
test(
  'migration: dry run, transactional import, exact verification, no-op rerun and rollback on conflict',
  { skip: process.env.TEST_DATABASE_DISPOSABLE !== 'true' },
  async () => {
    const admin = postgres(process.env.DATABASE_URL!, { max: 1 });
    const name = `migration_${crypto.randomUUID().replaceAll('-', '')}`;
    await admin.unsafe(`create database ${name}`);
    const url = new URL(process.env.DATABASE_URL!);
    url.pathname = `/${name}`;
    const client = postgres(url.toString(), { max: 1 });
    const environment = {
      ...process.env,
      DATABASE_URL: url.toString(),
      MIGRATION_DATABASE_ROLE: 'rehearsal',
    };
    const setup = spawnSync(
      process.execPath,
      ['--import', 'tsx', 'scripts/db-migrate.ts'],
      { encoding: 'utf8', env: environment },
    );
    assert.equal(setup.status, 0, setup.stderr);
    const dir = await mkdtemp(join(tmpdir(), 'nicois-migration-'));
    const id = `migration-${crypto.randomUUID()}`;
    async function fixture(values: Article[]) {
      const metadata = values.map(
        ({ content, pictures, topos, ...rest }) => rest,
      );
      const content = values.map(({ id, content, pictures, topos }) => ({
        id,
        content,
        pictures,
        topos,
      }));
      const files = [];
      for (const [i, value] of [metadata, content].entries()) {
        const file = i ? 'adventure-content.json' : 'adventure-data.json';
        const raw = JSON.stringify(value);
        await writeFile(join(dir, file), raw);
        files.push({ file, sha256: sha256(raw), records: value.length });
      }
      await writeFile(
        join(dir, 'manifest.json'),
        JSON.stringify({
          version: 1,
          publishingFrozen: true,
          checksum: sha256(files.map((f) => f.sha256).join(':')),
          files,
        }),
      );
    }
    function migrate(...args: string[]) {
      return spawnSync(
        process.execPath,
        ['--import', 'tsx', 'scripts/migrateToNeon.ts', dir, ...args],
        { encoding: 'utf8', env: environment },
      );
    }
    try {
      const a = {
        ...emptyArticle(id),
        title: 'Snapshot',
        content: 'Exact **Markdown**\n',
      };
      await fixture([a]);
      assert.equal(migrate().status, 0);
      assert.equal(
        (await client`select id from articles where id=${id}`).length,
        0,
      );
      const applied = migrate('--apply');
      assert.equal(applied.status, 0, applied.stderr);
      assert.equal(
        (await client`select revision from drafts where id=${id}`)[0].revision,
        1,
      );
      const verified = migrate('--verify');
      assert.equal(verified.status, 0, verified.stdout + verified.stderr);
      const saved = await client`select data from publications where id=${id}`;
      assert.deepEqual(saved[0].data, a);
      await client`update drafts set revision=2,data=jsonb_set(data,'{title}','"Newer edit"') where id=${id}`;
      const repeated = migrate('--apply');
      assert.equal(repeated.status, 0, repeated.stderr);
      assert.match(repeated.stdout, /no-op/);
      assert.equal(
        (await client`select data from drafts where id=${id}`)[0].data.title,
        'Newer edit',
      );
      const newId = `aaa-${id}`;
      await fixture([{ ...a, id: newId }, a]);
      const conflict = migrate('--apply');
      assert.notEqual(conflict.status, 0);
      assert.equal(
        (await client`select id from articles where id=${newId}`).length,
        0,
        'earlier inserts must roll back',
      );
      await writeFile(join(dir, 'adventure-data.json'), '[]');
      assert.notEqual(
        migrate('--apply').status,
        0,
        'tampered file must fail checksum validation',
      );
    } finally {
      await client.end();
      await admin.unsafe(`drop database ${name}`);
      await admin.end();
      await rm(dir, { recursive: true, force: true });
    }
  },
);
