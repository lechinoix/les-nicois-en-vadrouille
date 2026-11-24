import test from 'node:test';
import assert from 'node:assert/strict';
import { runVercelBuild } from '../scripts/build-pipeline';

test('production build migrates first and stops on failure; previews never migrate', async () => {
  const steps: string[] = [];
  const run = async (step: string) => {
    steps.push(step);
  };
  await runVercelBuild({ VERCEL: '1', VERCEL_ENV: 'production' }, run);
  assert.deepEqual(steps.splice(0), ['db:migrate', 'build']);
  for (const environment of ['preview', 'development']) {
    await runVercelBuild({ VERCEL: '1', VERCEL_ENV: environment }, run);
    assert.deepEqual(steps.splice(0), ['build']);
  }
  await assert.rejects(
    runVercelBuild({ VERCEL: '1', VERCEL_ENV: 'production' }, async (step) => {
      steps.push(step);
      throw new Error('Migration failure');
    }),
    /Migration failure/,
  );
  assert.deepEqual(steps.splice(0), ['db:migrate']);
  for (const env of [
    {},
    { VERCEL: '1' },
    { VERCEL: '1', VERCEL_ENV: 'unknown' },
  ]) {
    await assert.rejects(runVercelBuild(env, run), /environment is missing/);
    assert.deepEqual(steps, []);
  }
});
