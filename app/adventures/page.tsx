import { publishedArticles } from '@/lib/public';
import ArticleList from '@/components/ArticleList';
export const dynamic = 'force-dynamic';
export default async function Adventures() {
  return (
    <main className="below-header">
      <h1>Nos aventures</h1>
      <ArticleList articles={await publishedArticles()} />
    </main>
  );
}
