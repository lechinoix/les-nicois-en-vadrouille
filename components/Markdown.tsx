import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeLineBreaks from '@/lib/rehype-line-breaks';
import Photo from './Photo';
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeLineBreaks]}
        components={{
          img: ({ src, alt, title }) =>
            typeof src === 'string' ? (
              <span className="article-image">
                <Photo url={src} alt={alt || ''} />
                {title && <span className="article-caption">{title}</span>}
              </span>
            ) : null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
