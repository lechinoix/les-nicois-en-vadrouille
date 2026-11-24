import { session } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDraft } from '@/lib/articles';
import { emptyArticle } from '@/lib/model';
import Editor from '@/components/Editor';
import { listEditorOptions } from '@/lib/editor-options';
export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await session())) redirect('/login');
  const { id } = await params;
  const draft = (await getDraft(id)) || {
    id,
    revision: 0,
    data: emptyArticle(id),
    updatedAt: new Date().toISOString(),
  };
  return <Editor initial={draft} initialOptions={await listEditorOptions()} />;
}
