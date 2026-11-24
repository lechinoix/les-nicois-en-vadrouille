import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
test(
  'production maintenance gate denies visitors, permits private checks, and does not grant editor access',
  { skip: process.env.TEST_PRODUCTION_HTTP !== 'true', timeout: 30000 },
  async () => {
    const origin = 'http://127.0.0.1:33180',
      token = 'temporary-maintenance-token-at-least-32-characters';
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
          MIGRATION_MAINTENANCE: 'true',
          MIGRATION_MAINTENANCE_TOKEN: token,
          SESSION_SECRET: 'test-session-secret-at-least-32-characters',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
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
          reject(new Error('Server exited'));
        });
      });
      const visitor = await fetch(`${origin}/cv`);
      assert.equal(visitor.status, 503);
      assert.equal(visitor.headers.get('cache-control'), 'no-store');
      assert.equal(
        (
          await fetch(`${origin}/cv`, {
            headers: { 'x-migration-token': 'wrong' },
          })
        ).status,
        503,
      );
      const headers = { 'x-migration-token': token };
      assert.equal((await fetch(`${origin}/cv`, { headers })).status, 200);
      assert.equal(
        (await fetch(`${origin}/api/export`, { headers })).status,
        401,
      );
      assert.equal(
        (await fetch(`${origin}/editor`, { headers, redirect: 'manual' }))
          .status,
        307,
      );
    } finally {
      server.kill('SIGTERM');
      await once(server, 'exit');
    }
  },
);
