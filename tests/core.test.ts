import test from 'node:test';
import assert from 'node:assert/strict';
import {
  articlePath,
  emptyArticle,
  isCloudinary,
  type Article,
  type Draft,
} from '../lib/model';
import { SaveQueue } from '../lib/save-queue';
const article = (): Article => ({
  ...emptyArticle('old_id'),
  title: 'Écrins : été',
  date: '2024-06-01',
  content: '# Exact Markdown\n\n**hello**',
});
test('article URLs remain stable', () => {
  assert.equal(articlePath(article()), '/adventures/old_id_ecrins-ete');
});
test('Cloudinary host matching rejects lookalike hosts', () => {
  assert.ok(
    !isCloudinary('https://res.cloudinary.com.evil.test/image/upload/x'),
  );
});
test('save queue serializes requests and preserves typing during an in-flight save', async () => {
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  let active = 0,
    max = 0;
  const revisions: number[] = [];
  const initial: Draft = {
    id: 'old_id',
    data: article(),
    revision: 1,
    updatedAt: new Date(),
  };
  const q = new SaveQueue(
    initial,
    async (data, revision) => {
      active++;
      max = Math.max(max, active);
      revisions.push(revision);
      if (revision === 1) await gate;
      active--;
      return { ...initial, data, revision: revision + 1 };
    },
    () => {},
  );
  q.edit({ ...q.current.data, title: 'first' });
  const saving = q.save();
  q.edit({ ...q.current.data, content: 'typed while saving' });
  const again = q.save(true);
  release();
  await Promise.all([saving, again]);
  assert.equal(max, 1);
  assert.deepEqual(revisions, [1, 2]);
  assert.equal(q.current.revision, 3);
  assert.equal(q.current.data.content, 'typed while saving');
  assert.equal(q.dirty, false);
});
test('failed save retains work and revision for recovery', async () => {
  const d = {
    id: 'old_id',
    data: article(),
    revision: 3,
    updatedAt: new Date(),
  };
  const q = new SaveQueue(
    d,
    async () => {
      throw new Error('409');
    },
    () => {},
  );
  q.edit({ ...d.data, content: 'unsaved' });
  await assert.rejects(q.save());
  assert.equal(q.current.data.content, 'unsaved');
  assert.equal(q.current.revision, 3);
  assert.equal(q.dirty, true);
});
