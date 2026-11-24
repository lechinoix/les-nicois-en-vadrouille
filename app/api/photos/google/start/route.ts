import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import {
  requireSession,
  sameOrigin,
  cookieOptions,
  seal,
  HttpError,
} from '@/lib/auth';
import { endpoint, json } from '@/lib/http';
export const POST = endpoint(async (req) => {
  const owner = await requireSession();
  sameOrigin(req);
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
    throw new HttpError(
      500,
      'Google Photos n’est pas configuré sur le serveur.',
    );
  const state = randomBytes(32).toString('hex');
  (await cookies()).set(
    'google-state',
    seal({ state, owner, expiresAt: Date.now() + 600000 }),
    { ...cookieOptions, maxAge: 600 },
  );
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.APP_ORIGIN}/api/photos/google/callback`,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
    state,
    access_type: 'online',
    prompt: 'consent',
  }).toString();
  return json({ url: url.toString() });
});
