import { readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { eq, sql } from 'drizzle-orm';
import { database } from '../db';
import {
  articles,
  drafts,
  publications,
  snapshots,
  migrations,
} from '../db/schema';
import {
  assemble,
  compare,
  sha256,
  stable,
  type PhotoMap,
} from '../lib/migration';
const args = process.argv.slice(2);
const dir = args[0];
if (!dir)
  throw new Error(
    'Usage: npm run migrate:s3 -- <snapshot-directory> [--apply|--verify] [--production] [--mapping <file>]',
  );
const manifest = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'));
if (manifest.version !== 1 || manifest.files?.length !== 2)
  throw new Error('Invalid manifest');
const source: unknown[] = [];
for (const expected of ['adventure-data.json', 'adventure-content.json']) {
  const f = manifest.files.find((f: { file: string }) => f.file === expected);
  if (!f || basename(f.file) !== f.file)
    throw new Error('Invalid manifest filename');
  const raw = await readFile(join(dir, f.file), 'utf8');
  if (sha256(raw) !== f.sha256) throw new Error(`Checksum mismatch ${f.file}`);
  const parsed = JSON.parse(raw);
  if (parsed.length !== f.records) throw new Error('Record count mismatch');
  source.push(parsed);
}
if (
  sha256(manifest.files.map((f: { sha256: string }) => f.sha256).join(':')) !==
  manifest.checksum
)
  throw new Error('Snapshot checksum mismatch');
const mappingIndex = args.indexOf('--mapping');
const mapping: PhotoMap =
  mappingIndex < 0
    ? {}
    : JSON.parse(await readFile(args[mappingIndex + 1], 'utf8'));
const report = assemble(source[0], source[1], mapping);
console.log(
  JSON.stringify(
    {
      checksum: manifest.checksum,
      counts: report.counts,
      issues: report.issues,
    },
    null,
    2,
  ),
);
if (report.issues.length) process.exitCode = 1;
else if (args.includes('--apply') || args.includes('--verify')) {
  if (args.includes('--production') && !manifest.publishingFrozen)
    throw new Error(
      'Production requires a final snapshot with publishing frozen',
    );
  if (
    !args.includes('--production') &&
    process.env.MIGRATION_DATABASE_ROLE !== 'rehearsal'
  )
    throw new Error(
      'Set MIGRATION_DATABASE_ROLE=rehearsal for an isolated rehearsal database, or explicitly pass --production',
    );
  const db = database().db;
  const mappingChecksum = sha256(stable(mapping));
  try {
    if (args.includes('--apply'))
      console.log(
        await db.transaction(async (tx) => {
          await tx.execute(
            sql`select pg_advisory_xact_lock(hashtextextended('s3-migration',0))`,
          );
          const [completed] = await tx
            .select()
            .from(migrations)
            .where(eq(migrations.checksum, manifest.checksum));
          if (completed) {
            if (
              (completed.manifest as { mappingChecksum: string })
                .mappingChecksum !== mappingChecksum
            )
              throw new Error(
                'Snapshot already imported with a different mapping',
              );
            return 'Completed snapshot: no-op (newer edits preserved)';
          }
          for (const a of [...report.articles].sort((a, b) =>
            a.id.localeCompare(b.id),
          )) {
            await tx.execute(
              sql`select pg_advisory_xact_lock(hashtextextended(${a.id},0))`,
            );
            const [existing] = await tx
              .select()
              .from(articles)
              .where(eq(articles.id, a.id));
            if (existing)
              throw new Error(
                `Target conflict: ${a.id}; transaction rolled back`,
              );
            await tx.insert(articles).values({ id: a.id });
            await tx.insert(drafts).values({ id: a.id, data: a, revision: 1 });
            await tx
              .insert(publications)
              .values({ id: a.id, data: a, revision: 1 });
            await tx
              .insert(snapshots)
              .values({ id: a.id, data: a, revision: 1 });
          }
          await tx
            .insert(migrations)
            .values({
              checksum: manifest.checksum,
              manifest: { ...manifest, mappingChecksum, counts: report.counts },
            });
          return 'Import committed';
        }),
      );
    if (args.includes('--verify')) {
      const issues = await db.transaction(
        async (tx) => {
          const published = await tx.select().from(publications);
          const working = await tx.select().from(drafts);
          const history = await tx.select().from(snapshots);
          return [
            ...compare(
              report.articles,
              published.map((p) => p.data),
            ),
            ...compare(
              report.articles,
              working.map((d) => d.data),
            ).map((x) => `draft: ${x}`),
            ...report.articles.flatMap((a) => {
              const p = published.find((p) => p.id === a.id),
                d = working.find((d) => d.id === a.id),
                s = history.find((s) => s.id === a.id && s.revision === 1);
              return p?.revision === 1 &&
                d?.revision === 1 &&
                s &&
                stable(s.data) === stable(a)
                ? []
                : [`Initial revision/snapshot mismatch: ${a.id}`];
            }),
          ];
        },
        { isolationLevel: 'repeatable read', accessMode: 'read only' },
      );
      console.log(
        JSON.stringify(
          { verification: issues.length ? 'FAILED' : 'PASSED', issues },
          null,
          2,
        ),
      );
      if (issues.length) process.exitCode = 1;
    }
  } finally {
    await database().client.end();
  }
}
