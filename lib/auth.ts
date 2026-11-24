import { cookies } from 'next/headers';
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createCipheriv,
  createDecipheriv,
  createHash,
} from 'node:crypto';
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32)
    throw new Error('SESSION_SECRET must contain at least 32 characters');
  return s;
}
export function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}
export function token() {
  const body = `${randomBytes(24).toString('hex')}.${Date.now() + 7 * 86400000}`;
  return `${body}.${sign(body)}`;
}
export function validToken(t: string) {
  const [id, expiry, sig] = t.split('.');
  if (!id || !expiry || !sig || Number(expiry) < Date.now()) return false;
  const expected = sign(`${id}.${expiry}`);
  return (
    sig.length === expected.length &&
    timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  );
}
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
export async function session() {
  const value = (await cookies()).get('editor-session')?.value;
  return value && validToken(value) ? value : null;
}
export async function requireSession() {
  const s = await session();
  if (!s) throw new HttpError(401, 'Connexion requise');
  return s;
}
export function sameOrigin(req: Request) {
  if (
    !process.env.APP_ORIGIN ||
    req.headers.get('origin') !== new URL(process.env.APP_ORIGIN).origin
  )
    throw new HttpError(403, 'Origine refusée');
}
export function verifyPassword(password: string) {
  const [salt, hash] = (process.env.EDITOR_PASSWORD_HASH || '').split(':');
  if (!salt || !hash || !/^[a-f0-9]{128}$/.test(hash))
    throw new Error('EDITOR_PASSWORD_HASH is required');
  const candidate = scryptSync(password, salt, 64);
  return timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}
export function seal(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    'aes-256-gcm',
    createHash('sha256').update(secret()).digest(),
    iv,
  );
  const data = Buffer.concat([
    cipher.update(JSON.stringify(value)),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64url');
}
export function unseal<T>(value: string): T {
  const data = Buffer.from(value, 'base64url');
  const decipher = createDecipheriv(
    'aes-256-gcm',
    createHash('sha256').update(secret()).digest(),
    data.subarray(0, 12),
  );
  decipher.setAuthTag(data.subarray(12, 28));
  return JSON.parse(
    Buffer.concat([
      decipher.update(data.subarray(28)),
      decipher.final(),
    ]).toString(),
  );
}
