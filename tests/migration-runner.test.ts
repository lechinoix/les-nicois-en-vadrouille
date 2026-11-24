import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  configSchema,
  withFreeze,
  isFrozen,
  repairLegacy,
  googleUrls,
  copyVerified,
  deploymentFiles,
  redact,
  assertSeparateBackup,
} from '../scripts/migration/core';
import { providers } from '../scripts/migration/providers';
const config = configSchema.parse({
  projectId: 'prj_test',
  teamId: 'team_test',
  origin: 'https://example.org',
  runDirectory: '/tmp/run',
  backupDirectory: '/tmp/backup',
  browserDrafts: 'unconfirmed',
});
test('S3 freeze preserves existing policy, scopes writes, and is idempotent', () => {
  const original = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'KeepPublicReads',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: 'arn:aws:s3:::test/*',
      },
    ],
  };
  const frozen = withFreeze(original, 'test');
  assert.equal(original.Statement.length, 1);
  assert.equal(frozen.Statement.length, 2);
  assert.ok(isFrozen(frozen, 'test'));
  assert.deepEqual(withFreeze(frozen, 'test'), frozen);
  assert.equal(isFrozen(frozen, 'another'), false);
  assert.ok(!frozen.Statement[1].Action.includes('s3:GetObject'));
  assert.throws(() =>
    withFreeze(
      { Statement: [{ Sid: 'NicoisMigrationContentFreeze', Action: '*' }] },
      'test',
    ),
  );
});
test('offline repairs preserve raw data and record every fallback', () => {
  const f = {
    url: 'https://res.cloudinary.com/cloud/image/upload/x',
    width: 100,
    height: 80,
  };
  const p = {
    id: 1,
    url: f.url,
    width: 100,
    height: 80,
    formats: { large: f, xlarge: { url: null, width: null, height: null } },
  };
  const source = [{ id: 'a', cover: p }];
  const content = [{ id: 'a', pictures: [p], content: 'unchanged' }];
  const before = JSON.stringify([source, content]);
  const repaired = repairLegacy(source, content);
  assert.equal(JSON.stringify([source, content]), before);
  assert.equal(repaired.audit.length, 6);
  assert.deepEqual(repaired.metadata[0].places, []);
  assert.equal(repaired.content[0].pictures[0].id, 1);
  assert.equal(repaired.content[0].pictures[0].formats.xlarge.url, f.url);
  assert.deepEqual(repairLegacy(repaired.metadata, repaired.content).audit, []);
});
test('Google legacy extraction deduplicates and rejects lookalike hosts', () => {
  assert.deepEqual(
    googleUrls([
      '![](https://lh3.googleusercontent.com/a=w100)',
      { url: 'https://lh3.googleusercontent.com/a=w100' },
      'https://googleusercontent.com.evil.org/x',
    ]),
    ['https://lh3.googleusercontent.com/a=w100'],
  );
});
test('backup copies are verified and overlap is rejected', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'migration-backup-'));
  try {
    await mkdir(join(dir, 'source'));
    await writeFile(join(dir, 'source', 'raw.json'), 'EXACT BYTES');
    await copyVerified(join(dir, 'source'), join(dir, 'dest'));
    assert.equal(
      await readFile(join(dir, 'dest', 'raw.json'), 'utf8'),
      'EXACT BYTES',
    );
    assert.throws(() =>
      assertSeparateBackup({
        ...config,
        runDirectory: dir,
        backupDirectory: join(dir, 'nested'),
      }),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test('deployment allowlist excludes migration inputs, credentials and generated output', async () => {
  const files = await deploymentFiles(resolve('.'));
  assert.ok(files.some((f) => f.file === 'proxy.ts'));
  assert.ok(files.some((f) => f.file === 'app/page.tsx'));
  assert.ok(files.some((f) => f.file === 'package.json'));
  const vercel = files.find((f) => f.file === 'vercel.json');
  assert.ok(vercel);
  assert.equal(
    JSON.parse(Buffer.from(vercel.data, 'base64').toString()).framework,
    'nextjs',
  );
  assert.ok(
    files.every(
      (f) =>
        !f.file.startsWith('next/') &&
        !f.file.includes('migration-data') &&
        !f.file.includes('.env') &&
        !f.file.includes('scripts/') &&
        !f.file.includes('.next/'),
    ),
  );
});
test('provider errors never include secret response bodies or authorization', async () => {
  const before = globalThis.fetch;
  const token = process.env.VERCEL_TOKEN;
  process.env.VERCEL_TOKEN = 'test-secret-never-print';
  globalThis.fetch = async () =>
    new Response('secret-provider-body', { status: 403 });
  try {
    await assert.rejects(providers(config).project(), (e) => {
      assert.ok(String(e).includes('HTTP 403'));
      assert.ok(!String(e).includes('secret-provider-body'));
      assert.ok(!String(e).includes('test-secret-never-print'));
      return true;
    });
    assert.equal(
      redact('Authorization test-secret-never-print'),
      'Authorization [REDACTED]',
    );
  } finally {
    globalThis.fetch = before;
    if (token) process.env.VERCEL_TOKEN = token;
    else delete process.env.VERCEL_TOKEN;
  }
});

test('data-only mode needs no Vercel identity or credentials and rejects hosting changes', async () => {
  const { assertAllowedStage, credentialNames } =
    await import('../scripts/migration/core');
  const dataOnly = configSchema.parse({
    hostingMode: 'unchanged',
    neonProjectId: 'nameless-moon-46656370',
    runDirectory: '/tmp/run',
    backupDirectory: '/tmp/backup',
    browserDrafts: 'none',
  });
  assert.equal(dataOnly.projectId, '');
  assert.ok(!credentialNames(dataOnly, true).includes('VERCEL_TOKEN'));
  assert.ok(!credentialNames(dataOnly, true).includes('GOOGLE_CLIENT_SECRET'));
  for (const stage of [
    'plan',
    'preflight',
    'freeze',
    'capture',
    'prepare',
    'import',
    'status',
    'export',
  ])
    assert.doesNotThrow(() => assertAllowedStage(dataOnly, stage));
  for (const stage of ['deploy', 'check', 'release', 'open'])
    assert.throws(
      () => assertAllowedStage(dataOnly, stage),
      /Hosting changes are disabled/,
    );
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw new Error('Unexpected network request');
  };
  try {
    await assert.rejects(
      providers(dataOnly).project(),
      /Vercel access is disabled/,
    );
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = original;
  }
});
