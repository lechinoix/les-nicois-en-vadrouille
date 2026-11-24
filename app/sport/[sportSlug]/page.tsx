import { notFound } from 'next/navigation';
import { publishedArticles } from '@/lib/public';
import sports from '@/lib/sports.json';
import ArticleList from '@/components/ArticleList';
import Photo from '@/components/Photo';
export const dynamic = 'force-dynamic';
export default async function Sport({
  params,
}: {
  params: Promise<{ sportSlug: string }>;
}) {
  const { sportSlug } = await params;
  const s = sports.find((s) => s.slug === sportSlug);
  if (!s) notFound();
  return (
    <>
      <div className="hero">
        <Photo
          url={s.cover.url}
          alt={s.name}
          position={s.cover.position}
          eager
        />
        <h1>{s.name}</h1>
      </div>
      <main>
        <ArticleList
          articles={await publishedArticles()}
          initialSport={s.slug}
        />
      </main>
    </>
  );
}
