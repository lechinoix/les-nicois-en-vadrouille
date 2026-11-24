// Read-only discovery from an owner-supplied deployment hostname. Never changes Vercel.
import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { Stop } from './core';
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    'secret-file': { type: 'string' },
    'team-slug': { type: 'string' },
  },
});
try {
  const hostname = positionals[0];
  if (!hostname || !/^[a-z0-9.-]+\.vercel\.app$/.test(hostname))
    throw new Stop(
      'Provide the deployment hostname, without protocol or path.',
    );
  const token = values['secret-file']
    ? (await readFile(values['secret-file'], 'utf8')).trim()
    : process.env.VERCEL_TOKEN;
  if (!token)
    throw new Stop(
      'VERCEL_TOKEN or --secret-file /secure/token-path is required.',
    );
  async function get(path: string, teamId?: string) {
    const url = new URL(`https://api.vercel.com${path}`);
    if (teamId) url.searchParams.set('teamId', teamId);
    else if (values['team-slug'])
      url.searchParams.set('slug', values['team-slug']);
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      redirect: 'error',
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok)
      throw new Stop(
        `Vercel lookup failed: HTTP ${response.status}. Response body withheld.`,
      );
    return response.json();
  }
  const deployment = await get(
    `/v13/deployments/${encodeURIComponent(hostname)}`,
  );
  if (
    typeof deployment.projectId !== 'string' ||
    !deployment.projectId.startsWith('prj_')
  )
    throw new Stop('No project ID in deployment response.');
  const project = await get(`/v9/projects/${deployment.projectId}`);
  if (project.id !== deployment.projectId)
    throw new Stop('Deployment/project identity mismatch.');
  const teamId = project.accountId;
  if (typeof teamId !== 'string' || !teamId.startsWith('team_'))
    throw new Stop('Could not resolve the owning team.');
  const domains = await get(`/v9/projects/${project.id}/domains`, teamId);
  console.log(
    JSON.stringify(
      {
        projectId: project.id,
        teamId,
        projectName: project.name,
        lookupDeploymentId: deployment.id,
        productionDeploymentId: project.targets?.production?.id,
        productionAliases: project.targets?.production?.alias ?? [],
        domains: (domains.domains ?? []).map(
          (d: { name: string; redirect?: string }) => ({
            name: d.name,
            redirect: d.redirect ?? null,
          }),
        ),
        paused: project.paused ?? false,
        framework: project.framework,
        rootDirectory: project.rootDirectory,
      },
      null,
      2,
    ),
  );
} catch (e) {
  console.error(
    e instanceof Stop
      ? e.message
      : 'Vercel discovery failed; credentials and response bodies were not logged.',
  );
  process.exitCode = 1;
}
