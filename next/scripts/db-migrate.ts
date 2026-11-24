import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { database } from '../db';
try {
  await migrate(database().db, { migrationsFolder: './db/migrations' });
} finally {
  await database().client.end();
}
