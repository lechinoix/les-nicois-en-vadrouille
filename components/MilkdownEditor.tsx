'use client';
import { useRef } from 'react';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/kit/preset/gfm';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { history } from '@milkdown/kit/plugin/history';
function Inner({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  const callback = useRef(onChange);
  callback.current = onChange;
  useEditor(
    (root) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, value);
          ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, previous) => {
            if (markdown !== previous) callback.current(markdown);
          });
        })
        .use(commonmark)
        .use(gfm)
        .use(listener)
        .use(history),
    [],
  );
  return <Milkdown />;
}
export default function MilkdownEditor(props: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <MilkdownProvider>
      <Inner {...props} />
    </MilkdownProvider>
  );
}
