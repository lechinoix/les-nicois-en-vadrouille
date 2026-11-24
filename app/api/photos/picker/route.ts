import { cookies } from 'next/headers';
import {
  requireSession,
  requireWrites,
  sameOrigin,
  cookieOptions,
  seal,
  unseal,
  HttpError,
} from '@/lib/auth';
import { endpoint, json, body } from '@/lib/http';
import { google, googleToken } from '@/lib/google';
import { digest, importBytes, readImage } from '@/lib/photos';
export const maxDuration = 60;
async function picker() {
  const raw = (await cookies()).get('google-picker')?.value;
  if (!raw) throw new HttpError(404, 'Créez une sélection Google');
  const value = unseal<{ id: string; owner: string }>(raw);
  if (value.owner !== (await requireSession()))
    throw new HttpError(403, 'Sélection invalide');
  return value.id;
}
export const POST = endpoint(async (req) => {
  const owner = await requireSession();
  sameOrigin(req);
  requireWrites();
  const input = await body(req);
  if (input.action === 'create') {
    const session = await google('sessions', 'POST');
    (await cookies()).set('google-picker', seal({ id: session.id, owner }), {
      ...cookieOptions,
      maxAge: 3600,
    });
    return json(session);
  }
  const id = await picker();
  if (input.action === 'status')
    return json(await google(`sessions/${encodeURIComponent(id)}`));
  if (input.action === 'import') {
    const session = await google(`sessions/${encodeURIComponent(id)}`);
    if (!session.mediaItemsSet)
      throw new HttpError(409, 'Terminez votre sélection dans Google Photos');
    const pageToken =
      typeof input.pageToken === 'string' ? input.pageToken : '';
    // One image per request bounds execution time; page tokens let interrupted imports resume.
    const page = await google(
      `mediaItems?${new URLSearchParams({ sessionId: id, pageSize: '1', pageToken })}`,
    );
    const pictures = [];
    const skipped = [];
    for (const item of page.mediaItems || []) {
      if (item.type !== 'PHOTO') {
        skipped.push(item.id);
        continue;
      }
      const base = new URL(item.mediaFile.baseUrl);
      if (
        base.protocol !== 'https:' ||
        !base.hostname.endsWith('.googleusercontent.com')
      )
        throw new HttpError(502, 'URL Google inattendue');
      pictures.push(
        await importBytes(
          async () =>
            readImage(
              await fetch(`${base.toString()}=w2560-h2560`, {
                headers: { Authorization: `Bearer ${await googleToken()}` },
                redirect: 'error',
                signal: AbortSignal.timeout(30000),
              }),
            ),
          digest(`google:${item.id}`),
        ),
      );
    }
    return json({
      pictures,
      skipped,
      nextPageToken: page.nextPageToken || null,
    });
  }
  throw new HttpError(400, 'Action inconnue');
});
export const DELETE = endpoint(async (req) => {
  await requireSession();
  sameOrigin(req);
  try {
    await google(`sessions/${encodeURIComponent(await picker())}`, 'DELETE');
  } finally {
    const c = await cookies();
    c.delete('google-picker');
    c.delete('google-token');
  }
  return json({ ok: true });
});
