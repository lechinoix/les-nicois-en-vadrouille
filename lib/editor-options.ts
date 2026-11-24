import { and, asc, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { database } from '../db';
import { editorOptions } from '../db/schema';
import { HttpError } from './auth';
import { createOptionSchema, updateOptionSchema } from './editor-option-model';

export async function listEditorOptions() {
  return database()
    .db.select()
    .from(editorOptions)
    .orderBy(asc(editorOptions.kind), asc(editorOptions.label));
}

export async function createEditorOption(input: unknown) {
  const data = createOptionSchema.parse(input);
  const [created] = await database()
    .db.insert(editorOptions)
    .values({
      ...data,
      value: data.kind === 'sports' ? `sport-${randomUUID()}` : null,
    })
    .onConflictDoNothing()
    .returning();
  if (!created)
    throw new HttpError(
      409,
      'Ce libellé existe déjà, éventuellement dans les choix archivés.',
    );
  return created;
}

export async function updateEditorOption(input: unknown) {
  const { id, expectedRevision, label, archived } =
    updateOptionSchema.parse(input);
  try {
    const [updated] = await database()
      .db.update(editorOptions)
      .set({
        label,
        archived,
        revision: expectedRevision + 1,
      })
      .where(
        and(
          eq(editorOptions.id, id),
          eq(editorOptions.revision, expectedRevision),
        ),
      )
      .returning();
    if (!updated)
      throw new HttpError(
        409,
        'Ce choix a changé dans un autre onglet. Actualisez la liste avant de réessayer.',
      );
    return updated;
  } catch (error) {
    const failure = error as { code?: string; cause?: { code?: string } };
    if ((failure.code || failure.cause?.code) === '23505')
      throw new HttpError(409, 'Ce libellé existe déjà dans cette liste.');
    throw error;
  }
}
