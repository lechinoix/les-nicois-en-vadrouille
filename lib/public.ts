import { unstable_cache } from 'next/cache';
import { database } from '../db';
import { publications } from '../db/schema';
export const publishedArticles = unstable_cache(
  async () =>
    (await database().db.select().from(publications))
      .map((p) => p.data)
      .sort((a, b) => b.date.localeCompare(a.date)),
  ['published-articles-v1'],
  { tags: ['publications'], revalidate: 3600 },
);
