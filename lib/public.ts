import { unstable_cache } from 'next/cache';
import { database } from '../db';
import { publications, editorOptions } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import defaultSports from './sports';
import { articleCover } from './model';
export const publishedArticles = unstable_cache(
  async () =>
    (await database().db.select().from(publications))
      .map((p) => p.data)
      .sort((a, b) => b.date.localeCompare(a.date)),
  ['published-articles-v1'],
  { tags: ['publications'], revalidate: 3600 },
);

// Only the sport catalog is public; participant/place/period choices stay private.
export const publicSports = unstable_cache(
  async () => {
    const [choices, articles] = await Promise.all([
      database()
        .db.select({
          slug: editorOptions.value,
          name: editorOptions.label,
          archived: editorOptions.archived,
        })
        .from(editorOptions)
        .where(eq(editorOptions.kind, 'sports'))
        .orderBy(asc(editorOptions.label)),
      publishedArticles(),
    ]);
    return choices.map((choice) => ({
      ...choice,
      slug: choice.slug!,
      cover:
        defaultSports.find((sport) => sport.slug === choice.slug)?.cover ??
        articleCover(
          articles.find((article) => article.sports.includes(choice.slug!)) ?? {
            cover: null,
            pictures: [],
          },
        ),
    }));
  },
  ['public-sports-v1'],
  { tags: ['sports', 'publications'], revalidate: 3600 },
);
