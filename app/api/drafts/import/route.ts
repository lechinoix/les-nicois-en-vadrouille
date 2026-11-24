import { createHash } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { database } from '@/db';
import { articles, drafts } from '@/db/schema';
import { articleSchema } from '@/lib/model';
import {
  requireSession,
  requireWrites,
  sameOrigin,
  HttpError,
} from '@/lib/auth';
import { endpoint, json, body } from '@/lib/http';
export const POST = endpoint(async (req) => {
  await requireSession();
  sameOrigin(req);
  requireWrites();
  const input = await body(req);
  const items = Array.isArray(input) ? input : [input];
  if (items.length > 500) throw new HttpError(400, 'Trop de brouillons');
  const prepared = items.map((item) => {
    const value = item.value ?? item;
    const original = articleSchema.parse(value.data ?? value);
    const id = `draft-import-${createHash('sha256').update(JSON.stringify(original)).digest('hex').slice(0, 32)}`;
    return { ...original, id };
  });
  await database().db.transaction(async (tx) => {
    for (const data of prepared) {
      await tx.insert(articles).values({ id: data.id }).onConflictDoNothing();
      const [existing] = await tx
        .select()
        .from(drafts)
        .where(eq(drafts.id, data.id));
      if (!existing)
        await tx.insert(drafts).values({ id: data.id, revision: 1, data });
    }
  });
  return json({ imported: prepared.map((a) => a.id) });
});
