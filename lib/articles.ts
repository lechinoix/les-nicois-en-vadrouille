import { eq, sql } from 'drizzle-orm';
import { database } from '../db';
import { articles, drafts, publications, snapshots } from '../db/schema';
import { articleSchema, publishable, type Article } from './model';
export class Conflict extends Error {
  constructor(public current: unknown) {
    super('Une autre version a été enregistrée. Votre travail est conservé.');
  }
}
export async function saveArticle(
  input: Article,
  expectedRevision: number,
  publish: boolean,
) {
  const data = articleSchema.parse(input);
  if (publish) publishable(data);
  return database().db.transaction(async (tx) => {
    // Transaction-scoped lock also covers concurrent creation of the same ID.
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${data.id}, 0))`,
    );
    const [current] = await tx
      .select()
      .from(drafts)
      .where(eq(drafts.id, data.id));
    if ((current?.revision ?? 0) !== expectedRevision)
      throw new Conflict(current ?? null);
    if (!current) await tx.insert(articles).values({ id: data.id });
    const revision = expectedRevision + 1;
    const [saved] = await tx
      .insert(drafts)
      .values({ id: data.id, data, revision })
      .onConflictDoUpdate({
        target: drafts.id,
        set: { data, revision, updatedAt: new Date() },
      })
      .returning();
    if (publish) {
      await tx.insert(snapshots).values({ id: data.id, data, revision });
      await tx
        .insert(publications)
        .values({ id: data.id, data, revision })
        .onConflictDoUpdate({
          target: publications.id,
          set: { data, revision, publishedAt: new Date() },
        });
    }
    return saved;
  });
}
export const getDraft = async (id: string) =>
  (await database().db.select().from(drafts).where(eq(drafts.id, id)))[0];
