import { notFound, redirect } from 'next/navigation';
import { publishedArticles } from '@/lib/public';
import { articlePath } from '@/lib/model';
import ArticleView from '@/components/ArticleView';
export const dynamic = 'force-dynamic';
export default async function Adventure({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const list = await publishedArticles();
  const article =
    list.find((a) => a.id === path) ||
    list
      .filter((a) => path.startsWith(`${a.id}_`))
      .sort((a, b) => b.id.length - a.id.length)[0];
  if (!article) notFound();
  if (path === article.id) redirect(articlePath(article));
  return <ArticleView article={article} />;
}
