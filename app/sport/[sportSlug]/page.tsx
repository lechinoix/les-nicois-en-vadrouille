import { notFound } from 'next/navigation';
import { publishedArticles, publicSports } from '@/lib/public';
import ArticleList from '@/components/ArticleList';
import Photo from '@/components/Photo';
export const dynamic = 'force-dynamic';
export default async function Sport({
  params,
}: {
  params: Promise<{ sportSlug: string }>;
}) {
  const { sportSlug } = await params;
  const sports = await publicSports();
  const s = sports.find((s) => s.slug === sportSlug);
  if (!s) notFound();
  return (
    <>
      <div className="hero">
        {s.cover && (
          <Photo
            url={s.cover.url}
            alt={s.name}
            position={s.cover.position}
            eager
          />
        )}
        <h1>{s.name}</h1>
      </div>
      <main>
        <ArticleList
          sports={sports}
          articles={await publishedArticles()}
          initialSport={s.slug}
        />
      </main>
    </>
  );
}
