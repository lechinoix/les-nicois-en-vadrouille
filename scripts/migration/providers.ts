import {
  S3Client,
  GetBucketPolicyCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import type { Config } from './core';
import { Stop, requiredEnv } from './core';
export function providers(config: Config) {
  const s3 = new S3Client({ region: config.region });
  async function vercel(path: string, method = 'GET', body?: unknown) {
    if (config.hostingMode === 'unchanged')
      throw new Stop('Vercel access is disabled for this data-only migration.');
    requiredEnv(['VERCEL_TOKEN']);
    const url = new URL(`https://api.vercel.com${path}`);
    url.searchParams.set('teamId', config.teamId);
    const r = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(60000),
      redirect: 'error',
    });
    if (!r.ok)
      throw new Stop(
        `Vercel ${method} ${url.pathname}: HTTP ${r.status} (response body withheld to protect secrets)`,
      );
    return r.status === 204 ? {} : r.json();
  }
  const project = () =>
    vercel(`/v9/projects/${encodeURIComponent(config.projectId)}`);
  async function policy() {
    try {
      const r = await s3.send(
        new GetBucketPolicyCommand({ Bucket: config.bucket }),
      );
      return JSON.parse(r.Policy!);
    } catch (e) {
      if ((e as { name: string }).name === 'NoSuchBucketPolicy') return null;
      throw new Stop(
        'Cannot read S3 bucket policy; check AWS credentials and s3:GetBucketPolicy access',
      );
    }
  }
  async function putPolicy(value: unknown) {
    await s3.send(
      new PutBucketPolicyCommand({
        Bucket: config.bucket,
        Policy: JSON.stringify(value),
      }),
    );
  }
  return { vercel, project, policy, putPolicy };
}
