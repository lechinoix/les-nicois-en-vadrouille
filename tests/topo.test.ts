import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyArticle } from '../lib/model';
import { camptocampRouteId, emptyTopoFields } from '../lib/topo';
import { extractRouteDetails, fetchTopoDetails } from '../lib/topo-extractor';

const url =
  'https://www.camptocamp.org/routes/109122/fr/presles-fond-du-cirque-shesep-ankh';
// Relevant fields from the public Camptocamp route supplied in the bug report.
const route = {
  document_id: 109122,
  height_diff_difficulties: 250,
  orientations: ['SE'],
  global_rating: 'TD',
  rock_free_rating: '6b+',
  rock_required_rating: '6a',
  engagement_rating: 'I',
  risk_rating: null,
  equipment_rating: 'P1',
};
const expected = {
  elevation: 250,
  cotation: 'TD 6b+>6a I P1',
  orientation: 'SE',
};

test('topo URLs accept Camptocamp routes only, without fetching arbitrary URLs', async () => {
  assert.equal(camptocampRouteId(url), '109122');
  assert.equal(
    camptocampRouteId(
      'http://camptocamp.org/routes/109122?foo=bar#description',
    ),
    '109122',
  );
  const rejected = [
    'https://www.camptocamp.org.evil.example/routes/109122',
    'https://evil.example/camptocamp.org/routes/109122',
    'https://www.camptocamp.org@127.0.0.1/routes/109122',
    'https://user@www.camptocamp.org/routes/109122',
    'https://www.camptocamp.org:123/routes/109122',
    'https://www.camptocamp.org/outings/109122',
    'https://www.camptocamp.org/routes/109122xyz',
    'https://www.camptocamp.org/routes/0',
    'https://www.camptocamp.org/routes/../109122',
    'file:///routes/109122',
    'https://skitour.fr/topos/1',
    'not a URL',
  ];
  for (const value of rejected) {
    assert.equal(camptocampRouteId(value), null);
    await assert.rejects(
      fetchTopoDetails(value, async () => {
        assert.fail('Unsupported URLs must not initiate a request');
      }),
      { status: 400 },
    );
  }
});

test('Camptocamp extraction reproduces the legacy fields without null ratings', () => {
  assert.deepEqual(extractRouteDetails(route, '109122'), expected);
  assert.deepEqual(extractRouteDetails({ document_id: 1 }, '1'), {
    elevation: null,
    cotation: null,
    orientation: null,
  });
  assert.equal(
    extractRouteDetails({ document_id: 1, rock_required_rating: '6a' }, '1')
      .cotation,
    '6a obligatoire',
  );
  assert.equal(
    extractRouteDetails({ document_id: 1, rock_free_rating: '6b' }, '1')
      .cotation,
    '6b',
  );
  assert.equal(
    extractRouteDetails(
      { ...route, height_diff_difficulties: 0, orientations: [] },
      '109122',
    ).elevation,
    0,
  );
  assert.throws(
    () => extractRouteDetails({ ...route, document_id: 2 }, '109122'),
    { status: 502 },
  );
  assert.throws(
    () =>
      extractRouteDetails(
        { ...route, height_diff_difficulties: 'unknown' },
        '109122',
      ),
    { status: 502 },
  );
});

test('extraction uses a fixed API host, timeout and no redirects; failures are recoverable', async () => {
  assert.deepEqual(
    await fetchTopoDetails(url, async (target, options) => {
      assert.equal(target, 'https://api.camptocamp.org/routes/109122?l=fr');
      assert.equal(options?.redirect, 'error');
      assert.equal(options?.cache, 'no-store');
      assert.ok(options?.signal instanceof AbortSignal);
      return Response.json(route);
    }),
    expected,
  );
  for (const [status, wanted] of [
    [404, 404],
    [429, 502],
    [500, 502],
    [302, 502],
  ]) {
    await assert.rejects(
      fetchTopoDetails(url, async () => new Response('', { status })),
      { status: wanted },
    );
  }
  await assert.rejects(
    fetchTopoDetails(url, async () => new Response('not JSON')),
    { status: 502 },
  );
  await assert.rejects(
    fetchTopoDetails(url, async () => {
      throw new Error('network error');
    }),
    { status: 502 },
  );
});

test('topo autofill only patches empty current fields and preserves zero elevation', () => {
  const article = emptyArticle('topo-test');
  assert.deepEqual(emptyTopoFields(article, expected), expected);
  assert.deepEqual(
    emptyTopoFields(
      { ...article, elevation: 0, cotation: 'my grade', orientation: 'N' },
      expected,
    ),
    {},
  );
  assert.deepEqual(
    emptyTopoFields(
      { ...article, cotation: 'manual edit during fetch' },
      expected,
    ),
    { elevation: 250, orientation: 'SE' },
  );
  assert.deepEqual(
    emptyTopoFields(article, {
      cotation: null,
      elevation: null,
      orientation: null,
    }),
    {},
  );
});
