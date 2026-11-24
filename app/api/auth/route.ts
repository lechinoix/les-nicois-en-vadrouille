import { cookies } from 'next/headers';
import { sql } from 'drizzle-orm';
import { database } from '@/db';
import {
  cookieOptions,
  sameOrigin,
  token,
  verifyPassword,
  HttpError,
} from '@/lib/auth';
import { endpoint, json, body } from '@/lib/http';
export const POST = endpoint(async (req) => {
  sameOrigin(req);
  // Shared database limiter works across serverless instances, without trusting client IP headers.
  const rows = await database().db.execute(
    sql`insert into login_attempts (key,count,expires_at) values ('shared-editor',1,now()+interval '15 minutes') on conflict (key) do update set count=case when login_attempts.expires_at < now() then 1 else login_attempts.count+1 end, expires_at=case when login_attempts.expires_at < now() then now()+interval '15 minutes' else login_attempts.expires_at end returning count`,
  );
  if (Number(rows[0].count) > 30)
    throw new HttpError(429, 'Trop de tentatives. Réessayez dans 15 minutes.');
  const { password } = await body(req);
  if (
    typeof password !== 'string' ||
    password.length > 1024 ||
    !verifyPassword(password)
  )
    throw new HttpError(401, 'Mot de passe incorrect');
  (await cookies()).set('editor-session', token(), {
    ...cookieOptions,
    maxAge: 7 * 86400,
  });
  return json({ ok: true });
});
export const DELETE = endpoint(async (req) => {
  sameOrigin(req);
  const c = await cookies();
  for (const name of [
    'editor-session',
    'google-token',
    'google-state',
    'google-picker',
  ])
    c.delete(name);
  return json({ ok: true });
});
