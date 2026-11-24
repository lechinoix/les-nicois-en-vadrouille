import 'server-only';
import { createNeonAuth } from '@neon/auth/next/server';

let auth: ReturnType<typeof createNeonAuth> | undefined;

export function accountAuthConfigured() {
  return Boolean(
    process.env.NEON_AUTH_BASE_URL &&
    (process.env.NEON_AUTH_COOKIE_SECRET?.length ?? 0) >= 32,
  );
}

// Lazily initialize so builds and the public blog do not need Auth credentials.
// This identity is deliberately separate from the shared editor session.
export function accountAuth() {
  if (!accountAuthConfigured()) throw new Error('Neon Auth is not configured');
  return (auth ??= createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
  }));
}
