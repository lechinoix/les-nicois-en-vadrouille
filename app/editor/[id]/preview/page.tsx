import { session } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getDraft } from '@/lib/articles';
import ArticleView from '@/components/ArticleView';
export default async function Preview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await session())) redirect('/login');
  const draft = await getDraft((await params).id);
  if (!draft) notFound();
  return <ArticleView article={draft.data} />;
}
