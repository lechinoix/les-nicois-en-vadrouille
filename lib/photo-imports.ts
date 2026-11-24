import { randomUUID } from 'node:crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import { database } from '../db';
import { drafts, photoImports } from '../db/schema';
import { HttpError, seal, unseal } from './auth';
import { google, type GoogleToken } from './google';
import { digest, importBytes, readImage } from './photos';
import type {
  PhotoImportProgress,
  PhotoImportState,
} from './photo-import-model';

type Job = typeof photoImports.$inferSelect;
type Transaction = Parameters<
  Parameters<ReturnType<typeof database>['db']['transaction']>[0]
>[0];
const initialState = (): PhotoImportState => ({
  status: 'authorizing',
  pictures: [],
  skipped: 0,
  nextPollAt: 0,
  timeoutAt: Date.now() + 600000,
  pollIntervalMs: 5000,
});
const active = (job: Job) =>
  !['complete', 'cancelled'].includes(job.state.status);
export function importProgress(job: Job): PhotoImportProgress {
  const { status, pickerUrl, nextPollAt, timeoutAt, pictures, skipped, error } =
    job.state;
  return {
    id: job.id,
    articleId: job.articleId,
    status,
    pickerUrl,
    nextPollAt,
    timeoutAt,
    pictures,
    skipped,
    error,
  };
}
async function ownedJob(tx: Transaction, id: string, owner: string) {
  const [job] = await tx
    .select()
    .from(photoImports)
    .where(and(eq(photoImports.id, id), eq(photoImports.owner, digest(owner))));
  if (!job) throw new HttpError(404, 'Import introuvable pour cette session.');
  return job;
}
async function locked<T>(
  id: string,
  owner: string,
  fn: (job: Job, tx: Transaction) => Promise<T>,
) {
  return database().db.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`photo-import:${id}`}, 0))`,
    );
    return fn(await ownedJob(tx, id, owner), tx);
  });
}
async function persist(tx: Transaction, job: Job) {
  await tx
    .update(photoImports)
    .set({ state: job.state, token: job.token, updatedAt: new Date() })
    .where(eq(photoImports.id, job.id));
  return importProgress(job);
}
export async function findPhotoImport(articleId: string, owner: string) {
  const jobs = await database()
    .db.select()
    .from(photoImports)
    .where(
      and(
        eq(photoImports.articleId, articleId),
        eq(photoImports.owner, digest(owner)),
      ),
    )
    .orderBy(desc(photoImports.updatedAt));
  const job = jobs.find(active);
  return job ? importProgress(job) : null;
}
export async function getOrCreatePhotoImport(articleId: string, owner: string) {
  return database().db.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`photo-import:${articleId}:${digest(owner)}`}, 0))`,
    );
    const [draft] = await tx
      .select({ id: drafts.id })
      .from(drafts)
      .where(eq(drafts.id, articleId));
    if (!draft)
      throw new HttpError(
        409,
        'Enregistrez le brouillon avant d’ajouter des photos.',
      );
    const jobs = await tx
      .select()
      .from(photoImports)
      .where(
        and(
          eq(photoImports.articleId, articleId),
          eq(photoImports.owner, digest(owner)),
        ),
      )
      .orderBy(desc(photoImports.updatedAt));
    const existing = jobs.find(active);
    if (existing) return existing.id;
    const [job] = await tx
      .insert(photoImports)
      .values({ articleId, owner: digest(owner), state: initialState() })
      .returning();
    return job.id;
  });
}
function accessToken(job: Job) {
  if (!job.token)
    throw new HttpError(
      428,
      'Continuez avec Google Photos pour autoriser cet import.',
    );
  const token = unseal<GoogleToken>(job.token);
  if (token.expiresAt <= Date.now() + 15000)
    throw new HttpError(
      428,
      'L’autorisation Google a expiré. Les photos déjà importées sont conservées.',
    );
  return token.accessToken;
}
function duration(value: string | undefined, fallback: number) {
  return value && /^\d+(\.\d+)?s$/.test(value)
    ? Number(value.slice(0, -1)) * 1000
    : fallback;
}
async function select(job: Job) {
  const session = job.state.pickerId
    ? await google(
        `sessions/${encodeURIComponent(job.state.pickerId)}`,
        'GET',
        accessToken(job),
      )
    : await google('sessions', 'POST', accessToken(job));
  const uri = new URL(session.pickerUri);
  if (uri.protocol !== 'https:' || uri.hostname !== 'photos.google.com')
    throw new HttpError(502, 'Adresse Google Photos inattendue.');
  uri.pathname = `${uri.pathname.replace(/\/$/, '')}/autoclose`;
  job.state = {
    ...job.state,
    status: session.mediaItemsSet ? 'importing' : 'selecting',
    pickerId: session.id,
    pickerUrl: uri.toString(),
    expiresAt: Date.parse(session.expireTime),
    nextPollAt:
      Date.now() + duration(session.pollingConfig?.pollInterval, 5000),
    timeoutAt: Date.now() + duration(session.pollingConfig?.timeoutIn, 600000),
    pollIntervalMs: duration(session.pollingConfig?.pollInterval, 5000),
  };
}
export async function startPhotoImport(
  id: string,
  owner: string,
  cachedToken?: GoogleToken,
) {
  return locked(id, owner, async (job, tx) => {
    if (!active(job)) throw new HttpError(409, 'Cet import est terminé.');
    delete job.state.error;
    if (job.state.status === 'ready')
      return { job: importProgress(job), url: null };
    if (job.state.expiresAt && job.state.expiresAt < Date.now()) {
      throw new HttpError(
        410,
        'La sélection Google a expiré. Terminez cet import puis choisissez à nouveau vos photos ; celles déjà enregistrées sont conservées.',
      );
    }
    if (
      !job.token &&
      cachedToken?.owner === owner &&
      cachedToken.expiresAt > Date.now() + 15000
    )
      job.token = seal(cachedToken);
    try {
      accessToken(job);
      await select(job);
      return {
        job: await persist(tx, job),
        url: job.state.status === 'selecting' ? job.state.pickerUrl : null,
      };
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 428) throw error;
    }
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
      throw new HttpError(
        500,
        'Google Photos n’est pas configuré sur le serveur.',
      );
    const nonce = randomUUID();
    job.token = null;
    job.state.oauthNonce = nonce;
    job.state.status = 'authorizing';
    job.state.timeoutAt = Date.now() + 600000;
    const state = seal({
      id,
      owner: digest(owner),
      nonce,
      expiresAt: job.state.timeoutAt,
    });
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.search = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.APP_ORIGIN}/api/photos/google/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
      state,
      access_type: 'online',
      prompt: 'consent',
    }).toString();
    return { job: await persist(tx, job), url: url.toString() };
  });
}
export async function finishGoogleAuthorization(
  state: string,
  owner: string,
  code: string | null,
  cancelled: boolean,
) {
  let value: { id: string; owner: string; nonce: string; expiresAt: number };
  try {
    value = unseal(state);
  } catch {
    throw new HttpError(403, 'Session Google invalide.');
  }
  if (value.owner !== digest(owner) || value.expiresAt < Date.now())
    throw new HttpError(403, 'Session Google invalide ou expirée.');
  return locked(value.id, owner, async (job, tx) => {
    if (!active(job) || job.state.oauthNonce !== value.nonce)
      throw new HttpError(403, 'Session Google déjà utilisée ou annulée.');
    delete job.state.oauthNonce;
    if (cancelled || !code) {
      job.state.error =
        'Autorisation Google annulée. Votre brouillon est conservé.';
      await persist(tx, job);
      return { job: importProgress(job), token: null };
    }
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.APP_ORIGIN}/api/photos/google/callback`,
          grant_type: 'authorization_code',
        }),
      });
      if (!response.ok) {
        job.state.error =
          'Autorisation Google impossible. Réessayez depuis le brouillon.';
        await persist(tx, job);
        return { job: importProgress(job), token: null };
      }
      const token = await response.json();
      const credential: GoogleToken = {
        owner,
        accessToken: token.access_token,
        expiresAt: Date.now() + token.expires_in * 1000,
      };
      job.token = seal(credential);
      job.state.status = job.state.pickerId ? 'selecting' : 'authorizing';
      await select(job);
      await persist(tx, job);
      return { job: importProgress(job), token: credential };
    } catch {
      job.state.error =
        'Connexion Google interrompue. Réessayez depuis le brouillon ; vos photos sont conservées.';
      await persist(tx, job);
      return { job: importProgress(job), token: null };
    }
  });
}
export async function advancePhotoImport(id: string, owner: string) {
  return locked(id, owner, async (job, tx) => {
    const s = job.state;
    if (!active(job) || s.status === 'authorizing' || s.status === 'ready')
      return importProgress(job);
    const token = accessToken(job);
    if (s.status === 'selecting') {
      if (Date.now() < s.nextPollAt) return importProgress(job);
      if (Date.now() > s.timeoutAt)
        throw new HttpError(
          408,
          'Sélection en attente. Revenez de Google Photos puis reprenez l’import.',
        );
      const session = await google(
        `sessions/${encodeURIComponent(s.pickerId!)}`,
        'GET',
        token,
      );
      s.pollIntervalMs = duration(
        session.pollingConfig?.pollInterval,
        s.pollIntervalMs,
      );
      s.nextPollAt = Date.now() + Math.max(1000, s.pollIntervalMs);
      if (!session.mediaItemsSet) return persist(tx, job);
      s.status = 'importing';
    }
    // One page per request; the lock serializes retries and the cursor commits
    // together with the imported assets. Cloudinary IDs are deterministic.
    const page = await google(
      `mediaItems?${new URLSearchParams({ sessionId: s.pickerId!, pageSize: '1', pageToken: s.cursor || '' })}`,
      'GET',
      token,
    );
    for (const item of page.mediaItems || []) {
      if (item.type !== 'PHOTO') {
        s.skipped++;
        continue;
      }
      const url = new URL(item.mediaFile.baseUrl);
      if (
        url.protocol !== 'https:' ||
        !url.hostname.endsWith('.googleusercontent.com')
      )
        throw new HttpError(502, 'URL Google inattendue.');
      const picture = await importBytes(
        async () =>
          readImage(
            await fetch(`${url}=w2560-h2560`, {
              headers: { Authorization: `Bearer ${token}` },
              redirect: 'error',
              signal: AbortSignal.timeout(30000),
            }),
          ),
        digest(`google:${item.id}`),
        tx,
      );
      if (!s.pictures.some((p) => String(p.id) === String(picture.id)))
        s.pictures.push(picture);
    }
    s.cursor = page.nextPageToken || undefined;
    if (!s.cursor) s.status = 'ready';
    return persist(tx, job);
  });
}
export async function completePhotoImport(
  id: string,
  owner: string,
  cancel = false,
) {
  return locked(id, owner, async (job, tx) => {
    if (!active(job)) return importProgress(job);
    const [draft] = await tx
      .select()
      .from(drafts)
      .where(eq(drafts.id, job.articleId));
    if (!cancel && job.state.status !== 'ready')
      throw new HttpError(409, 'Import encore en cours.');
    if (
      !draft ||
      job.state.pictures.some(
        (p) =>
          !draft.data.pictures.some(
            (saved) => String(saved.id) === String(p.id),
          ),
      )
    ) {
      throw new HttpError(
        409,
        'Enregistrez les photos dans le brouillon avant de terminer.',
      );
    }
    if (job.state.pickerId && job.token) {
      try {
        await google(
          `sessions/${encodeURIComponent(job.state.pickerId)}`,
          'DELETE',
          accessToken(job),
        );
      } catch {
        /* Expired/removed Google sessions do not block a saved draft. */
      }
    }
    job.state.status = cancel ? 'cancelled' : 'complete';
    delete job.state.oauthNonce;
    delete job.state.pickerUrl;
    job.token = null;
    return persist(tx, job);
  });
}
