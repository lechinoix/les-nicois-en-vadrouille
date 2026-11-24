import {
  readFile,
  writeFile,
  rename,
  mkdir,
  readdir,
  lstat,
} from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
import { z } from 'zod';
import { sha256, stable } from '../../lib/migration';
export const configSchema = z
  .object({
    hostingMode: z.enum(['vercel', 'unchanged']).default('vercel'),
    projectId: z.string().default(''),
    teamId: z.string().default(''),
    neonProjectId: z.string().optional(),
    origin: z
      .string()
      .url()
      .refine(
        (v) => new URL(v).protocol === 'https:' && new URL(v).origin === v,
      )
      .or(z.literal(''))
      .default(''),
    bucket: z.string().default('lesnicoisenvadrouille'),
    region: z.string().default('eu-west-3'),
    runDirectory: z.string(),
    backupDirectory: z.string(),
    browserDrafts: z.union([
      z.enum(['none', 'unconfirmed']),
      z.array(z.string()).min(1),
    ]),
    cloudName: z.string().default('dowsxscl0'),
    photoPlan: z.string().optional(),
  })
  .strict()
  .superRefine((config, ctx) => {
    if (config.hostingMode === 'vercel') {
      if (!config.projectId.startsWith('prj_'))
        ctx.addIssue({
          code: 'custom',
          path: ['projectId'],
          message: 'Vercel project ID is required for hosting automation',
        });
      if (!config.teamId)
        ctx.addIssue({
          code: 'custom',
          path: ['teamId'],
          message: 'Vercel team ID is required for hosting automation',
        });
      if (!config.origin)
        ctx.addIssue({
          code: 'custom',
          path: ['origin'],
          message: 'Production origin is required for hosting automation',
        });
    }
  });
