import { cookies } from 'next/headers';
import { z } from 'zod';
import { requireSession, sameOrigin, unseal } from '@/lib/auth';
import { endpoint, json, body } from '@/lib/http';
import type { GoogleToken } from '@/lib/google';
import { getOrCreatePhotoImport, startPhotoImport } from '@/lib/photo-imports';
export const maxDuration = 60;
export const POST = endpoint(async (req) => {
  const owner = await requireSession();
  sameOrigin(req);
  const { articleId } = z
    .object({
      articleId: z
        .string()
        .min(1)
        .max(160)
        .regex(/^[a-zA-Z0-9_-]+$/),
    })
    .parse(await body(req));
  const id = await getOrCreatePhotoImport(articleId, owner);
  const cookie = (await cookies()).get('google-token')?.value;
  let token: GoogleToken | undefined;
  try {
    if (cookie) token = unseal<GoogleToken>(cookie);
  } catch {
    /* Authorize again if the old credential is invalid. */
  }
  return json(await startPhotoImport(id, owner, token));
});
