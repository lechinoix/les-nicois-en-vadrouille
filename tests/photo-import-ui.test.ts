import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { pictureSchema } from '../lib/model';

test(
  'import drawer authorizes automatically and closes only after a successful draft save',
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
    const { render, screen, cleanup, waitFor } =
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
    } finally {
      cleanup();
      globalThis.fetch = originalFetch;
      dom.window.close();
    }
  },
);
