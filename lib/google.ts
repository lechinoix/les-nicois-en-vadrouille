import { HttpError } from './auth';
export type GoogleToken = {
  accessToken: string;
  expiresAt: number;
  owner: string;
};
export async function google(
  path: string,
  method: string,
  accessToken: string,
) {
  const response = await fetch(
    `https://photospicker.googleapis.com/v1/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new HttpError(
      response.status === 401
        ? 428
        : [404, 410].includes(response.status)
          ? 410
          : 502,
      `Google Photos : ${response.status}. Réessayez ou reconnectez Google.`,
    );
  return method === 'DELETE' ? {} : response.json();
}
