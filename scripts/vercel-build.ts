import { spawn } from 'node:child_process';
import { runVercelBuild } from './build-pipeline';

try {
  await runVercelBuild(
    process.env,
    (step) =>
      new Promise<void>((resolve, reject) => {
        console.log(`Running ${step}...`);
        const child = spawn('npm', ['run', step], {
          stdio: 'inherit',
          env: process.env,
        });
        child.once('error', () =>
          reject(new Error(`Unable to start ${step}.`)),
        );
        child.once('exit', (code) =>
          code === 0
            ? resolve()
            : reject(new Error(`${step} failed; deployment stopped.`)),
        );
      }),
  );
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Vercel build failed.',
  );
  process.exitCode = 1;
}
