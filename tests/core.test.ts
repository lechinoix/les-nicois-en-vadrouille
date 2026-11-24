import test from 'node:test';
import assert from 'node:assert/strict';
import { assemble, compare, stable } from '../lib/migration';
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
function split(a: Article) {
  const { content, pictures, topos, ...data } = a;
  return [[data], [{ id: a.id, content, pictures, topos }]];
}
test('valid import preserves fields, IDs, markdown and legacy URL', () => {
  const a = article();
  const [m, c] = split(a);
  const r = assemble(m, c);
  assert.deepEqual(r.issues, []);
  assert.equal(stable(r.articles[0]), stable(a));
  assert.equal(articlePath(a), '/adventures/old_id_ecrins-ete');
});
test('duplicate IDs, missing records and malformed fields block import', () => {
  const [m, c] = split(article());
  assert.match(assemble([...m, ...m], c).issues.join(), /duplicate/);
  assert.match(assemble(m, []).issues.join(), /missing content/);
  assert.match(
    assemble([{ ...m[0], date: 'not-a-date' }], c).issues.join(),
    /Invalid date/,
  );
});
test('photo migration preserves identity, order and cover positioning', () => {
  const format = {
    url: 'https://lh3.googleusercontent.com/photo',
    width: 100,
    height: 80,
  };
  const p = {
    ...format,
    id: 42,
    albumId: 'album',
    formats: {
      thumbnail: format,
      small: format,
      medium: format,
      large: format,
      xlarge: format,
    },
  };
  const a = {
    ...article(),
    pictures: [p],
    cover: { ...p, position: 'BOTTOM_LEFT' },
  };
  const [m, c] = split(a);
  assert.ok(assemble(m, c).issues.length);
  const f = {
    ...format,
    url: 'https://res.cloudinary.com/cloud/image/upload/photo.jpg',
  };
  const replacement = {
    ...p,
    ...f,
    id: 'different',
    formats: { thumbnail: f, small: f, medium: f, large: f, xlarge: f },
  };
  const result = assemble(m, c, { [format.url]: replacement });
  assert.deepEqual(result.issues, []);
  assert.equal(result.articles[0].pictures[0].id, 42);
  assert.equal(result.articles[0].cover?.position, 'BOTTOM_LEFT');
  assert.equal(result.articles[0].cover?.url, f.url);
  assert.ok(
    !isCloudinary('https://res.cloudinary.com.evil.test/image/upload/x'),
  );
});
test('broken cover and unexplained differences are reported', () => {
  const [m, c] = split(article());
  assert.ok(assemble([{ ...m[0], cover: { id: 'missing' } }], c).issues.length);
  assert.deepEqual(
    compare([article()], [{ ...article(), content: 'different' }]),
    ['Field mismatch old_id'],
  );
  assert.ok(compare([article()], []).length);
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

test('explicit mapping replaces embedded photo URLs without changing Markdown', () => {
  const url = 'https://lh3.googleusercontent.com/inline=w100';
  const a = { ...article(), content: `# Preserved\n![alt](${url})\n` };
  const [m, c] = split(a);
  const f = {
    url: 'https://res.cloudinary.com/cloud/image/upload/inline.jpg',
    width: 100,
    height: 100,
  };
  const p = {
    ...f,
    id: 'inline',
    albumId: '',
    formats: { thumbnail: f, small: f, medium: f, large: f, xlarge: f },
  };
  const result = assemble(m, c, { [url]: p });
  assert.deepEqual(result.issues, []);
  assert.equal(result.articles[0].content, `# Preserved\n![alt](${f.url})\n`);
});
