import { z } from 'zod';
import { requireSession, sameOrigin } from '@/lib/auth';
import { endpoint, json, body } from '@/lib/http';
import {
  advancePhotoImport,
  completePhotoImport,
  findPhotoImport,
} from '@/lib/photo-imports';
export const maxDuration = 60;
export const GET = endpoint(async (req) => {
  const owner = await requireSession();
  const articleId = z
    .string()
    .min(1)
    .max(160)
    .parse(new URL(req.url).searchParams.get('articleId'));
  return json(await findPhotoImport(articleId, owner));
});
export const POST = endpoint(async (req) => {
  const owner = await requireSession();
  sameOrigin(req);
  const { id, action } = z
    .object({ id: z.uuid(), action: z.enum(['advance', 'complete', 'cancel']) })
    .parse(await body(req));
  return json(
    action === 'advance'
      ? await advancePhotoImport(id, owner)
      : await completePhotoImport(id, owner, action === 'cancel'),
  );
});
