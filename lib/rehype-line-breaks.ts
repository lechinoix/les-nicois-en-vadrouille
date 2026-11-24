import type { Element, Root, RootContent } from 'hast';

// Only recognize bare line-break tags. Other HTML remains escaped by
// react-markdown, and code/escaped examples are text nodes, never raw nodes.
export default function rehypeLineBreaks() {
  return function transform(tree: Root | RootContent) {
    if (!('children' in tree)) return;
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'raw' && /^(?:\s*<br\s*\/?>\s*)+$/i.test(node.value)) {
        const breaks: Element[] = Array.from(
          node.value.matchAll(/<br\s*\/?>/gi),
          () => ({
            type: 'element',
            tagName: 'br',
            properties: {},
            children: [],
          }),
        );
        tree.children.splice(i, 1, ...breaks);
        i += breaks.length - 1;
      } else {
        transform(node);
      }
    }
  };
}
