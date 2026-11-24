import { createHash } from 'node:crypto';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';
import { eq } from 'drizzle-orm';
import { database } from '../db';
import { assets } from '../db/schema';
import type { Picture } from './model';
export function cloud() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}
export const digest = (input: string | Buffer) =>
  createHash('sha256').update(input).digest('hex');
export async function uploadBytes(
  bytes: Buffer,
  key: string,
): Promise<Picture> {
  if (bytes.length > 20 * 1024 * 1024)
    throw new Error('Photo trop volumineuse (20 Mo maximum)');
  // Decode first: reject videos/SVG and constrain dimensions before sending to Cloudinary.
  const source = sharp(bytes, {
    limitInputPixels: 100_000_000,
    animated: false,
  });
  const meta = await source.metadata();
  if (
    !['jpeg', 'png', 'webp', 'heif', 'avif', 'tiff'].includes(meta.format || '')
  )
    throw new Error('Format de photo non pris en charge');
  const resized = await source
    .rotate()
    .resize(2560, 2560, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
  const publicId = `blog-imports/${key}`;
  const c = cloud();
  let result: UploadApiResponse;
  try {
    result = await c.api.resource(publicId, { resource_type: 'image' });
  } catch (e) {
    if (
      (e as { error?: { http_code: number } }).error?.http_code !== 404 &&
      (e as { http_code?: number }).http_code !== 404
    )
      throw e;
    result = await new Promise((resolve, reject) => {
      c.uploader
        .upload_stream(
          { public_id: publicId, resource_type: 'image', overwrite: false },
          (err, res) => (err || !res ? reject(err) : resolve(res)),
        )
        .end(resized);
    });
  }
  const format = (width: number) => ({
    url: c.url(publicId, {
      width,
      crop: 'limit',
      quality: 'auto',
      fetch_format: 'auto',
      secure: true,
    }),
    width: Math.min(width, result.width),
    height: Math.round(result.height * Math.min(1, width / result.width)),
  });
  return {
    id: publicId,
    albumId: '',
    url: result.secure_url,
    width: result.width,
    height: result.height,
    formats: {
      thumbnail: format(240),
      small: format(500),
      medium: format(960),
      large: format(1600),
      xlarge: format(2560),
    },
  };
}
export async function importBytes(bytes: () => Promise<Buffer>, key: string) {
  const db = database().db;
  const [known] = await db.select().from(assets).where(eq(assets.key, key));
  if (known) return known.data;
  const data = await uploadBytes(await bytes(), key);
  await db.insert(assets).values({ key, data }).onConflictDoNothing();
  return data;
}
export async function readImage(response: Response) {
  if (!response.ok)
    throw new Error(`Photo retrieval failed (${response.status})`);
  if (!response.headers.get('content-type')?.startsWith('image/'))
    throw new Error('Expected image bytes');
  const reader = response.body!.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 20 * 1024 * 1024) {
      await reader.cancel();
      throw new Error('Photo exceeds 20 MB');
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
