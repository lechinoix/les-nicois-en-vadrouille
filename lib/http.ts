import { ContentError } from './model';
import { ZodError } from 'zod';
import { HttpError } from './auth';
import { Conflict } from './articles';
export const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
export function endpoint(fn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await fn(req);
    } catch (e) {
      if (e instanceof Conflict)
        return json({ error: e.message, current: e.current }, 409);
      if (e instanceof ContentError) return json({ error: e.message }, 400);
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      if (e instanceof ZodError)
        return json({ error: 'Données invalides', issues: e.issues }, 400);
      console.error(e instanceof Error ? e.name : 'Request failed');
      return json(
        {
          error:
            'Opération impossible. Gardez cette page ouverte et réessayez.',
        },
        500,
      );
    }
  };
}
export async function body(req: Request) {
  const text = await req.text();
  if (Buffer.byteLength(text) > 2_000_000)
    throw new HttpError(413, 'Document trop volumineux');
  return JSON.parse(text);
}