export type Config = z.infer<typeof configSchema>;
export class Stop extends Error {}
export const dataOnlyStages = [
  'plan',
  'preflight',
  'freeze',
  'capture',
  'prepare',
  'import',
  'status',
  'export',
];
export function assertAllowedStage(config: Config, stage: string) {
  if (config.hostingMode === 'unchanged' && !dataOnlyStages.includes(stage))
    throw new Stop(
      'Hosting changes are disabled for this run. Complete the data migration without Vercel; deployment is a separate later step.',
    );
}
export function credentialNames(config: Config, deploy = false) {
  return [
    ...(config.hostingMode === 'vercel' ? ['VERCEL_TOKEN'] : []),
    'DATABASE_URL',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    ...(deploy && config.hostingMode === 'vercel'
      ? [
          'EDITOR_PASSWORD',
          'GOOGLE_CLIENT_ID',
          'GOOGLE_CLIENT_SECRET',
          'NEON_AUTH_BASE_URL',
          'NEON_AUTH_COOKIE_SECRET',
        ]
      : []),
  ];
}
export async function readJson(path: string) {
  return JSON.parse(await readFile(path, 'utf8'));
}
export async function atomicJson(path: string, value: unknown) {
  await writeFile(`${path}.tmp`, JSON.stringify(value, null, 2), {
    mode: 0o600,
  });
  await rename(`${path}.tmp`, path);
}
export function freezeStatement(bucket: string) {
  return {
    Sid: 'NicoisMigrationContentFreeze',
    Effect: 'Deny',
    Principal: '*',
    Action: ['s3:PutObject', 's3:DeleteObject', 's3:DeleteObjectVersion'],
    Resource: [
      `arn:aws:s3:::${bucket}/data/adventure-data/*`,
      `arn:aws:s3:::${bucket}/data/adventure-content/*`,
    ],
  };
}
export function withFreeze(policy: any, bucket: string) {
  const result = structuredClone(
    policy ?? { Version: '2012-10-17', Statement: [] },
  );
  if (!Array.isArray(result.Statement))
    throw new Stop('Unexpected S3 policy shape');
  const desired = freezeStatement(bucket);
  const old = result.Statement.find((s: any) => s.Sid === desired.Sid);
  if (old && stable(old) !== stable(desired))
    throw new Stop('Freeze policy SID already exists with different rules');
  if (!old) result.Statement.push(desired);
  return result;
}
export function isFrozen(policy: any, bucket: string) {
  return (
    Array.isArray(policy?.Statement) &&
    policy.Statement.some(
      (s: any) => stable(s) === stable(freezeStatement(bucket)),
    )
  );
}
export async function loadSnapshot(directory: string) {
  const manifest = await readJson(join(directory, 'manifest.json'));
  const values = [];
  if (manifest.version !== 1 || manifest.files?.length !== 2)
    throw new Stop('Invalid snapshot manifest');
  for (const name of ['adventure-data.json', 'adventure-content.json']) {
    const f = manifest.files.find((f: any) => f.file === name);
    if (!f) throw new Stop(`Missing ${name}`);
    const raw = await readFile(join(directory, name), 'utf8');
    const value = JSON.parse(raw);
    if (
      sha256(raw) !== f.sha256 ||
      !Array.isArray(value) ||
      value.length !== f.records
    )
      throw new Stop(`Snapshot integrity failed: ${name}`);
    values.push(value);
  }
  if (
    sha256(manifest.files.map((f: any) => f.sha256).join(':')) !==
    manifest.checksum
  )
    throw new Stop('Manifest checksum mismatch');
  if (
    manifest.repairsChecksum &&
    sha256(stable(await readJson(join(directory, 'repairs.json')))) !==
      manifest.repairsChecksum
  )
    throw new Stop('Repair audit checksum mismatch');
  return { manifest, metadata: values[0], content: values[1] };
}
export function repairLegacy(metadata: any[], content: any[]) {
  const data = structuredClone(metadata),
    text = structuredClone(content);
  const audit: any[] = [];
  const record = (
    document: string,
    id: string,
    path: string,
    before: any,
    after: any,
    reason: string,
  ) =>
    audit.push({
      document,
      id,
      path,
      before: before === undefined ? { missing: true } : before,
      after,
      reason,
    });
  function photo(p: any, document: string, id: string, path: string) {
    if (!p || typeof p !== 'object') return;
    if (p.albumId === undefined) {
      record(
        document,
        id,
        `${path}.albumId`,
        undefined,
        '',
        'No legacy album identifier was recorded; retain as explicitly unknown.',
      );
      p.albumId = '';
    }
    if (
      p.formats?.xlarge &&
      ['url', 'width', 'height'].every((k) => p.formats.xlarge[k] === null)
    ) {
      const valid = Object.values(p.formats)
        .filter(
          (f: any) => typeof f?.url === 'string' && f.width > 0 && f.height > 0,
        )
        .sort((a: any, b: any) => b.width * b.height - a.width * a.height);
      if (valid.length) {
        record(
          document,
          id,
          `${path}.formats.xlarge`,
          p.formats.xlarge,
          valid[0],
          'Reuse the largest recorded valid format; no new asset or dimensions invented.',
        );
        p.formats.xlarge = structuredClone(valid[0]);
      }
    }
  }
  for (const a of data) {
    for (const field of ['places', 'participants'])
      if (a[field] === undefined) {
        record(
          'metadata',
          a.id,
          field,
          undefined,
          [],
          'No entries recorded in the source; represent as an empty list.',
        );
        a[field] = [];
      }
    photo(a.cover, 'metadata', a.id, 'cover');
  }
  for (const a of text)
    if (Array.isArray(a.pictures))
      a.pictures.forEach((p: any, i: number) =>
        photo(p, 'content', a.id, `pictures.${i}`),
      );
  return { metadata: data, content: text, audit };
}
export function googleUrls(value: unknown) {
  const result = new Set<string>();
  const visit = (v: unknown) => {
    if (typeof v === 'string') {
      for (const url of v.match(/https?:\/\/[^\s)\]<>"']+/g) || [])
        try {
          const u = new URL(url);
          if (u.hostname.endsWith('.googleusercontent.com')) result.add(url);
        } catch {}
    } else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v).forEach(visit);
  };
  visit(value);
  return [...result];
}
export async function copyVerified(source: string, destination: string) {
  await mkdir(destination, { recursive: true, mode: 0o700 });
  for (const item of await readdir(source, { withFileTypes: true })) {
    if (item.isSymbolicLink()) throw new Stop('Backup refuses symbolic links');
    const from = join(source, item.name),
      to = join(destination, item.name);
    if (item.isDirectory()) await copyVerified(from, to);
    else {
      const bytes = await readFile(from);
      await writeFile(to, bytes, { mode: 0o600 });
      if (sha256(await readFile(to)) !== sha256(bytes))
        throw new Stop('Backup verification failed');
    }
  }
}
const directories = ['app', 'components', 'lib', 'db', 'public'];
const files = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'next.config.ts',
  'next-env.d.ts',
  'postcss.config.mjs',
  'proxy.ts',
  'vercel.json',
];
export async function deploymentFiles(root: string) {
  const output: { file: string; data: string; encoding: 'base64' }[] = [];
  async function visit(path: string) {
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) throw new Stop('Deployment refuses symlinks');
    if (stat.isDirectory()) {
      for (const name of await readdir(path)) {
        if (name.startsWith('.'))
          throw new Stop('Hidden file in deployment source');
        await visit(join(path, name));
      }
    } else
      output.push({
        file: relative(root, path).split('\\').join('/'),
        data: (await readFile(path)).toString('base64'),
        encoding: 'base64',
      });
  }
  for (const name of [...directories, ...files]) await visit(join(root, name));
  return output.sort((a, b) => a.file.localeCompare(b.file));
}
export function assertSeparateBackup(config: Config) {
  const run = resolve(config.runDirectory),
    backup = resolve(config.backupDirectory);
  if (
    backup === run ||
    backup.startsWith(run + '/') ||
    run.startsWith(backup + '/')
  )
    throw new Stop('Backup directory must be separate from the run directory');
}
export const runtimeKeys = [
  'DATABASE_URL',
  'NEON_AUTH_BASE_URL',
  'NEON_AUTH_COOKIE_SECRET',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EDITOR_PASSWORD_HASH',
  'SESSION_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'MIGRATION_MAINTENANCE_TOKEN',
] as const;
export function requiredEnv(names: readonly string[]) {
  const missing = names.filter((k) => !process.env[k]);
  if (missing.length)
    throw new Stop(`Missing credentials: ${missing.join(', ')}`);
}
export function redact(value: string) {
  for (const [k, v] of Object.entries(process.env))
    if (
      v &&
      v.length >= 4 &&
      /TOKEN|SECRET|PASSWORD|DATABASE_URL|API_KEY|ACCESS_KEY/.test(k)
    )
      value = value.split(v).join('[REDACTED]');
  return value.replace(
    /postgres(?:ql)?:\/\/[^\s"']+/g,
    '[REDACTED DATABASE URL]',
  );
}
