import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { readMigrationFiles } from 'drizzle-orm/migrator';

export class MigrationConfigurationError extends Error {}

export function migrationDatabaseUrl(
  env: Readonly<Record<string, string | undefined>>,
): string {
  const value = env.MIGRATION_DATABASE_URL || env.DATABASE_URL;
  if (!value) {
    throw new MigrationConfigurationError(
      'Set DATABASE_URL or MIGRATION_DATABASE_URL before applying migrations.',
    );
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new MigrationConfigurationError(
      'The migration database URL is invalid.',
    );
  }
  if (
    !['postgres:', 'postgresql:'].includes(url.protocol) ||
    !url.hostname ||
    url.pathname.length < 2
  ) {
    throw new MigrationConfigurationError(
      'The migration database URL must identify a PostgreSQL database.',
    );
  }
  // Neon uses the same endpoint and credentials for direct and pooled connections.
  // Migrations use the direct endpoint; the application's pool remains unchanged.
  if (url.hostname.endsWith('.neon.tech')) {
    url.hostname = url.hostname.replace(/^([^.]+)-pooler\./, '$1.');
  }
  return url.toString();
}

export const migrationsFolder = fileURLToPath(
  new URL('../db/migrations', import.meta.url),
);

export async function applyMigrations(
  databaseUrl: string,
  folder = migrationsFolder,
): Promise<number> {
  const migrations = readMigrationFiles({ migrationsFolder: folder });
  const client = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    connect_timeout: 15,
    onnotice: () => {},
    connection: { application_name: 'blog-migrations' },
  });
  try {
    return await client.begin('isolation level read committed', async (tx) => {
      await tx`SET LOCAL lock_timeout = '60s'`;
      await tx`SET LOCAL statement_timeout = '120s'`;
      // Hold the lock BEFORE reading the journal. A second deployment must see
      // the first deployment's committed history. Disconnect/rollback releases it.
      await tx`SELECT pg_advisory_xact_lock(724119, 1)`;

      // Keep Drizzle's existing journal format and SQL-file checksums. Creating
      // the journal and applying all pending files are part of this transaction.
      await tx`CREATE SCHEMA IF NOT EXISTS drizzle`;
      await tx`CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint
      )`;
      const applied = await tx<{ hash: string; created_at: string }[]>`
        SELECT hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at, id
      `;
      for (const [index, entry] of applied.entries()) {
        const file = migrations[index];
        if (
          !file ||
          file.hash !== entry.hash ||
          file.folderMillis !== Number(entry.created_at)
        ) {
          throw new MigrationConfigurationError(
            'Database migration history differs from this checkout. Use the latest migrations; never edit applied SQL files.',
          );
        }
      }
      for (const migration of migrations.slice(applied.length)) {
        for (const statement of migration.sql) await tx.unsafe(statement);
        await tx`INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
          VALUES (${migration.hash}, ${migration.folderMillis})`;
      }
      return migrations.length - applied.length;
    });
  } finally {
    await client.end({ timeout: 5 });
  }
}

export function migrationErrorMessage(error: unknown): string {
  if (error instanceof MigrationConfigurationError) return error.message;
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : '';
  // PostgreSQL errors may include queries, row contents, or connection details.
  return `Migration failed${/^[A-Z0-9]{5}$/.test(code) ? ` (SQLSTATE ${code})` : ''}. Check database connectivity and pending SQL migrations before retrying.`;
}
