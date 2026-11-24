import { z } from 'zod';
import { requireSession, sameOrigin } from '@/lib/auth';
import { body, endpoint, json } from '@/lib/http';
import { fetchTopoDetails } from '@/lib/topo-extractor';

export const POST = endpoint(async (request) => {
  await requireSession();
  sameOrigin(request);
  const { url } = z
    .object({ url: z.string().trim().max(2048).url() })
    .parse(await body(request));
  return json(await fetchTopoDetails(url));
});
