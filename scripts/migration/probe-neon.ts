// Read-only credential check; the connection URL is never printed or persisted.
import { readFile } from 'node:fs/promises';
import postgres from 'postgres';
let client: ReturnType<typeof postgres> | undefined;
try {
  const value = process.argv[2]
    ? (await readFile(process.argv[2], 'utf8')).trim()
    : process.env.DATABASE_URL;
  if (!value) throw new Error('Missing connection URL');
  const url = new URL(value);
  if (
    !['postgres:', 'postgresql:'].includes(url.protocol) ||
    !url.hostname.endsWith('.neon.tech')
  )
    throw new Error('Expected a Neon PostgreSQL connection URL');
  client = postgres(value, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 5,
    ssl: 'require',
  });
  const result = await client.begin('read only', async (tx) => {
    const [identity] = await tx`select current_database() as database`;
    const tables =
      await tx`select schemaname,tablename from pg_catalog.pg_tables where schemaname not in ('pg_catalog','information_schema') order by schemaname,tablename`;
    return {
      connected: true,
      database: identity.database,
      userTableCount: tables.length,
      emptyDatabase: tables.length === 0,
    };
  });
  console.log(JSON.stringify(result, null, 2));
} catch {
  console.error(
    'Neon read-only check failed. Check the connection URL, permissions and network access; no credentials were logged.',
  );
  process.exitCode = 1;
} finally {
  if (client) await client.end();
}
