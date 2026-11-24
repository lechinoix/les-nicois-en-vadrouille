import { redirect } from 'next/navigation';
import { session } from '@/lib/auth';
import { listEditorOptions } from '@/lib/editor-options';
import OptionManager from '@/components/OptionManager';

export default async function OptionsPage() {
  if (!(await session())) redirect('/login');
  return <OptionManager initial={await listEditorOptions()} />;
}
