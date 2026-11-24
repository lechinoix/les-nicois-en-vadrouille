import { database } from '@/db';
import { drafts } from '@/db/schema';
import { requireSession, requireWrites, sameOrigin } from '@/lib/auth';
import { saveArticle } from '@/lib/articles';
import { endpoint, json, body } from '@/lib/http';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
export const GET = endpoint(async () => {
  await requireSession();
  return json(await database().db.select().from(drafts));
});
export const POST = endpoint(async (req) => {
  await requireSession();
  sameOrigin(req);
  requireWrites();
  const input = z
    .object({
      data: z.unknown(),
      expectedRevision: z.number().int().nonnegative(),
      publish: z.boolean(),
    })
    .parse(await body(req));
  const { articleSchema } = await import('@/lib/model');
  const saved = await saveArticle(
    articleSchema.parse(input.data),
    input.expectedRevision,
    input.publish,
  );
  if (input.publish) {
    revalidateTag('publications', { expire: 0 });
    revalidatePath('/', 'layout');
  }
  return json(saved);
});
