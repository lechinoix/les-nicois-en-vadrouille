import { requireSession } from '@/lib/auth';
import { getDraft } from '@/lib/articles';
import { endpoint, json } from '@/lib/http';
export const GET = endpoint(async (req) => {
  await requireSession();
  const draft = await getDraft(
    decodeURIComponent(new URL(req.url).pathname.split('/').pop()!),
  );
  return draft ? json(draft) : json({ error: 'Introuvable' }, 404);
});
