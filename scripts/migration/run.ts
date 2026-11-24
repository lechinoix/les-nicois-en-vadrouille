import { ZodError } from 'zod';
import { parseArgs } from 'node:util';
import {
  readFile,
  writeFile,
  mkdir,
  open,
  unlink,
  rename,
  access,
} from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { randomBytes, scryptSync } from 'node:crypto';
import { eq } from 'drizzle-orm';
import {
  configSchema,
  assertAllowedStage,
  credentialNames,
  dataOnlyStages,
  Stop,
  atomicJson,
  readJson,
  loadSnapshot,
  repairLegacy,
  googleUrls,
  copyVerified,
  assertSeparateBackup,
  withFreeze,
  isFrozen,
  requiredEnv,
  runtimeKeys,
  deploymentFiles,
  redact,
} from './core';
import { providers } from './providers';
import { sha256, stable, assemble } from '../../lib/migration';
import { articleSchema, articlePath, type Article } from '../../lib/model';
import { cloud, digest, readImage, uploadBytes } from '../../lib/photos';
import { database } from '../../db';
import {
  articles,
  drafts,
  publications,
  snapshots,
  migrations,
  assets,
} from '../../db/schema';
const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
process.chdir(root);
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    'secret-file': { type: 'string', multiple: true },
    snapshot: { type: 'string' },
    'retry-deploy': { type: 'boolean' },
  },
});
for (const entry of values['secret-file'] || []) {
  const at = entry.indexOf('=');
  const key = entry.slice(0, at);
  if (at < 1 || !/^[A-Z][A-Z0-9_]*$/.test(key))
    throw new Error('Expected --secret-file ENV_NAME=/secure/path');
  process.env[key] = (await readFile(entry.slice(at + 1), 'utf8')).trim();
}
const [command = 'plan', configFile = 'migration.config.json'] = positionals;
let unlock: (() => Promise<void>) | undefined;
let dbOpened = false;
try {
  const config = configSchema.parse(await readJson(resolve(configFile)));
  assertAllowedStage(config, command);
  assertSeparateBackup(config);
  const run = resolve(config.runDirectory),
    backup = resolve(config.backupDirectory);
  const api = providers(config);
  process.env.S3_BUCKET = config.bucket;
  process.env.AWS_REGION = config.region;
  process.env.CLOUDINARY_CLOUD_NAME = config.cloudName;
  if (command === 'plan') {
    console.log(
      JSON.stringify(
        {
          hostingMode: config.hostingMode,
          neonProjectId: config.neonProjectId,
          projectId: config.projectId,
          origin: config.origin,
          bucket: config.bucket,
          runDirectory: run,
          backupDirectory: backup,
          browserDrafts: config.browserDrafts,
          stages:
            config.hostingMode === 'unchanged'
              ? dataOnlyStages.filter((s) => s !== 'plan')
              : [
                  'preflight',
                  'freeze',
                  'capture',
                  'prepare',
                  'import',
                  'deploy',
                  'status',
                  'check',
                  'release',
                  'status',
                  'open',
                ],
          missingCredentials: credentialNames(config, true).filter(
            (k) => !process.env[k],
          ),
          aws: 'Uses the default AWS credential chain. Needs GetObject/GetBucketPolicy/PutBucketPolicy for this bucket only.',
        },
        null,
        2,
      ),
    );
  } else {
    await mkdir(run, { recursive: true, mode: 0o700 });
    await mkdir(backup, { recursive: true, mode: 0o700 });
    const lock = await open(join(run, '.lock'), 'wx', 0o600).catch(() => {
      throw new Stop(
        'Run is locked. Confirm no migration process is running before removing .lock.',
      );
    });
    await lock.writeFile(JSON.stringify({ pid: process.pid, command }));
    await lock.close();
    unlock = () => unlink(join(run, '.lock'));
    const statePath = join(run, 'state.json');
    let state: any = {
      version: 1,
      configHash: sha256(stable(config)),
      runId: randomBytes(12).toString('hex'),
    };
    try {
      state = await readJson(statePath);
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
    }
    if (state.database && process.env.DATABASE_URL) {
      const u = new URL(process.env.DATABASE_URL);
      if (sha256(`${u.hostname}:${u.port}${u.pathname}`) !== state.database)
        throw new Stop('Database target differs from this run');
    }
    if (state.configHash !== sha256(stable(config)))
      throw new Stop(
        'Configuration differs from the recorded run. Use the original config or a new run directory.',
      );
    async function save() {
      await atomicJson(statePath, state);
    }
    async function ensureFrozen() {
      if (config.hostingMode === 'vercel') {
        const p = await api.project();
        if (p.paused !== true)
          throw new Stop('Vercel project must be paused for this stage');
      }
      if (!isFrozen(await api.policy(), config.bucket))
        throw new Stop('S3 write freeze is missing');
    }
    function db() {
      dbOpened = true;
      return database().db;
    }
    function exec(script: string, args: string[], label: string) {
      const result = spawnSync(
        process.execPath,
        ['--import', 'tsx', join(root, 'scripts', script), ...args],
        {
          cwd: root,
          env: process.env,
          encoding: 'utf8',
          maxBuffer: 16 * 1024 * 1024,
        },
      );
      const output = redact((result.stdout || '') + (result.stderr || ''));
      return { ok: result.status === 0, output, label };
    }
    async function checked(script: string, args: string[], label: string) {
      const result = exec(script, args, label);
      await writeFile(join(run, `${label}.log`), result.output, {
        mode: 0o600,
      });
      if (!result.ok)
        throw new Stop(
          `${label} failed; see ${join(run, `${label}.log`)} (credentials redacted).`,
        );
    }
    async function readPrepared() {
      if (!state.prepared) throw new Stop('Run prepare first');
      const source = await loadSnapshot(join(run, 'prepared'));
      const mapping = await readJson(join(run, 'photo-map.json'));
      const hash = sha256(
        stable({ snapshot: source.manifest.checksum, mapping }),
      );
      if (hash !== state.prepared)
        throw new Stop(
          'Prepared dataset changed; run prepare again before import.',
        );
      return { ...source, mapping, hash };
    }
    async function exportNeon(name: string) {
      const value = await db().transaction(
        async (tx) => ({
          version: 1,
          exportedAt: new Date().toISOString(),
          drafts: await tx.select().from(drafts),
          publications: await tx.select().from(publications),
          snapshots: await tx.select().from(snapshots),
          migrations: await tx.select().from(migrations),
          assets: await tx.select().from(assets),
        }),
        { isolationLevel: 'repeatable read', accessMode: 'read only' },
      );
      await atomicJson(join(run, name), value);
      await atomicJson(join(backup, name), value);
      if (
        sha256(await readFile(join(run, name))) !==
        sha256(await readFile(join(backup, name)))
      )
        throw new Stop('Neon backup mismatch');
      return value;
    }
    async function quota() {
      requiredEnv(['CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']);
      const usage = await cloud().api.usage();
      const report = {
        checkedAt: new Date().toISOString(),
        plan: usage.plan,
        credits: usage.credits,
        storage: usage.storage,
        bandwidth: usage.bandwidth,
        transformations: usage.transformations,
      };
      await atomicJson(join(run, 'cloudinary-usage.json'), report);
      if (!/free/i.test(String(usage.plan)))
        throw new Stop(
          'Cloudinary plan is not reported as Free; check the account before continuing',
        );
      if (
        !Number.isFinite(usage.credits?.usage) ||
        !Number.isFinite(usage.credits?.limit) ||
        usage.credits.limit <= 0 ||
        usage.credits.usage / usage.credits.limit >= 0.8
      )
        throw new Stop(
          'Cloudinary credit usage unavailable or above 80%; leave headroom before uploads',
        );
    }
    async function runtimeSecrets() {
      let generated;
      try {
        generated = await readJson(join(run, '.runtime-secrets.json'));
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
        generated = {
          SESSION_SECRET: randomBytes(48).toString('hex'),
          MIGRATION_MAINTENANCE_TOKEN: randomBytes(48).toString('hex'),
        };
        await atomicJson(join(run, '.runtime-secrets.json'), generated);
      }
      Object.assign(process.env, generated);
      if (process.env.EDITOR_PASSWORD) {
        if (process.env.EDITOR_PASSWORD.length < 12)
          throw new Stop('Editor password must contain at least 12 characters');
        const salt = randomBytes(16).toString('hex');
        process.env.EDITOR_PASSWORD_HASH = `${salt}:${scryptSync(process.env.EDITOR_PASSWORD, salt, 64).toString('hex')}`;
      }
    }
    async function assertProductionDeployment(id: string) {
      const p = await api.project();
      if (p.targets?.production?.id !== id)
        throw new Stop(
          'The recorded deployment is not the current production target; keep the project paused and inspect aliases.',
        );
    }
    async function deploymentStatus() {
      if (!state.deployment?.id) {
        if (state.deployment?.attempt) {
          const list = await api.vercel(
            `/v6/deployments?projectId=${config.projectId}&limit=100`,
          );
          const found = list.deployments?.find(
            (d: any) => d.meta?.migrationAttempt === state.deployment.attempt,
          );
          if (!found)
            throw new Stop(
              'Deployment request outcome is unknown; inspect Vercel before retrying. No duplicate deployment was started.',
            );
          state.deployment.id = found.uid || found.id;
          await save();
        } else throw new Stop('No deployment has been started');
      }
      const d = await api.vercel(`/v13/deployments/${state.deployment.id}`);
      if (d.projectId !== config.projectId)
        throw new Stop('Deployment belongs to another project');
      state.deployment.status = d.readyState;
      state.deployment.url = d.url;
      await save();
      return d;
    }
    async function deploy(phase: 'maintenance' | 'release') {
      const prepared = await readPrepared();
      if (state.verified !== prepared.hash)
        throw new Stop('Import and verification must pass before deployment');
      await runtimeSecrets();
      requiredEnv(runtimeKeys);
      await quota();
      if (!isFrozen(await api.policy(), config.bucket))
        throw new Stop('Legacy S3 writes must remain frozen');
      if (phase === 'maintenance') await ensureFrozen();
      else if (!state.checked)
        throw new Stop('Run check successfully before release');
      const files = await deploymentFiles(root);
      const sourceHash = sha256(stable(files));
      if (phase === 'release' && state.checked !== sourceHash)
        throw new Stop(
          'Source changed since smoke checks; deploy and check maintenance version again',
        );
      if (state.deployment?.phase === phase) {
        const prior = await deploymentStatus();
        if (!values['retry-deploy']) {
          console.log(
            'Existing deployment retained; use status/check/open, or --retry-deploy after a terminal failure.',
          );
          return;
        }
        if (
          !['ERROR', 'CANCELED'].includes(prior.readyState) &&
          !(
            prior.readyState === 'READY' &&
            state.deployment.sourceHash !== sourceHash
          )
        ) {
          throw new Stop(
            'Cannot retry an active deployment or recreate identical READY source.',
          );
        }
      }
      if (state.deployment) {
        state.deploymentHistory = [
          ...(state.deploymentHistory || []),
          state.deployment,
        ];
        await save();
      }
      const p = await api.project();
      const environment = Object.fromEntries(
        runtimeKeys.map((k) => [k, process.env[k]!]),
      );
      Object.assign(environment, {
        APP_ORIGIN: config.origin,
        CLOUDINARY_CLOUD_NAME: config.cloudName,
        EDITOR_WRITES_ENABLED: phase === 'release' ? 'true' : 'false',
        MIGRATION_MAINTENANCE: phase === 'maintenance' ? 'true' : 'false',
      });
      await api.vercel(
        `/v10/projects/${config.projectId}/env?upsert=true`,
        'POST',
        Object.entries(environment).map(([key, value]) => ({
          key,
          value,
          type: 'encrypted',
          target: ['production'],
        })),
      );
      const settings = {
        rootDirectory: null,
        framework: 'nextjs',
        buildCommand: 'npm run build',
        installCommand: 'npm ci',
        outputDirectory: null,
        nodeVersion: '24.x',
      };
      if (!state.originalProject) {
        state.originalProject = {
          rootDirectory: p.rootDirectory,
          framework: p.framework,
          buildCommand: p.buildCommand,
          installCommand: p.installCommand,
          outputDirectory: p.outputDirectory,
          nodeVersion: p.nodeVersion,
          productionDeployment: p.targets?.production?.id,
        };
        await save();
      }
      await api.vercel(`/v9/projects/${config.projectId}`, 'PATCH', settings);
      const attempt = randomBytes(12).toString('hex');
      state.deployment = { phase, attempt, sourceHash };
      await save();
      const d = await api.vercel('/v13/deployments', 'POST', {
        name: p.name,
        project: config.projectId,
        target: 'production',
        files,
        projectSettings: settings,
        meta: { migrationRun: state.runId, migrationAttempt: attempt },
      });
      state.deployment.id = d.id;
      state.deployment.url = d.url;
      await save();
      console.log(
        `Deployment submitted (${phase}). Run status until READY; no automatic retry creates extra builds.`,
      );
    }
    async function smoke(origin: string, maintenance: boolean) {
      await runtimeSecrets();
      const headers: Record<string, string> = maintenance
        ? { 'x-migration-token': process.env.MIGRATION_MAINTENANCE_TOKEN! }
        : {};
      const list = await db().select().from(publications);
      if (!list.length) throw new Stop('No published articles to check');
      for (const path of [
        '/',
        '/adventures',
        '/cv',
        articlePath(list[0].data),
      ]) {
        const r = await fetch(`${origin}${path}`, {
          headers,
          redirect: 'manual',
          signal: AbortSignal.timeout(30000),
        });
        if (r.status !== 200)
          throw new Stop(`Read check failed: ${path} returned ${r.status}`);
        const html = await r.text();
        if (
          path === articlePath(list[0].data) &&
          !html.includes(
            list[0].data.title
              .replaceAll('&', '&amp;')
              .replaceAll('<', '&lt;')
              .replaceAll('>', '&gt;')
              .replaceAll('"', '&quot;')
              .replaceAll("'", '&#x27;'),
          )
        )
          throw new Stop('Article title missing from rendered page');
      }
      const privateResponse = await fetch(`${origin}/api/articles`, {
        headers,
        redirect: 'manual',
      });
      if (privateResponse.status !== 401)
        throw new Stop('Private draft endpoint did not require authentication');
      if (maintenance) {
        const visitor = await fetch(origin, { redirect: 'manual' });
        if (visitor.status !== 503)
          throw new Stop('Maintenance gate is not active for visitors');
      }
    }
    if (command === 'preflight') {
      if (config.browserDrafts === 'unconfirmed')
        throw new Stop(
          'Confirm no browser-only drafts, or provide all browser export paths, before preflight.',
        );
      requiredEnv(credentialNames(config));
      if (config.hostingMode === 'vercel') {
        const p = await api.project();
        if (p.id !== config.projectId)
          throw new Stop('Vercel project identity mismatch');
        const domains = await api.vercel(
          `/v9/projects/${config.projectId}/domains`,
        );
        if (
          !domains.domains?.some(
            (d: any) => d.name === new URL(config.origin).hostname,
          )
        )
          throw new Stop(
            'Configured origin is not a domain of this Vercel project',
          );
      }
      await api.policy();
      dbOpened = true;
      await database().client`select 1`;
      await quota();
      if (Array.isArray(config.browserDrafts)) {
        for (const [i, path] of config.browserDrafts.entries()) {
          const value = await readJson(resolve(path));
          if (!Array.isArray(value))
            throw new Stop('Draft export must be a JSON array');
          await mkdir(join(run, 'browser-drafts'), {
            recursive: true,
            mode: 0o700,
          });
          await atomicJson(join(run, 'browser-drafts', `${i}.json`), value);
        }
        await copyVerified(
          join(run, 'browser-drafts'),
          join(backup, 'browser-drafts'),
        );
      }
      state.preflight = true;
      await save();
      console.log(
        'Read-only provider checks passed; browser draft exports backed up.',
      );
    } else if (command === 'freeze') {
      if (!state.preflight) throw new Stop('Run preflight first');
      const original = await api.policy();
      if (!state.freezeIntent) {
        await atomicJson(join(run, 's3-policy-before.json'), original);
        await atomicJson(join(backup, 's3-policy-before.json'), original);
        state.freezeIntent = true;
        await save();
      }
      if (config.hostingMode === 'vercel') {
        await api.vercel(`/v1/projects/${config.projectId}/pause`, 'POST');
        const p = await api.project();
        if (p.paused !== true)
          throw new Stop('Vercel pause has not taken effect; rerun freeze');
      }
      await api.putPolicy(withFreeze(await api.policy(), config.bucket));
      await ensureFrozen();
      state.frozen = true;
      state.captureAfter ??= Date.now() + 60000;
      await save();
      console.log(
        `${config.hostingMode === 'vercel' ? 'Site paused. ' : 'Hosting unchanged. '}S3 content writes denied. Capture after ${new Date(state.captureAfter).toISOString()} to let in-flight requests finish.`,
      );
    } else if (command === 'capture') {
      await ensureFrozen();
      if (!state.frozen || Date.now() < state.captureAfter)
        throw new Stop(
          'Freeze first and allow the recorded drain interval to pass',
        );
      const raw = join(run, 'raw');
      try {
        await access(join(raw, 'manifest.json'));
        await loadSnapshot(raw);
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
        try {
          await access(raw);
          await rename(raw, join(run, `incomplete-capture-${Date.now()}`));
        } catch (e) {
          if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
        }
        await checked('snapshot.ts', [raw, '--publishing-frozen'], 'capture');
      }
      const source = await loadSnapshot(raw);
      await copyVerified(raw, join(backup, 'raw'));
      state.snapshot = source.manifest.checksum;
      await save();
      console.log('Frozen snapshot captured and backup bytes verified.');
    } else if (command === 'prepare') {
      if (state.verified)
        throw new Stop(
          'Already imported; preparation is locked to avoid overwriting newer work',
        );
      const raw = values.snapshot ? resolve(values.snapshot) : join(run, 'raw');
      const source = await loadSnapshot(raw);
      const repaired = repairLegacy(source.metadata, source.content);
      let mapping: any = {};
      try {
        mapping = await readJson(join(run, 'photo-map.json'));
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
      }
      const urls = googleUrls([repaired.metadata, repaired.content]);
      const pending = urls.filter((url) => !mapping[url]);
      await atomicJson(join(run, 'repairs.json'), {
        sourceChecksum: source.manifest.checksum,
        changes: repaired.audit,
      });
      await atomicJson(join(run, 'pending-photos.json'), pending);
      if (pending.length && !values.snapshot) {
        await quota();
        const local = config.photoPlan
          ? await readJson(resolve(config.photoPlan))
          : [];
        for (const url of pending) {
          const item = local.find((p: any) => p.oldUrl === url);
          let bytes: Buffer;
          try {
            bytes = item
              ? await readFile(item.file)
              : await readImage(
                  await fetch(url, {
                    redirect: 'error',
                    signal: AbortSignal.timeout(30000),
                  }),
                );
            mapping[url] = await uploadBytes(bytes, digest(`legacy:${url}`));
            await atomicJson(join(run, 'photo-map.json'), mapping);
            await atomicJson(join(backup, 'photo-map.json'), mapping);
          } catch {
            throw new Stop(
              'A legacy photo could not be retrieved/uploaded. Progress saved. Supply its original through photoPlan or Google Picker, then rerun prepare.',
            );
          }
        }
      }
      const prepared = join(run, 'prepared');
      await mkdir(prepared, { recursive: true, mode: 0o700 });
      const files = [];
      for (const [i, value] of [
        repaired.metadata,
        repaired.content,
      ].entries()) {
        const file = i ? 'adventure-content.json' : 'adventure-data.json';
        const bytes = JSON.stringify(value, null, 2);
        await writeFile(join(prepared, file), bytes, { mode: 0o600 });
        files.push({
          ...source.manifest.files[i],
          file,
          sha256: sha256(bytes),
          bytes: Buffer.byteLength(bytes),
          records: value.length,
        });
      }
      const manifest = {
        ...source.manifest,
        files,
        checksum: sha256(files.map((f) => f.sha256).join(':')),
        derivedFrom: source.manifest.checksum,
        repairsChecksum: sha256(stable(repaired.audit)),
      };
      await atomicJson(join(prepared, 'manifest.json'), manifest);
      await atomicJson(join(prepared, 'repairs.json'), repaired.audit);
      await atomicJson(join(run, 'photo-map.json'), mapping);
      const report = assemble(repaired.metadata, repaired.content, mapping);
      await atomicJson(join(run, 'validation.json'), {
        counts: report.counts,
        issues: report.issues,
      });
      console.log(
        JSON.stringify(
          {
            repairs: repaired.audit.length,
            counts: report.counts,
            blockingIssues: report.issues.length,
            pendingPhotos: pending.length,
          },
          null,
          2,
        ),
      );
      if (report.issues.length)
        throw new Stop(
          `Resolve blockers listed in ${join(run, 'validation.json')}; no database content was changed.`,
        );
      if (values.snapshot)
        throw new Stop(
          'Local preparation preview complete; capture the final frozen source before production import.',
        );
      await copyVerified(prepared, join(backup, 'prepared'));
      await atomicJson(join(backup, 'photo-map.json'), mapping);
      state.prepared = sha256(stable({ snapshot: manifest.checksum, mapping }));
      await save();
    } else if (command === 'import') {
      await ensureFrozen();
      const prepared = await readPrepared();
      if (
        !prepared.manifest.publishingFrozen ||
        prepared.manifest.derivedFrom !== state.snapshot
      )
        throw new Stop(
          'Prepared input must derive from this run’s frozen snapshot',
        );
      const identity = new URL(process.env.DATABASE_URL!);
      const target = sha256(
        `${identity.hostname}:${identity.port}${identity.pathname}`,
      );
      if (state.database && state.database !== target)
        throw new Stop('Database target differs from this run');
      state.database = target;
      await save();
      await checked('db-migrate.ts', [], 'schema');
      await checked(
        'migrateToNeon.ts',
        [
          join(run, 'prepared'),
          '--apply',
          '--verify',
          '--production',
          '--mapping',
          join(run, 'photo-map.json'),
        ],
        'import-verify',
      );
      state.verified = prepared.hash;
      await exportNeon('neon-after-import.json');
      await save();
      console.log('Article import verified and Neon backup saved.');
    } else if (command === 'deploy') {
      await deploy('maintenance');
    } else if (command === 'status') {
      if (state.deployment) {
        const d = await deploymentStatus();
        console.log(
          JSON.stringify(
            {
              phase: state.deployment.phase,
              deployment: d.id,
              url: d.url,
              status: d.readyState,
            },
            null,
            2,
          ),
        );
      } else
        console.log(
          JSON.stringify(
            {
              frozen: !!state.frozen,
              captured: !!state.snapshot,
              prepared: !!state.prepared,
              verified: !!state.verified,
            },
            null,
            2,
          ),
        );
    } else if (command === 'check') {
      const d = await deploymentStatus();
      if (d.readyState !== 'READY' || state.deployment.phase !== 'maintenance')
        throw new Stop('Maintenance deployment must be READY');
      await assertProductionDeployment(d.id);
      if (d.meta?.migrationAttempt !== state.deployment.attempt)
        throw new Stop('Deployment metadata mismatch');
      await api.vercel(`/v1/projects/${config.projectId}/unpause`, 'POST');
      try {
        await smoke(config.origin, true);
        const hash = sha256(stable(await deploymentFiles(root)));
        if (hash !== state.deployment.sourceHash)
          throw new Stop('Source changed since deployment');
        state.checked = hash;
        await save();
        console.log(
          'Public maintenance gate, public reads and draft privacy passed.',
        );
      } catch (e) {
        await api.vercel(`/v1/projects/${config.projectId}/pause`, 'POST');
        throw e;
      }
    } else if (command === 'release') {
      if (!state.checked || !state.verified)
        throw new Stop(
          'Import verification and maintenance checks are required before release.',
        );
      await api.vercel(`/v1/projects/${config.projectId}/pause`, 'POST');
      await deploy('release');
    } else if (command === 'open') {
      const d = await deploymentStatus();
      if (d.readyState !== 'READY' || state.deployment.phase !== 'release')
        throw new Stop('Release deployment must be READY');
      await assertProductionDeployment(d.id);
      if (sha256(stable(await deploymentFiles(root))) !== state.checked)
        throw new Stop('Source changed since checks; keep the project paused.');
      if (!isFrozen(await api.policy(), config.bucket))
        throw new Stop('S3 freeze must remain in place');
      if (Array.isArray(config.browserDrafts) && !state.draftsImported) {
        const input: Article[] = [];
        for (const [i] of config.browserDrafts.entries())
          for (const item of await readJson(
            join(run, 'browser-drafts', `${i}.json`),
          )) {
            const value = item.value ?? item;
            const data = articleSchema.parse(value.data ?? value);
            const id = `draft-import-${sha256(JSON.stringify(data)).slice(0, 32)}`;
            input.push({ ...data, id });
          }
        await db().transaction(async (tx) => {
          for (const data of input) {
            await tx
              .insert(articles)
              .values({ id: data.id })
              .onConflictDoNothing();
            const [old] = await tx
              .select()
              .from(drafts)
              .where(eq(drafts.id, data.id));
            if (!old)
              await tx
                .insert(drafts)
                .values({ id: data.id, data, revision: 1 });
          }
        });
        state.draftsImported = true;
        await save();
      }
      await exportNeon('neon-before-open.json');
      await api.vercel(`/v1/projects/${config.projectId}/unpause`, 'POST');
      try {
        await smoke(config.origin, false);
        state.openedAt = new Date().toISOString();
        await save();
        console.log('Next.js is live. Legacy S3 writes remain denied.');
      } catch (e) {
        await api.vercel(`/v1/projects/${config.projectId}/pause`, 'POST');
        throw e;
      }
    } else if (command === 'export') {
      await exportNeon(`neon-export-${Date.now()}.json`);
      console.log('Neon export backed up.');
    } else
      throw new Stop(
        'Unknown stage. Use plan, preflight, freeze, capture, prepare, import, deploy, status, check, release, open or export.',
      );
  }
} catch (e) {
  console.error(
    e instanceof ZodError
      ? e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n')
      : e instanceof Stop
        ? redact(e.message)
        : `Migration stopped (${e instanceof Error ? e.name : 'error'}). Credentials and provider response bodies were not logged.`,
  );
  process.exitCode = 1;
} finally {
  if (dbOpened) await database().client.end();
  if (unlock) await unlock();
}
