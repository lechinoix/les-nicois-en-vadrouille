import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Photo from '../components/Photo';

const url = 'https://res.cloudinary.com/blog/image/upload/v1/alps.jpg';

test('thumbnails never offer an image wider than 400px, even on high-DPI screens', () => {
  const html = renderToStaticMarkup(
    createElement(Photo, { url, alt: 'Alpes', thumbnail: true }),
  );
  assert.match(html, /src="[^"]*w_400/);
  assert.match(html, /loading="lazy"/);
  const widths = [...html.matchAll(/w_(\d+)/g)].map((match) =>
    Number(match[1]),
  );
  assert.ok(widths.length > 1);
  assert.ok(widths.every((width) => width <= 400));
  assert.match(html, /f_auto,q_auto,c_limit/);
});

test('covers and expanded photos retain large responsive image choices', () => {
  const html = renderToStaticMarkup(
    createElement(Photo, { url, alt: 'Alpes', eager: true }),
  );
  assert.match(html, /w_2560/);
  assert.match(html, /loading="eager"/);
});

test('missing covers follow the first photo; explicit covers and positions are preserved', async () => {
  const { articleCover, emptyArticle } = await import('../lib/model');
  const { pictureSchema } = await import('../lib/model');
  const format = { url, width: 800, height: 600 };
  const first = pictureSchema.parse({
    ...format,
    id: 'first',
    albumId: '',
    formats: Object.fromEntries(
      ['thumbnail', 'small', 'medium', 'large', 'xlarge'].map((k) => [
        k,
        format,
      ]),
    ),
  });
  const second = { ...first, id: 'second' };
  const article = { ...emptyArticle('cover-test'), pictures: [first, second] };
  assert.equal(articleCover(emptyArticle('empty')), null);
  assert.equal(articleCover(article)?.id, 'first');
  assert.equal(articleCover(article)?.position, 'CENTER');
  assert.equal(
    articleCover({ ...article, pictures: [second, first] })?.id,
    'second',
  );
  const cover = { ...second, position: 'TOP' };
  assert.deepEqual(articleCover({ ...article, cover }), cover);
  assert.equal(
    article.cover,
    null,
    'display fallback must not mutate the saved article',
  );
});
