import {
  requireSession,
  requireWrites,
  sameOrigin,
  HttpError,
} from '@/lib/auth';
import { endpoint, json } from '@/lib/http';
import { digest, importBytes } from '@/lib/photos';
export const POST = endpoint(async (req) => {
  await requireSession();
  sameOrigin(req);
  requireWrites();
  if (Number(req.headers.get('content-length')) > 4_000_000)
    throw new HttpError(413, 'Fichier trop volumineux');
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File) || file.size > 4_000_000)
    throw new HttpError(400, 'Photo requise (4 Mo maximum)');
  const bytes = Buffer.from(await file.arrayBuffer());
  return json(await importBytes(async () => bytes, digest(bytes)));
});
