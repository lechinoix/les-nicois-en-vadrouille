import { redirect } from 'next/navigation';
import { session } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await session())) redirect('/login');
  return children;
}
