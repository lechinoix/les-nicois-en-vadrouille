import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { scryptSync } from 'node:crypto';
import { emptyArticle, articlePath } from '../lib/model';
test(
  'production HTTP: authentication, privacy, revision conflicts, cache invalidation',
  {
    skip:
      process.env.TEST_PRODUCTION_HTTP !== 'true' ||
      process.env.TEST_DATABASE_DISPOSABLE !== 'true',
    timeout: 60000,
  },
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
          EDITOR_WRITES_ENABLED: 'false',
          MIGRATION_MAINTENANCE: 'true',
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
      assert.equal((await fetch(`${origin}/api/editor-options`)).status, 401);
      assert.equal(
        (await fetch(`${origin}/editor/options`, { redirect: 'manual' }))
          .status,
        307,
      );
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
      const optionLabel = `Participant ${crypto.randomUUID()}`;
      const optionsRequest = (
        method: string,
        data: object,
        requestHeaders = headers,
      ) =>
        fetch(`${origin}/api/editor-options`, {
          method,
          headers: requestHeaders,
          body: JSON.stringify(data),
        });
      assert.equal(
        (
          await optionsRequest(
            'POST',
            { kind: 'participants', label: optionLabel },
            { ...headers, Origin: 'https://evil.example' },
          )
        ).status,
        403,
      );
      assert.equal(
        (await optionsRequest('POST', { kind: 'unknown', label: optionLabel }))
          .status,
        400,
      );
      assert.equal(
        (await optionsRequest('POST', { kind: 'places', label: '   ' })).status,
        400,
      );
      const createdResponse = await optionsRequest('POST', {
        kind: 'participants',
        label: ` ${optionLabel} `,
      });
      assert.equal(createdResponse.status, 201);
      const option = await createdResponse.json();
      assert.equal(option.label, optionLabel);
      assert.equal(option.revision, 1);
      assert.equal(
        (
          await optionsRequest('POST', {
            kind: 'participants',
            label: optionLabel,
          })
        ).status,
        409,
      );
      assert.equal(
        (await optionsRequest('POST', { kind: 'places', label: optionLabel }))
          .status,
        201,
        'same label may be used in another category',
      );
      const id = `http-${crypto.randomUUID()}`;
      const sportLabel = `Sport ${crypto.randomUUID()}`;
      const sportCreated = await optionsRequest('POST', {
        kind: 'sports',
        label: sportLabel,
      });
      assert.equal(sportCreated.status, 201);
      const sportOption = await sportCreated.json();
      assert.match(sportOption.value, /^sport-/);
      assert.equal(
        (await optionsRequest('POST', { kind: 'sports', label: sportLabel }))
          .status,
        409,
      );
      const a = {
        ...emptyArticle(id),
        title: `Private ${id}`,
        content: `UNPUBLISHED-${id}`,
        participants: [optionLabel],
        sports: [sportOption.value, 'ESCALADE_COUENNE'],
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
      const renamed = await optionsRequest('PATCH', {
        id: option.id,
        expectedRevision: 1,
        label: `${optionLabel} renommé`,
        archived: false,
      });
      assert.equal(renamed.status, 200);
      assert.equal((await renamed.json()).revision, 2);
      assert.equal(
        (
          await optionsRequest('PATCH', {
            id: option.id,
            expectedRevision: 1,
            label: 'stale',
            archived: true,
          })
        ).status,
        409,
      );
      assert.equal(
        (
          await optionsRequest('PATCH', {
            id: option.id,
            expectedRevision: 2,
            label: `${optionLabel} renommé`,
            archived: true,
          })
        ).status,
        200,
      );
      const choicesResponse = await fetch(`${origin}/api/editor-options`, {
        headers,
      });
      assert.match(
        choicesResponse.headers.get('cache-control') || '',
        /private, no-store/,
      );
      const choices = await choicesResponse.json();
      assert.equal(
        choices.find((choice: { id: string }) => choice.id === option.id)
          .archived,
        true,
      );
      const preserved = await (
        await fetch(`${origin}/api/articles/${id}`, { headers })
      ).json();
      assert.deepEqual(
        preserved.data.participants,
        [optionLabel],
        'renaming/archiving must not rewrite saved articles',
      );
      assert.equal(preserved.revision, 1);
      assert.equal(
        (
          await optionsRequest('PATCH', {
            id: option.id,
            expectedRevision: 3,
            label: `${optionLabel} renommé`,
            archived: false,
          })
        ).status,
        200,
      );
      assert.equal(
        (await fetch(`${origin}/editor/options`, { headers })).status,
        200,
      );
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
      const sportUrl = `${origin}/sport/${sportOption.value}`;
      assert.ok((await (await fetch(sportUrl)).text()).includes(sportLabel));
      assert.equal(
        (await fetch(`${origin}/sport/ESCALADE_COUENNE`)).status,
        200,
      );
      const renamedSportLabel = `${sportLabel} renommé`;
      const sportRenamed = await optionsRequest('PATCH', {
        id: sportOption.id,
        expectedRevision: 1,
        label: renamedSportLabel,
        archived: false,
        value: 'must-not-change-the-code',
      });
      assert.equal(sportRenamed.status, 200);
      assert.equal((await sportRenamed.json()).value, sportOption.value);
      assert.ok(
        (await (await fetch(sportUrl)).text()).includes(
          `<h1>${renamedSportLabel}</h1>`,
        ),
        'sport pages use the refreshed database label at the same URL',
      );
      const articleHtml = await (
        await fetch(`${origin}${articlePath(publicArticle)}`)
      ).text();
      assert.ok(
        articleHtml.includes(`${renamedSportLabel}, Escalade en couenne`),
      );
      assert.ok(
        (await (await fetch(`${origin}/adventures`)).text()).includes(
          `value="${sportOption.value}"`,
        ),
        'new sports appear in the public filter',
      );
      assert.equal(
        (
          await optionsRequest('PATCH', {
            id: sportOption.id,
            expectedRevision: 1,
            label: 'stale sport',
            archived: true,
          })
        ).status,
        409,
      );
      assert.equal(
        (
          await optionsRequest('PATCH', {
            id: sportOption.id,
            expectedRevision: 2,
            label: renamedSportLabel,
            archived: true,
          })
        ).status,
        200,
      );
      assert.equal(
        (await fetch(sportUrl)).status,
        200,
        'archiving does not break existing sport URLs',
      );
      const preservedSport = await (
        await fetch(`${origin}/api/articles/${id}`, { headers })
      ).json();
      assert.equal(preservedSport.revision, 2);
      assert.deepEqual(preservedSport.data.sports, a.sports);
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
      assert.equal(
        photos.status,
        400,
        'legacy unscoped picker requests are rejected',
      );
    } catch (e) {
      throw new Error(`${String(e)}\nServer logs:\n${logs}`);
    } finally {
      server.kill('SIGTERM');
      await once(server, 'exit');
    }
  },
);
