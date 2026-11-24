import { requireSession } from '@/lib/auth';
import { database } from '@/db';
import {
  drafts,
  publications,
  snapshots,
  migrations,
  assets,
} from '@/db/schema';
import { endpoint } from '@/lib/http';
export const GET = endpoint(async () => {
  await requireSession();
  const data = await database().db.transaction(
    async (tx) => ({
      version: 1,
      exportedAt: new Date().toISOString(),
      drafts: await tx.select().from(drafts),
      publications: await tx.select().from(publications),
      snapshots: await tx.select().from(snapshots),
      migrations: await tx.select().from(migrations),
      assets: await tx.select().from(assets),
    }),
    { isolationLevel: 'repeatable read', accessMode: 'read only' },
  );
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-store',
      'Content-Disposition': 'attachment; filename="neon-export.json"',
    },
  });
});
