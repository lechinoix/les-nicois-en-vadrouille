// Explicit live acceptance test. Creates one real Managed Auth user, never blog records.
// Credentials stay in an ignored, owner-only file so interrupted runs can resume.
import { createAuthClient } from '@neon/auth';
import { BetterAuthVanillaAdapter } from '@neon/auth/vanilla';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadEnvFile } from 'node:process';
import { authErrorCode, authErrorMessage } from '../lib/account-auth/errors';

if (existsSync('.env.local')) loadEnvFile('.env.local');
if (existsSync('.env')) loadEnvFile('.env');

let step = 'configuration';
const nativeFetch = globalThis.fetch;
const checks: string[] = [];
function check(ok: unknown, description: string): asserts ok {
  step = description;
  if (!ok) throw new Error('Acceptance check failed');
  checks.push(description);
  console.log(`PASS ${description}`);
}

try {
  const origin = new URL(
    process.env.AUTH_TEST_ORIGIN || 'http://localhost:3000',
  );
  // This script sends credentials/cookies only to a local app instance.
  if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname))
    throw new Error('Use a local app server');
  const upstream = new URL(process.env.NEON_AUTH_BASE_URL || '');
  if (
    upstream.protocol !== 'https:' ||
    !upstream.hostname.endsWith('.neon.tech')
  )
    throw new Error('A real Neon Auth service is required');
  const binding = createHash('sha256').update(upstream.href).digest('hex');
  const dir = '.auth-test';
  const file = `${dir}/user-${binding.slice(0, 16)}.json`;
  await mkdir(dir, { recursive: true, mode: 0o700 });
  type TestUser = {
    binding: string;
    email: string;
    password: string;
    name: string;
    created: boolean;
  };
  let user: TestUser;
  if (existsSync(file)) {
    user = JSON.parse(await readFile(file, 'utf8'));
    if (user.binding !== binding) throw new Error('Wrong test target');
    await chmod(file, 0o600);
  } else {
    user = {
      binding,
      email:
        process.env.AUTH_TEST_EMAIL || `neon-test-${randomUUID()}@example.com`,
      password: randomBytes(32).toString('base64url'),
      name: 'Test inscription',
      created: false,
    };
    await writeFile(file, JSON.stringify(user), { mode: 0o600, flag: 'wx' });
  }
  const jar = new Map<string, string>();
  async function localFetch(input: RequestInfo | URL, init?: RequestInit) {
    const request = new Request(input, init);
    if (new URL(request.url).origin !== origin.origin)
      throw new Error('Unexpected request destination');
    const headers = new Headers(request.headers);
    headers.set('Origin', origin.origin);
    if (jar.size)
      headers.set('Cookie', [...jar].map(([k, v]) => `${k}=${v}`).join('; '));
    const response = await nativeFetch(new Request(request, { headers }), {
      redirect: 'manual',
    });
    if (process.env.AUTH_TEST_DEBUG === 'true') {
      console.log(
        JSON.stringify({
          path: new URL(request.url).pathname,
          status: response.status,
          sentCookieNames: [...jar.keys()],
          receivedCookieNames: response.headers
            .getSetCookie()
            .map((raw) => raw.split('=')[0]),
        }),
      );
    }
    for (const raw of response.headers.getSetCookie()) {
      const pair = raw.split(';')[0];
      const split = pair.indexOf('=');
      if (split < 0) continue;
      const key = pair.slice(0, split),
        value = pair.slice(split + 1);
      if (!value || /max-age=0(?:;|$)/i.test(raw)) jar.delete(key);
      else jar.set(key, value);
    }
    return response;
  }
  // The SDK owns its customFetchImpl. Give this standalone Node process the
  // cookie persistence a browser normally supplies, while retaining real HTTP.
  globalThis.fetch = localFetch;
  const client = () =>
    createAuthClient(`${origin.origin}/api/auth`, {
      adapter: BetterAuthVanillaAdapter(),
    });
  let auth = client();
  step = 'anonymous account protection';
  check(
    (await localFetch(`${origin.origin}/api/account`)).status === 401,
    step,
  );
  const anonymousPage = await localFetch(`${origin.origin}/account`);
  check(
    anonymousPage.status === 307 &&
      anonymousPage.headers.get('location') === '/auth/sign-in',
    'anonymous account redirect',
  );

  if (!user.created) {
    step = 'real signup';
    try {
      const result = await auth.signUp.email({
        email: user.email,
        password: user.password,
        name: user.name,
      });
      if (result.error) throw result.error;
      check(result.data?.user.email === user.email, 'real signup');
    } catch (error) {
      // A previous attempt may have succeeded before writing the checkpoint.
      if (
        ![
          'USER_ALREADY_EXISTS',
          'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
          'EMAIL_EXISTS',
        ].includes(authErrorCode(error))
      )
        throw error;
    }
    user.created = true;
    await writeFile(file, JSON.stringify(user), { mode: 0o600 });
  }
  step = 'signed-in session';
  let session = await auth.getSession();
  if (!session.data?.user) {
    step = 'sign in (email verification may be required)';
    try {
      const result = await auth.signIn.email({
        email: user.email,
        password: user.password,
      });
      if (result.error) throw result.error;
      check(true, 'sign in');
    } catch (error) {
      if (
        ['EMAIL_NOT_VERIFIED', 'EMAIL_NOT_CONFIRMED'].includes(
          authErrorCode(error),
        )
      ) {
        console.error(
          'Email verification is required. Verify the test address through the app, then rerun. No verification setting was changed.',
        );
      }
      throw error;
    }
    session = await auth.getSession();
  }
  check(session.data?.user.email === user.email, 'SDK reads the current user');
  const userId = session.data.user.id;
  const current = await localFetch(`${origin.origin}/api/account`);
  const account = await current.json();
  check(
    current.status === 200 &&
      account.user?.id === userId &&
      account.user?.email === user.email,
    'server reads the same current user',
  );
  check(
    (current.headers.get('cache-control') || '').includes('no-store'),
    'account response is private and uncached',
  );
  check(
    (await localFetch(`${origin.origin}/account`)).status === 200,
    'authenticated account page',
  );
  auth = client();
  check(
    (await auth.getSession()).data?.user.id === userId,
    'session survives client recreation',
  );
  const uncached = await localFetch(
    `${origin.origin}/api/auth/get-session?disableCookieCache=true`,
  );
  check(
    uncached.ok && (await uncached.json())?.user?.id === userId,
    'session is confirmed by the upstream service without cookie cache',
  );
  check(
    (await localFetch(`${origin.origin}/api/articles`)).status === 401,
    'signup does not grant editor API access',
  );
  check(
    (await localFetch(`${origin.origin}/editor`)).status === 307,
    'signup does not grant editor page access',
  );
  step = 'sign out';
  check(!(await auth.signOut()).error, step);
  check(!(await auth.getSession()).data?.user, 'signed-out session is empty');
  check(
    (await localFetch(`${origin.origin}/api/account`)).status === 401,
    'account denied after sign out',
  );
  step = 'wrong password';
  let wrong: unknown;
  try {
    wrong = (
      await auth.signIn.email({
        email: user.email,
        password: randomBytes(32).toString('hex'),
      })
    ).error;
  } catch (error) {
    wrong = error;
  }
  check(
    ['INVALID_EMAIL_OR_PASSWORD', 'INVALID_CREDENTIALS'].includes(
      authErrorCode(wrong),
    ) && authErrorMessage(wrong) === 'Adresse email ou mot de passe incorrect.',
    'wrong password has a specific credentials error',
  );
  step = 'repeat sign in';
  check(
    !(await auth.signIn.email({ email: user.email, password: user.password }))
      .error,
    step,
  );
  check(
    (await auth.getSession()).data?.user.id === userId,
    'repeat sign in restores the same user',
  );
  check(!(await auth.signOut()).error, 'final sign out');
  await writeFile(
    `${dir}/receipt-${binding.slice(0, 16)}.json`,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        binding,
        email: user.email,
        userId,
        checks,
      },
      null,
      2,
    ),
    { mode: 0o600 },
  );
  console.log(
    'Real Neon Auth acceptance passed. The account is retained for retesting; credentials and receipt are in ignored .auth-test/.',
  );
} catch {
  console.error(
    `Neon Auth acceptance did not complete at: ${step}. No credentials or response bodies were logged.`,
  );
  process.exitCode = 1;
} finally {
  globalThis.fetch = nativeFetch;
}
