import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { scryptSync } from 'node:crypto';
import { emptyArticle, articlePath } from '../lib/model';
test(
  'production HTTP: authentication, privacy, revision conflicts, cache invalidation and exports',
  { skip: process.env.TEST_PRODUCTION_HTTP !== 'true', timeout: 60000 },
  async () => {
    const origin = 'http://127.0.0.1:33179';
    const password = 'a-disposable-test-password';
    const salt = 'disposable-salt';
    const server = spawn(
      process.execPath,
      [
        'node_modules/next/dist/bin/next',
        'start',
        '--hostname',
        '127.0.0.1',
        '--port',
        '33179',
      ],
      {
        env: {
          ...process.env,
          APP_ORIGIN: origin,
          SESSION_SECRET: 'test-session-secret-with-at-least-32-characters',
          EDITOR_PASSWORD_HASH: `${salt}:${scryptSync(password, salt, 64).toString('hex')}`,
          EDITOR_WRITES_ENABLED: 'true',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    let logs = '';
    server.stderr.on('data', (chunk) => (logs += chunk));
    server.stdout.on('data', (chunk) => (logs += chunk));
    try {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error(logs || 'Server start timeout')),
          20000,
        );
        server.stdout.on('data', () => {
          if (logs.includes('Ready')) {
            clearTimeout(timer);
            resolve();
          }
        });
        server.on('exit', () => {
          clearTimeout(timer);
          reject(new Error(logs));
        });
      });
      assert.equal((await fetch(`${origin}/api/articles`)).status, 401);
      assert.equal(
        (await fetch(`${origin}/editor`, { redirect: 'manual' })).status,
        307,
      );
      assert.equal(
        (
          await fetch(`${origin}/api/auth`, {
            method: 'POST',
            headers: {
              Origin: 'https://evil.example',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
          })
        ).status,
        403,
      );
      const login = await fetch(`${origin}/api/auth`, {
        method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      assert.equal(login.status, 200, await login.clone().text());
      const cookie = login.headers.get('set-cookie')!;
      assert.match(cookie, /HttpOnly/i);
      assert.match(cookie, /Secure/i);
      assert.match(cookie, /SameSite=lax/i);
      const headers = {
        Origin: origin,
        'Content-Type': 'application/json',
        Cookie: cookie.split(';')[0],
      };
      const id = `http-${crypto.randomUUID()}`;
      const a = {
        ...emptyArticle(id),
        title: `Private ${id}`,
        content: `UNPUBLISHED-${id}`,
      };
      const send = (
        data: typeof a,
        expectedRevision: number,
        publish = false,
      ) =>
        fetch(`${origin}/api/articles`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ data, expectedRevision, publish }),
        });
      const saved = await send(a, 0);
      assert.equal(saved.status, 200, await saved.clone().text());
      assert.equal((await saved.json()).revision, 1);
      assert.equal((await fetch(`${origin}/adventures/${id}`)).status, 404);
      assert.ok(
        !(await (await fetch(`${origin}/`)).text()).includes(a.content),
      );
      const conflict = await send({ ...a, title: 'stale' }, 0);
      assert.equal(conflict.status, 409);
      assert.equal((await conflict.json()).current.revision, 1);
      const publicArticle = {
        ...a,
        title: `Published ${id}`,
        content: `PUBLIC-${id}`,
      };
      const published = await send(publicArticle, 1, true);
      assert.equal(published.status, 200, await published.clone().text());
      assert.ok(
        (
          await (await fetch(`${origin}${articlePath(publicArticle)}`)).text()
        ).includes(publicArticle.content),
      );
      const updated = { ...publicArticle, content: `UPDATED-${id}` };
      assert.equal((await send(updated, 2, true)).status, 200);
      assert.ok(
        (await (await fetch(`${origin}/`)).text()).includes(updated.content),
        'cached search data must invalidate',
      );
      const privateAgain = { ...updated, content: `PRIVATE-AGAIN-${id}` };
      assert.equal((await send(privateAgain, 3)).status, 200);
      assert.ok(
        !(
          await (await fetch(`${origin}${articlePath(updated)}`)).text()
        ).includes(privateAgain.content),
      );
      const exported = await fetch(`${origin}/api/export`, { headers });
      assert.equal(exported.status, 200);
      assert.match(exported.headers.get('cache-control')!, /no-store/);
      assert.ok(
        (await exported.json()).drafts.some((d: { id: string }) => d.id === id),
      );
      const imported = await fetch(`${origin}/api/drafts/import`, {
        method: 'POST',
        headers,
        body: JSON.stringify([{ key: `draft-${id}`, value: privateAgain }]),
      });
      assert.equal(imported.status, 200);
      const importedId = (await imported.json()).imported[0];
      const repeatedImport = await fetch(`${origin}/api/drafts/import`, {
        method: 'POST',
        headers,
        body: JSON.stringify([{ key: `draft-${id}`, value: privateAgain }]),
      });
      assert.equal((await repeatedImport.json()).imported[0], importedId);
      assert.equal(
        (await fetch(`${origin}/adventures/${importedId}`)).status,
        404,
      );
      const invalid = await send(
        {
          ...privateAgain,
          content: '![](https://lh3.googleusercontent.com/private)',
        },
        4,
        true,
      );
      assert.equal(invalid.status, 400);
      const photos = await fetch(`${origin}/api/photos/picker`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'create' }),
      });
      assert.equal(photos.status, 401);
    } catch (e) {
      throw new Error(`${String(e)}\nServer logs:\n${logs}`);
    } finally {
      server.kill('SIGTERM');
      await once(server, 'exit');
    }
  },
);
