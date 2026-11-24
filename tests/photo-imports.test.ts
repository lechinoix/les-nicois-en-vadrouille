import test from 'node:test';
import assert from 'node:assert/strict';
import { eq } from 'drizzle-orm';
import { database } from '../db';
import { assets, photoImports } from '../db/schema';
import { saveArticle, getDraft } from '../lib/articles';
import { emptyArticle, pictureSchema } from '../lib/model';
import { seal } from '../lib/auth';
import { digest } from '../lib/photos';
import {
  getOrCreatePhotoImport,
  startPhotoImport,
  finishGoogleAuthorization,
  advancePhotoImport,
  completePhotoImport,
  findPhotoImport,
} from '../lib/photo-imports';

test(
  'Google imports: authorization, persisted progress, retries, expiry, ownership, and draft acknowledgement',
  {
    skip: process.env.TEST_DATABASE_DISPOSABLE !== 'true',
    timeout: 60000,
  },
  async () => {
    process.env.SESSION_SECRET =
      'disposable-photo-import-secret-at-least-32-characters';
    process.env.GOOGLE_CLIENT_ID = 'test-client';
    process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
    process.env.APP_ORIGIN = 'https://blog.example';
    const owner = `owner-${crypto.randomUUID()}`;
    const articleId = `import-${crypto.randomUUID()}`;
    const sourceId = `google-${crypto.randomUUID()}`;
    const format = {
      url: 'https://res.cloudinary.com/test/image/upload/photo.jpg',
      width: 400,
      height: 300,
    };
    const picture = pictureSchema.parse({
      ...format,
      id: sourceId,
      albumId: '',
      formats: Object.fromEntries(
        ['thumbnail', 'small', 'medium', 'large', 'xlarge'].map((k) => [
          k,
          format,
        ]),
      ),
    });
    const originalFetch = globalThis.fetch;
    let failNextPage = false;
    let mediaRequests = 0;
    let tokenRequests = 0;
    let deleteRequests = 0;
    let selected = false;
    const session = () => ({
      id: 'session',
      pickerUri: 'https://photos.google.com/picker/session',
      expireTime: new Date(Date.now() + 3600000).toISOString(),
      mediaItemsSet: selected,
      pollingConfig: { pollInterval: '0s', timeoutIn: '60s' },
    });
    globalThis.fetch = async (input, init) => {
      const url = new URL(String(input));
      if (url.hostname === 'oauth2.googleapis.com') {
        tokenRequests++;
        return Response.json({
          access_token: 'test-access-token',
          expires_in: 3600,
        });
      }
      assert.equal(
        url.hostname,
        'photospicker.googleapis.com',
        'cached assets must not download or upload again',
      );
      if (init?.method === 'DELETE') {
        deleteRequests++;
        return new Response(null, { status: 204 });
      }
      if (
        url.pathname.endsWith('/sessions') ||
        url.pathname.endsWith('/sessions/session')
      )
        return Response.json(session());
      assert.equal(url.pathname, '/v1/mediaItems');
      mediaRequests++;
      if (failNextPage) {
        failNextPage = false;
        return new Response('upstream failure', { status: 503 });
      }
      const cursor = url.searchParams.get('pageToken');
      if (!cursor)
        return Response.json({
          mediaItems: [
            {
              id: sourceId,
              type: 'PHOTO',
              mediaFile: { baseUrl: 'https://lh3.googleusercontent.com/image' },
            },
          ],
          nextPageToken: 'second',
        });
      if (cursor === 'second')
        return Response.json({
          mediaItems: [{ id: 'video', type: 'VIDEO' }],
          nextPageToken: 'third',
        });
      assert.equal(cursor, 'third');
      return Response.json({
        mediaItems: [
          {
            id: sourceId,
            type: 'PHOTO',
            mediaFile: { baseUrl: 'https://lh3.googleusercontent.com/image' },
          },
        ],
      });
    };
    const { db, client } = database();
    try {
      await assert.rejects(getOrCreatePhotoImport(articleId, owner), {
        status: 409,
      });
      const draft = await saveArticle(emptyArticle(articleId), 0, false);
      await db
        .insert(assets)
        .values({ key: digest(`google:${sourceId}`), data: picture });
      const ids = await Promise.all([
        getOrCreatePhotoImport(articleId, owner),
        getOrCreatePhotoImport(articleId, owner),
      ]);
      assert.equal(
        ids[0],
        ids[1],
        'double clicks reuse the active article import',
      );
      const id = ids[0];
      await assert.rejects(advancePhotoImport(id, 'different-owner'), {
        status: 404,
      });
      assert.equal(await findPhotoImport(articleId, 'different-owner'), null);
      const started = await startPhotoImport(id, owner);
      const state = new URL(started.url!).searchParams.get('state')!;
      await assert.rejects(
        finishGoogleAuthorization(state, 'wrong-owner', 'code', false),
        { status: 403 },
      );
      const cancelled = await finishGoogleAuthorization(
        state,
        owner,
        null,
        true,
      );
      assert.match(cancelled.job.error!, /annulée/);
      assert.equal(cancelled.job.articleId, articleId);
      await assert.rejects(
        finishGoogleAuthorization(state, owner, 'replay', false),
        { status: 403 },
      );
      const restarted = await startPhotoImport(id, owner);
      const authenticated = await finishGoogleAuthorization(
        new URL(restarted.url!).searchParams.get('state')!,
        owner,
        'code',
        false,
      );
      assert.match(authenticated.job.pickerUrl!, /\/autoclose$/);
      assert.equal(tokenRequests, 1);
      const pending = await advancePhotoImport(id, owner);
      assert.equal(pending.status, 'selecting');
      await advancePhotoImport(id, owner);
      assert.equal(mediaRequests, 0, 'no import until selection is validated');
      selected = true;
      await db
        .update(photoImports)
        .set({
          state: {
            ...(
              await db
                .select()
                .from(photoImports)
                .where(eq(photoImports.id, id))
            )[0].state,
            nextPollAt: 0,
          },
        })
        .where(eq(photoImports.id, id));
      const first = await advancePhotoImport(id, owner);
      assert.equal(first.pictures.length, 1);
      assert.equal(first.status, 'importing');
      assert.equal(
        (await getDraft(articleId))!.revision,
        draft.revision,
        'uploading does not overwrite an editor draft',
      );
      failNextPage = true;
      await assert.rejects(advancePhotoImport(id, owner), { status: 502 });
      assert.equal(
        (await findPhotoImport(articleId, owner))!.pictures.length,
        1,
        'interruption retains committed progress',
      );
      await db
        .update(photoImports)
        .set({
          token: seal({
            owner,
            accessToken: 'expired',
            expiresAt: Date.now() - 1,
          }),
        })
        .where(eq(photoImports.id, id));
      await assert.rejects(advancePhotoImport(id, owner), { status: 428 });
      const renewed = await startPhotoImport(id, owner);
      await finishGoogleAuthorization(
        new URL(renewed.url!).searchParams.get('state')!,
        owner,
        'renew-code',
        false,
      );
      const [one, two] = await Promise.all([
        advancePhotoImport(id, owner),
        advancePhotoImport(id, owner),
      ]);
      assert.ok([one, two].some((result) => result.status === 'ready'));
      const ready = (await findPhotoImport(articleId, owner))!;
      assert.equal(
        ready.pictures.length,
        1,
        'retry/duplicate media does not duplicate photos',
      );
      assert.equal(ready.skipped, 1);
      assert.equal(
        mediaRequests,
        4,
        'committed first page was not re-imported after authorization renewal',
      );
      await assert.rejects(completePhotoImport(id, owner), { status: 409 });
      const current = (await getDraft(articleId))!;
      await saveArticle(
        {
          ...current.data,
          content: 'Unsaved text now saved',
          pictures: ready.pictures,
        },
        current.revision,
        false,
      );
      const complete = await completePhotoImport(id, owner);
      assert.equal(complete.status, 'complete');
      assert.equal((await completePhotoImport(id, owner)).status, 'complete');
      assert.equal(deleteRequests, 1);
      assert.equal(
        (await db.select().from(photoImports).where(eq(photoImports.id, id)))[0]
          .token,
        null,
      );
      assert.equal(await findPhotoImport(articleId, owner), null);
      // A fresh import reuses valid authorization without displaying Connect.
      selected = false;
      const next = await getOrCreatePhotoImport(articleId, owner);
      const direct = await startPhotoImport(next, owner, authenticated.token!);
      assert.match(direct.url!, /^https:\/\/photos.google.com\//);
      assert.equal(tokenRequests, 2);
      assert.equal(
        (await completePhotoImport(next, owner, true)).status,
        'cancelled',
      );
    } finally {
      globalThis.fetch = originalFetch;
      await client.end();
    }
  },
);
