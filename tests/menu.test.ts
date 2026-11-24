import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

test('navigation closes on outside click, Escape and link selection', async () => {
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
    'getComputedStyle',
  ] as const) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value: name === 'window' ? win : win[name],
    });
  }
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
    configurable: true,
    value: true,
    writable: true,
  });
  const React = await import('react');
  const { render, screen, waitFor, cleanup } =
    await import('@testing-library/react');
  const { default: userEvent } = await import('@testing-library/user-event');
  const { default: NavigationMenu } =
    await import('../components/NavigationMenu');
  const user = userEvent.setup({ document: win.document });
  try {
    render(
      React.createElement(
        'div',
        null,
        React.createElement(NavigationMenu, { sports: [] }),
        React.createElement('button', null, 'Outside'),
      ),
    );
    const trigger = screen.getByRole('button', { name: 'Menu principal' });
    await user.click(trigger);
    assert.ok(await screen.findByRole('menu'));
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    await waitFor(() => assert.equal(screen.queryByRole('menu'), null));
    await user.click(trigger);
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() => assert.equal(screen.queryByRole('menu'), null));
    assert.equal(win.document.activeElement, trigger);
    await user.click(trigger);
    const item = await screen.findByRole('menuitem', {
      name: 'Toutes nos sorties',
    });
    assert.equal(item.getAttribute('href'), '/adventures');
    // Suppress jsdom navigation while retaining the actual menu click handling.
    win.document.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    });
    await user.click(item);
    await waitFor(() => assert.equal(screen.queryByRole('menu'), null));
  } finally {
    cleanup();
    win.close();
  }
});
