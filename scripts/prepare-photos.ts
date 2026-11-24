// Explicit preparation from local originals downloaded with the official Picker or exported by the owner.
// Input: [{ "oldUrl": "https://...", "file": "/path/to/original.jpg" }]
import { readFile, writeFile, rename } from 'node:fs/promises';
import { uploadBytes, digest } from '../lib/photos';
import { isCloudinary } from '../lib/model';
import type { PhotoMap } from '../lib/migration';
const [input, output] = process.argv.slice(2);
if (!input || !output)
  throw new Error(
    'Usage: npm run photos:prepare -- <local-photo-plan.json> <mapping.json>',
  );
const plan: { oldUrl: string; file: string }[] = JSON.parse(
  await readFile(input, 'utf8'),
);
let mapping: PhotoMap = {};
try {
  mapping = JSON.parse(await readFile(output, 'utf8'));
} catch (e) {
  if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
}
for (const item of plan) {
  if (isCloudinary(item.oldUrl) || mapping[item.oldUrl]) continue;
  mapping[item.oldUrl] = await uploadBytes(
    await readFile(item.file),
    digest(`legacy:${item.oldUrl}`),
  );
  await writeFile(`${output}.tmp`, JSON.stringify(mapping, null, 2), {
    mode: 0o600,
  });
  await rename(`${output}.tmp`, output);
  console.log(`Prepared ${Object.keys(mapping).length} assets`);
}
