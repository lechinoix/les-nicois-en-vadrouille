import { session } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { listEditorOptions } from '@/lib/editor-options';
import { optionValue } from '@/lib/editor-option-model';
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
  return (
    <ArticleView
      article={draft.data}
      sports={(await listEditorOptions())
        .filter((option) => option.kind === 'sports')
        .map((option) => ({
          slug: optionValue(option),
          name: option.label,
          archived: option.archived,
        }))}
    />
  );
}
