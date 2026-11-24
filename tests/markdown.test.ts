import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from '../components/Markdown';

const render = (children: string) =>
  renderToStaticMarkup(createElement(Markdown, { children }));

test('bare HTML line breaks render inline and between article sections', () => {
  const html = render(
    '*Une nuit de rêve*\n\n<br>\n\n## Jour 4\n\nDébut<br/>Milieu<BR />Fin\n\n<br>\n<br />',
  );
  assert.equal((html.match(/<br\/>/g) || []).length, 5);
  assert.match(html, /<h2>Jour 4<\/h2>/);
  assert.match(html, /Début<br\/>Milieu<br\/>Fin/);
  assert.doesNotMatch(html, /&lt;br/i);
});

test('line-break transformation leaves code and deliberately escaped examples literal', () => {
  const html = render('`<br>`\n\n```html\n<br />\n```\n\n&lt;br&gt;\n\n\\<br>');
  assert.match(html, /<code>&lt;br&gt;<\/code>/);
  assert.match(html, /<pre><code class="language-html">&lt;br \/&gt;/);
  assert.equal((html.match(/&lt;br/g) || []).length, 4);
  assert.doesNotMatch(html, /<br\/>/);
});

test('other raw HTML and line-break attributes remain escaped', () => {
  const html = render(
    '<script>alert(1)</script>\n\n<br onmouseover="alert(1)">\n\n<img src=x onerror="alert(1)">',
  );
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;br onmouseover=/);
  assert.match(html, /&lt;img/);
  assert.doesNotMatch(html, /<(?:script|br|img)\b/);
});
