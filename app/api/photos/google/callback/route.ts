import { cookies } from 'next/headers';
import {
  requireSession,
  cookieOptions,
  seal,
  unseal,
  HttpError,
} from '@/lib/auth';
import { endpoint } from '@/lib/http';
export const GET = endpoint(async (req) => {
  const owner = await requireSession();
  const c = await cookies();
  const raw = c.get('google-state')?.value;
  c.delete('google-state');
  if (!raw) throw new HttpError(400, 'Session Google absente');
  const state = unseal<{ state: string; owner: string; expiresAt: number }>(
    raw,
  );
  const url = new URL(req.url);
  if (
    state.owner !== owner ||
    state.expiresAt < Date.now() ||
    url.searchParams.get('state') !== state.state
  )
    throw new HttpError(403, 'Session Google invalide');
  if (url.searchParams.has('error'))
    return Response.redirect(
      `${process.env.APP_ORIGIN}/editor?google=cancelled`,
    );
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      code: url.searchParams.get('code') || '',
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.APP_ORIGIN}/api/photos/google/callback`,
      grant_type: 'authorization_code',
    }),
  });
  if (!r.ok) throw new HttpError(401, 'Autorisation Google impossible');
  const t = await r.json();
  c.set(
    'google-token',
    seal({
      owner,
      accessToken: t.access_token,
      expiresAt: Date.now() + t.expires_in * 1000,
    }),
    { ...cookieOptions, maxAge: t.expires_in },
  );
  return new Response(
    '<!doctype html><html lang="fr"><p>Google Photos est connecté. Vous pouvez fermer cet onglet et revenir à votre brouillon.</p></html>',
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    },
  );
});
