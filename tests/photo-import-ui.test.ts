import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { pictureSchema } from '../lib/model';

test(
  'photo imports preserve conflicts and continue with progress and errors after closing the drawer',
  { timeout: 20000 },
  async () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'http://localhost',
      pretendToBeVisual: true,
    });
    const win = dom.window;
    globalThis.requestAnimationFrame = win.requestAnimationFrame.bind(win);
    globalThis.cancelAnimationFrame = win.cancelAnimationFrame.bind(win);
    for (const name of [
      'window',
      'document',
      'navigator',
      'HTMLElement',
      'Element',
      'Node',
      'DocumentFragment',
      'MutationObserver',
      'Event',
      'MouseEvent',
      'KeyboardEvent',
      'FocusEvent',
      'getComputedStyle',
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
    const { render, screen, cleanup, waitFor, act } =
      await import('@testing-library/react');
    const { default: userEvent } = await import('@testing-library/user-event');
    const { default: PhotoImport } = await import('../components/PhotoImport');
    const user = userEvent.setup({ document: win.document });
    const originalFetch = globalThis.fetch;
    const order: string[] = [];
    const tab = {
      opener: win,
      location: { href: '' },
      close: () => order.push('closed-tab'),
    };
    win.open = (() => {
      order.push('opened-tab');
      return tab;
    }) as unknown as typeof win.open;
    const format = {
      url: 'https://res.cloudinary.com/test/image/upload/first.jpg',
      width: 400,
      height: 300,
    };
    const picture = pictureSchema.parse({
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
    const progress = {
      id: crypto.randomUUID(),
      articleId: 'draft',
      status: 'ready',
      pictures: [picture],
      skipped: 0,
      nextPollAt: 0,
      timeoutAt: Date.now() + 60000,
    };
    let saved = false;
    let saveAttempts = 0;
    globalThis.fetch = async (url, init) => {
      if (!init || !init.method) return Response.json(null);
      const body = JSON.parse(String(init.body));
      if (String(url).endsWith('/start')) {
        order.push('started');
        return Response.json({
          job: { ...progress, status: 'selecting', pictures: [] },
          url: 'https://accounts.google.com/authorize',
        });
      }
      if (body.action === 'advance') return Response.json(progress);
      assert.equal(body.action, 'complete');
      assert.equal(
        saved,
        true,
        'completion must follow a confirmed draft save',
      );
      order.push('completed');
      return Response.json({ ...progress, status: 'complete' });
    };
    try {
      render(
        React.createElement(PhotoImport, {
          articleId: 'draft',
          beforeImport: async () => {
            order.push('saved-before-opening');
          },
          onPhotos: async (photos) => {
            assert.equal(photos[0].id, picture.id);
            saveAttempts++;
            if (saveAttempts === 1)
              throw new Error('Conflit : votre travail est conservé.');
            saved = true;
          },
        }),
      );
      await user.click(
        screen.getByRole('button', { name: 'Ajouter des photos' }),
      );
      assert.equal(
        screen.queryByRole('button', { name: 'Connecter Google Photos' }),
        null,
      );
      await user.click(
        await screen.findByRole('button', {
          name: 'Google Photos',
        }),
      );
      await screen.findByRole('alert');
      assert.match(screen.getByRole('alert').textContent!, /Conflit/);
      assert.ok(
        screen.getByRole('dialog'),
        'failed save leaves the drawer open',
      );
      assert.equal(order.includes('completed'), false);
      assert.deepEqual(order.slice(0, 3), [
        'opened-tab',
        'saved-before-opening',
        'started',
      ]);
      assert.equal(tab.location.href, 'https://accounts.google.com/authorize');
      await user.click(
        screen.getByRole('button', { name: 'Réessayer l’import' }),
      );
      await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
      assert.equal(saveAttempts, 2);
      assert.ok(order.includes('completed'));
      assert.match(
        screen.getByRole('status').textContent!,
        /1 photo\(s\) ajoutée/,
      );
      cleanup();

      // Closing/reopening during an in-flight request must neither discard its
      // result nor spawn another worker. The next batch and save run closed.
      let advances = 0;
      let completions = 0;
      let release!: (response: Response) => void;
      const second = { ...picture, id: 'second' };
      const savedBatches: (string | number)[][] = [];
      globalThis.fetch = async (url, init) => {
        if (!init?.method) return Response.json(null);
        const body = JSON.parse(String(init.body));
        if (String(url).endsWith('/start'))
          return Response.json({
            job: { ...progress, status: 'selecting', pictures: [] },
            url: 'https://accounts.google.com/authorize',
          });
        if (body.action === 'advance') {
          advances++;
          if (advances === 1)
            return new Promise<Response>((resolve) => {
              release = resolve;
            });
          return Response.json({ ...progress, pictures: [picture, second] });
        }
        assert.equal(body.action, 'complete');
        assert.deepEqual(savedBatches.at(-1), ['first', 'second']);
        completions++;
        return Response.json({
          ...progress,
          status: 'complete',
          pictures: [picture, second],
        });
      };
      render(
        React.createElement(PhotoImport, {
          articleId: 'draft',
          beforeImport: async () => {},
          onPhotos: async (photos) => {
            savedBatches.push(photos.map((p) => p.id));
          },
        }),
      );
      await user.click(
        screen.getByRole('button', { name: 'Ajouter des photos' }),
      );
      await user.click(
        await screen.findByRole('button', { name: 'Google Photos' }),
      );
      await waitFor(() => assert.equal(advances, 1));
      await user.click(screen.getByRole('button', { name: 'Fermer' }));
      await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
      await screen.findByText(/L’import continue en arrière-plan/);
      await user.click(
        screen.getByRole('button', { name: 'Voir l’import en cours' }),
      );
      await screen.findByRole('dialog');
      assert.equal(advances, 1, 'reopening must not start a parallel advance');
      await user.click(screen.getByRole('button', { name: 'Fermer' }));
      await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
      await act(async () =>
        release(Response.json({ ...progress, status: 'importing' })),
      );
      await waitFor(() => assert.equal(completions, 1));
      assert.equal(advances, 2, 'the next batch runs with the drawer closed');
      assert.deepEqual(savedBatches, [['first'], ['first', 'second']]);
      assert.equal(screen.queryByRole('dialog'), null);
      assert.match(
        screen.getByRole('status').textContent!,
        /2 photo\(s\) ajoutée/,
      );
      cleanup();

      // A conflict in the background remains visible and requires retry rather
      // than acknowledging photos that were never saved to the draft.
      advances = 0;
      completions = 0;
      saveAttempts = 0;
      globalThis.fetch = async (url, init) => {
        if (!init?.method) return Response.json(null);
        const body = JSON.parse(String(init.body));
        if (String(url).endsWith('/start'))
          return Response.json({
            job: { ...progress, status: 'selecting', pictures: [] },
            url: null,
          });
        if (body.action === 'advance') {
          advances++;
          if (advances === 1)
            return new Promise<Response>((resolve) => {
              release = resolve;
            });
          return Response.json(progress);
        }
        assert.equal(body.action, 'complete');
        assert.equal(saveAttempts, 2);
        completions++;
        return Response.json({ ...progress, status: 'complete' });
      };
      render(
        React.createElement(PhotoImport, {
          articleId: 'draft',
          beforeImport: async () => {},
          onPhotos: async () => {
            saveAttempts++;
            if (saveAttempts === 1)
              throw new Error('Conflit : votre travail est conservé.');
          },
        }),
      );
      await user.click(
        screen.getByRole('button', { name: 'Ajouter des photos' }),
      );
      await user.click(
        await screen.findByRole('button', { name: 'Google Photos' }),
      );
      await waitFor(() => assert.equal(advances, 1));
      await user.click(screen.getByRole('button', { name: 'Fermer' }));
      await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
      await act(async () => release(Response.json(progress)));
      await screen.findByRole('alert');
      assert.match(
        screen.getByRole('alert').textContent!,
        /Conflit.*Ouvrez le panneau/,
      );
      assert.equal(screen.queryByRole('dialog'), null);
      assert.equal(completions, 0);
      assert.equal(advances, 1);
      await user.click(
        screen.getByRole('button', { name: 'Reprendre l’ajout de photos' }),
      );
      await user.click(
        await screen.findByRole('button', { name: 'Réessayer l’import' }),
      );
      await waitFor(() => assert.equal(completions, 1));
      await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
      assert.equal(screen.queryByRole('alert'), null);
    } finally {
      cleanup();
      globalThis.fetch = originalFetch;
      dom.window.close();
    }
  },
);
