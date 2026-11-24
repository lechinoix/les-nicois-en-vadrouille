import test from 'node:test';
import assert from 'node:assert/strict';
import { eq } from 'drizzle-orm';
import { database } from '../db';
import { saveArticle, Conflict } from '../lib/articles';
import { emptyArticle } from '../lib/model';
import { publications, drafts } from '../db/schema';
// Only run on an explicitly marked disposable database. Never point at production.
test(
  'Postgres: atomic revisions, private drafts, repeated publish, independent articles',
  { skip: process.env.TEST_DATABASE_DISPOSABLE !== 'true' },
  async () => {
    const id = `test-${crypto.randomUUID()}`;
    const a = { ...emptyArticle(id), title: 'Original' };
    try {
      const initial = await saveArticle(a, 0, true);
      assert.equal(initial.revision, 1);
      const races = await Promise.allSettled([
        saveArticle({ ...a, title: 'Tab A' }, 1, false),
        saveArticle({ ...a, title: 'Tab B' }, 1, false),
      ]);
      assert.equal(races.filter((r) => r.status === 'fulfilled').length, 1);
      const rejected = races.find(
        (r) => r.status === 'rejected',
      ) as PromiseRejectedResult;
      assert.ok(rejected.reason instanceof Conflict);
      const [publicBefore] = await database()
        .db.select()
        .from(publications)
        .where(eq(publications.id, id));
      assert.equal(publicBefore.data.title, 'Original');
      const [draft] = await database()
        .db.select()
        .from(drafts)
        .where(eq(drafts.id, id));
      const published = await saveArticle(draft.data, 2, true);
      assert.equal(published.revision, 3);
      const again = await saveArticle(published.data, 3, true);
      assert.equal(again.revision, 4);
      const other = await saveArticle({ ...a, id: `${id}-other` }, 0, false);
      assert.equal(other.revision, 1);
    } finally {
      await database().client.end();
    }
  },
);
