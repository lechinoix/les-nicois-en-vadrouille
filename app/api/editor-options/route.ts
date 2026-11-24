import { requireSession, sameOrigin } from '@/lib/auth';
import { body, endpoint, json } from '@/lib/http';
import {
  createEditorOption,
  listEditorOptions,
  updateEditorOption,
} from '@/lib/editor-options';

export const GET = endpoint(async () => {
  await requireSession();
  return json(await listEditorOptions());
});
export const POST = endpoint(async (request) => {
  await requireSession();
  sameOrigin(request);
  return json(await createEditorOption(await body(request)), 201);
});
export const PATCH = endpoint(async (request) => {
  await requireSession();
  sameOrigin(request);
  return json(await updateEditorOption(await body(request)));
});
