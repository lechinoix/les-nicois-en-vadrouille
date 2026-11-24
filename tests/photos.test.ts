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
