import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Photo from './Photo';
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) =>
            typeof src === 'string' ? (
              <Photo url={src} alt={alt || ''} />
            ) : null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
