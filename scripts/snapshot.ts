import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { sha256 } from '../lib/migration';
const directory = process.argv[2];
if (!directory)
  throw new Error(
    'Usage: npm run snapshot -- <new-directory> [--publishing-frozen]',
  );
await mkdir(directory, { recursive: false });
const client = new S3Client({ region: process.env.AWS_REGION || 'eu-west-3' });
const Bucket = process.env.S3_BUCKET || 'lesnicoisenvadrouille';
const files = [];
const publicRead = process.argv.includes('--public');
async function publicObject(Key: string, method = 'GET') {
  const response = await fetch(
    `https://${Bucket}.s3.${process.env.AWS_REGION || 'eu-west-3'}.amazonaws.com/${Key}`,
    { method, cache: 'no-store' },
  );
  if (!response.ok) throw new Error(`S3 ${method}: ${response.status}`);
  return {
    ETag: response.headers.get('etag') || undefined,
    VersionId: response.headers.get('x-amz-version-id') || undefined,
    LastModified: response.headers.get('last-modified')
      ? new Date(response.headers.get('last-modified')!)
      : undefined,
    Body: { transformToString: () => response.text() },
  };
}

for (const name of ['adventure-data', 'adventure-content']) {
  const Key = `data/${name}/head.json`;
  const object = publicRead
    ? await publicObject(Key)
    : await client.send(new GetObjectCommand({ Bucket, Key }));
  const text = await object.Body!.transformToString();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error(`${Key} is not an array`);
  const file = `${name}.json`;
  await writeFile(join(directory, file), text, { flag: 'wx', mode: 0o600 });
  files.push({
    bucket: Bucket,
    key: Key,
    file,
    versionId: object.VersionId ?? null,
    etag: object.ETag,
    lastModified: object.LastModified?.toISOString(),
    sha256: sha256(text),
    bytes: Buffer.byteLength(text),
    records: parsed.length,
  });
}
for (const file of files) {
  const current = publicRead
    ? await publicObject(file.key, 'HEAD')
    : await client.send(new HeadObjectCommand({ Bucket, Key: file.key }));
  if (
    current.ETag !== file.etag ||
    current.VersionId !== (file.versionId ?? undefined) ||
    current.LastModified?.toISOString() !== file.lastModified
  )
    throw new Error(
      'S3 changed during capture. Snapshot rejected; retry into a new directory.',
    );
}
const checksum = sha256(files.map((f) => f.sha256).join(':'));
await writeFile(
  join(directory, 'manifest.json'),
  JSON.stringify(
    {
      version: 1,
      capturedAt: new Date().toISOString(),
      publishingFrozen: process.argv.includes('--publishing-frozen'),
      consistency:
        'both objects unchanged through capture; final snapshot still requires an external publishing freeze',
      checksum,
      files,
    },
    null,
    2,
  ),
  { flag: 'wx', mode: 0o600 },
);
console.log(
  JSON.stringify(
    { directory, checksum, counts: files.map((f) => f.records) },
    null,
    2,
  ),
);
