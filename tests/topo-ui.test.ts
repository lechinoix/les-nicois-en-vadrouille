import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { emptyArticle } from '../lib/model';
import { emptyTopoFields } from '../lib/topo';

test(
  'topo input autofills on addition, preserves edits, ignores removed links, and retries failures',
  { timeout: 20000 },
  async () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'http://localhost',
    });
    const win = dom.window;
    for (const name of [
      'window',
      'document',
      'navigator',
      'HTMLElement',
      'Element',
      'Node',
      'Event',
      'MouseEvent',
    ] as const) {
      Object.defineProperty(globalThis, name, {
        configurable: true,
        value: name === 'window' ? win : win[name],
      });
    }
    Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
      configurable: true,
      writable: true,
      value: true,
    });
    const React = await import('react');
    const { render, screen, fireEvent, act, cleanup, waitFor } =
      await import('@testing-library/react');
    const { default: TopoInput } = await import('../components/TopoInput');
    const originalFetch = globalThis.fetch;
    const details = {
      cotation: 'TD 6b+>6a I P1',
      elevation: 250,
      orientation: 'SE',
    };
    const url =
      'https://www.camptocamp.org/routes/109122/fr/presles-fond-du-cirque-shesep-ankh';
    const requests: {
      resolve: (response: Response) => void;
      signal?: AbortSignal | null;
    }[] = [];
    let article = emptyArticle('draft');
    let applied = 0;
    let update!: React.Dispatch<React.SetStateAction<typeof article>>;
    globalThis.fetch = async (_url, options) =>
      new Promise<Response>((resolve) => {
        assert.equal(_url, '/api/topos/extract');
        requests.push({ resolve, signal: options?.signal });
      });
    function Harness() {
      const [value, setValue] = React.useState(article);
      article = value;
      update = setValue;
      return React.createElement(TopoInput, {
        value: value.topos,
        onChange: (topos) => setValue((current) => ({ ...current, topos })),
        onDetails: (_url, data) => {
          applied++;
          const patch = emptyTopoFields(article, data);
          setValue((current) => ({ ...current, ...patch }));
          return Object.keys(patch);
        },
      });
    }
    try {
      render(React.createElement(Harness));
      const textarea = screen.getByLabelText(
        'Topos (un lien par ligne)',
      ) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: url + '\n' } });
      await waitFor(() => assert.equal(requests.length, 1));
      // A canonical autosave response with equivalent links must not restart the request or erase newlines.
      act(() =>
        update((current) => ({
          ...current,
          topos: [...current.topos],
          cotation: 'My grade',
        })),
      );
      assert.equal(textarea.value, url + '\n');
      assert.equal(requests[0].signal?.aborted, false);
      await act(async () => requests[0].resolve(Response.json(details)));
      await waitFor(() => assert.equal(article.elevation, 250));
      assert.equal(article.cotation, 'My grade');
      assert.equal(article.orientation, 'SE');
      assert.deepEqual(article.topos, [url]);
      assert.equal(applied, 1);

      // Replacing a link cancels its request even if the server still returns a response.
      fireEvent.change(textarea, {
        target: { value: 'https://camptocamp.org/routes/2' },
      });
      await waitFor(() => assert.equal(requests.length, 2));
      fireEvent.change(textarea, {
        target: { value: 'https://skitour.fr/topos/1' },
      });
      assert.equal(requests[1].signal?.aborted, true);
      await act(async () => requests[1].resolve(Response.json(details)));
      assert.equal(applied, 1);
      assert.deepEqual(article.topos, ['https://skitour.fr/topos/1']);

      fireEvent.change(textarea, { target: { value: url } });
      await waitFor(() => assert.equal(requests.length, 3));
      await act(async () =>
        requests[2].resolve(
          Response.json({ error: 'Camptocamp indisponible' }, { status: 502 }),
        ),
      );
      await screen.findByText('Camptocamp indisponible');
      assert.deepEqual(article.topos, [url]);
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Compléter les champs vides depuis Camptocamp',
        }),
      );
      await waitFor(() => assert.equal(requests.length, 4));
      await act(async () => requests[3].resolve(Response.json(details)));
      await screen.findByText(
        'Aucun champ vide à compléter avec les données de ce topo.',
      );
      assert.equal(applied, 2);
      cleanup();

      // Opening an existing draft must not modify it; explicit refresh is available.
      render(React.createElement(Harness));
      assert.equal(screen.getByRole('status').textContent, '');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Compléter les champs vides depuis Camptocamp',
        }),
      );
      await waitFor(() => assert.equal(requests.length, 5));
      await act(async () => requests[4].resolve(Response.json(details)));
    } finally {
      cleanup();
      globalThis.fetch = originalFetch;
      win.close();
    }
  },
);
