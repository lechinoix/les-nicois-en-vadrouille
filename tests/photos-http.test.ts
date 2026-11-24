import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createHmac, randomBytes } from 'node:crypto';
import { emptyArticle } from '../lib/model';

test(
  'production HTTP: Google authorization works with stale deployment flags and retains access protections',
  {
    skip:
      process.env.TEST_PRODUCTION_HTTP !== 'true' ||
      process.env.TEST_DATABASE_DISPOSABLE !== 'true',
    timeout: 60000,
  },
  async () => {
    const origin = 'http://127.0.0.1:33180';
    const secret = randomBytes(32).toString('hex');
    const body = `${randomBytes(24).toString('hex')}.${Date.now() + 60000}`;
    const session = `${body}.${createHmac('sha256', secret).update(body).digest('base64url')}`;
    const headers = {
      Origin: origin,
      Cookie: `editor-session=${session}`,
      'Content-Type': 'application/json',
    };
    const server = spawn(
      process.execPath,
      [
        'node_modules/next/dist/bin/next',
        'start',
        '--hostname',
        '127.0.0.1',
        '--port',
        '33180',
      ],
      {
        env: {
          ...process.env,
          APP_ORIGIN: origin,
          SESSION_SECRET: secret,
          GOOGLE_CLIENT_ID: 'test-client.apps.googleusercontent.com',
          GOOGLE_CLIENT_SECRET: 'disposable-test-secret',
          // Existing deployment settings must not block the live editor or Google start.
          EDITOR_WRITES_ENABLED: 'false',
          MIGRATION_MAINTENANCE: 'true',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    let logs = '';
    server.stderr.on('data', (chunk) => {
      logs += chunk;
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error('Server startup timeout')),
          15000,
        );
        server.stdout.on('data', (chunk) => {
          if (String(chunk).includes('Ready')) {
            clearTimeout(timer);
            resolve();
          }
        });
        server.on('exit', () => {
          clearTimeout(timer);
          reject(new Error('Server exited before ready'));
        });
      });
      assert.equal((await fetch(`${origin}/login`)).status, 200);
      assert.equal(
        (
          await fetch(`${origin}/api/photos/google/start`, {
            method: 'POST',
            headers: { Origin: origin },
          })
        ).status,
        401,
      );
      assert.equal(
        (
          await fetch(`${origin}/api/photos/google/start`, {
            method: 'POST',
            headers: { ...headers, Origin: 'https://other.example' },
          })
        ).status,
        403,
      );
      const articleId = `photo-http-${crypto.randomUUID()}`;
      const saved = await fetch(`${origin}/api/articles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: emptyArticle(articleId),
          expectedRevision: 0,
          publish: false,
        }),
      });
      assert.equal(saved.status, 200);
      const response = await fetch(`${origin}/api/photos/google/start`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ articleId }),
      });
      assert.equal(response.status, 200);
      assert.match(response.headers.get('cache-control')!, /no-store/);
      const url = new URL((await response.json()).url);
      assert.equal(url.origin, 'https://accounts.google.com');
      assert.equal(
        url.searchParams.get('client_id'),
        'test-client.apps.googleusercontent.com',
      );
      assert.equal(
        url.searchParams.get('redirect_uri'),
        `${origin}/api/photos/google/callback`,
      );
      assert.equal(
        url.searchParams.get('scope'),
        'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
      );
      assert.equal(url.searchParams.get('response_type'), 'code');
      const state = url.searchParams.get('state')!;
      const callbackHeaders = { Cookie: headers.Cookie };
      const wrongState = await fetch(
        `${origin}/api/photos/google/callback?error=access_denied&state=wrong`,
        { headers: callbackHeaders, redirect: 'manual' },
      );
      assert.equal(wrongState.status, 403);
      const cancelled = await fetch(
        `${origin}/api/photos/google/callback?error=access_denied&state=${state}`,
        { headers: callbackHeaders, redirect: 'manual' },
      );
      assert.equal(cancelled.status, 303);
      assert.equal(
        cancelled.headers.get('location'),
        `${origin}/editor/${articleId}?photos=resume`,
      );
      assert.equal((await fetch(`${origin}/api/articles`)).status, 401);
      assert.equal(
        (await fetch(`${origin}/api/photos/picker?articleId=${articleId}`))
          .status,
        401,
      );
      const pendingResponse = await fetch(
        `${origin}/api/photos/picker?articleId=${articleId}`,
        { headers },
      );
      const pending = await pendingResponse.json();
      assert.equal(pending.articleId, articleId);
      assert.match(pending.error, /annulée/);
      assert.equal(pending.token, undefined);
      assert.equal(pending.oauthNonce, undefined);
      assert.equal(
        (
          await fetch(
            `${origin}/api/photos/google/callback?error=access_denied&state=${state}`,
            { headers: callbackHeaders, redirect: 'manual' },
          )
        ).status,
        403,
      );

      assert.equal(
        (await fetch(`${origin}/api/export`, { headers })).status,
        404,
      );
      assert.equal(
        (
          await fetch(`${origin}/api/drafts/import`, {
            method: 'POST',
            headers,
          })
        ).status,
        404,
      );
    } catch (error) {
      throw new Error(`${String(error)}\n${logs}`);
    } finally {
      server.kill('SIGTERM');
      if (server.exitCode === null) await once(server, 'exit');
    }
  },
);
