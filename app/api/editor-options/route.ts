import { requireSession, sameOrigin } from '@/lib/auth';
import { body, endpoint, json } from '@/lib/http';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  createEditorOption,
  listEditorOptions,
  updateEditorOption,
} from '@/lib/editor-options';

function invalidateSports(option: { kind: string }) {
  if (option.kind === 'sports') {
    revalidateTag('sports', { expire: 0 });
    revalidatePath('/', 'layout');
  }
}

export const GET = endpoint(async () => {
  await requireSession();
  return json(await listEditorOptions());
});
export const POST = endpoint(async (request) => {
  await requireSession();
  sameOrigin(request);
  const option = await createEditorOption(await body(request));
  invalidateSports(option);
  return json(option, 201);
});
export const PATCH = endpoint(async (request) => {
  await requireSession();
  sameOrigin(request);
  const option = await updateEditorOption(await body(request));
  invalidateSports(option);
  return json(option);
});
