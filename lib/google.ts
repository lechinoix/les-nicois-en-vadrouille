import { cookies } from 'next/headers';
import { HttpError, unseal, requireSession } from './auth';
export type GoogleToken = {
  accessToken: string;
  expiresAt: number;
  owner: string;
};
export async function googleToken() {
  const owner = await requireSession();
  const raw = (await cookies()).get('google-token')?.value;
  if (!raw) throw new HttpError(401, 'Autorisez Google Photos pour importer.');
  const t = unseal<GoogleToken>(raw);
  if (t.owner !== owner || t.expiresAt < Date.now())
    throw new HttpError(
      401,
      'Autorisation Google expirée. Reconnectez Google ; les photos déjà importées sont conservées.',
    );
  return t.accessToken;
}
export async function google(path: string, method = 'GET') {
  const response = await fetch(
    `https://photospicker.googleapis.com/v1/${path}`,
    {
      method,
      headers: { Authorization: `Bearer ${await googleToken()}` },
      cache: 'no-store',
    },
  );
  if (!response.ok)
    throw new HttpError(
      response.status === 401 ? 401 : 502,
      `Google Photos : ${response.status}. Réessayez ou reconnectez Google.`,
    );
  return method === 'DELETE' ? {} : response.json();
}
