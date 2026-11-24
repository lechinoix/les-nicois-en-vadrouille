type BuildStep = 'db:migrate' | 'build';

export async function runVercelBuild(
  env: Readonly<Record<string, string | undefined>>,
  run: (step: BuildStep) => Promise<void>,
): Promise<void> {
  if (
    env.VERCEL !== '1' ||
    !['production', 'preview', 'development'].includes(env.VERCEL_ENV ?? '')
  ) {
    throw new Error(
      'Vercel environment is missing or unsupported. Enable System Environment Variables in Vercel; use npm run build locally.',
    );
  }
  if (env.VERCEL_ENV === 'production') await run('db:migrate');
  await run('build');
}
