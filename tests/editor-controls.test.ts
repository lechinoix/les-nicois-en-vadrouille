import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { dateInputValue } from '../lib/date';
import type { EditorOption } from '../lib/editor-option-model';

test('date picker preserves the public UTC calendar date and empty values', () => {
  assert.equal(dateInputValue('2024-07-18'), '2024-07-18');
  assert.equal(dateInputValue('2024-07-18T23:00:00-02:00'), '2024-07-19');
  assert.equal(dateInputValue(''), '');
  assert.equal(dateInputValue('invalid'), '');
});

test('reference selectors support multiple choices and preserve archived/unknown selections', async () => {
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
  ] as const)
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value: name === 'window' ? win : win[name],
    });
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
    configurable: true,
    writable: true,
    value: true,
  });
  const React = await import('react');
  const { render, screen, cleanup } = await import('@testing-library/react');
  const { default: userEvent } = await import('@testing-library/user-event');
  const { default: ReferenceSelect } =
    await import('../components/ReferenceSelect');
  const options: EditorOption[] = ['Ambre', 'Nicolas', 'Archivé'].map(
    (label, i) => ({
      id: String(i),
      label,
      kind: 'participants',
      archived: i === 2,
      revision: 1,
    }),
  );
  let selected = ['Ancien', 'Archivé'];
  function Harness() {
    const [value, setValue] = React.useState(selected);
    return React.createElement(ReferenceSelect, {
      kind: 'participants',
      options,
      value,
      onChange: (values) => {
        selected = values;
        setValue(values);
      },
    });
  }
  const user = userEvent.setup({ document: win.document });
  try {
    render(React.createElement(Harness));
    await user.click(screen.getByRole('combobox', { name: 'Participants' }));
    await user.click(await screen.findByRole('option', { name: 'Ambre' }));
    await user.click(screen.getByRole('option', { name: 'Nicolas' }));
    await user.keyboard('{Escape}');
    assert.deepEqual(selected, ['Ancien', 'Archivé', 'Ambre', 'Nicolas']);
    await user.click(screen.getByRole('button', { name: 'Retirer Archivé' }));
    assert.deepEqual(selected, ['Ancien', 'Ambre', 'Nicolas']);
    await user.click(screen.getByRole('combobox', { name: 'Participants' }));
    await screen.findByRole('option', { name: 'Ancien (ancienne valeur)' });
    assert.equal(
      screen.queryByRole('option', { name: 'Archivé (archivé)' }),
      null,
    );
  } finally {
    cleanup();
    win.close();
  }
});
