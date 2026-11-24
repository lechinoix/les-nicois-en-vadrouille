import { session } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { database } from '@/db';
import { drafts } from '@/db/schema';
import DraftList from '@/components/DraftList';
export default async function EditorIndex() {
  if (!(await session())) redirect('/login');
  return <DraftList drafts={await database().db.select().from(drafts)} />;
}
