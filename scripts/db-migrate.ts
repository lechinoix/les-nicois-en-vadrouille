import {
  applyMigrations,
  migrationDatabaseUrl,
  migrationErrorMessage,
} from './migrations';

try {
  const count = await applyMigrations(migrationDatabaseUrl(process.env));
  console.log(
    `Database migrations complete: ${count} applied${count === 0 ? ' (already up to date)' : ''}.`,
  );
} catch (error) {
  console.error(migrationErrorMessage(error));
  process.exitCode = 1;
}
