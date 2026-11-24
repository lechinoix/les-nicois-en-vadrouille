import type { Article } from '@/lib/model';
import sports from '@/lib/sports.json';
import Photo from './Photo';
import Markdown from './Markdown';
import Gallery from './Gallery';
export default function ArticleView({ article: a }: { article: Article }) {
  return (
    <article>
      <div className="hero">
        {a.cover && (
          <Photo
            url={a.cover.url}
            position={a.cover.position}
            alt={a.title}
            eager
          />
        )}
        <h1>{a.title}</h1>
      </div>
      <main>
        <div className="facts">
          {[
            a.places.join(', '),
            a.sports
              .map((s) => sports.find((x) => x.slug === s)?.name || s)
              .join(', '),
            a.cotation,
            a.orientation,
            a.elevation !== null ? `${a.elevation} m` : null,
          ]
            .filter(Boolean)
            .map((s, i) => (
              <span key={i}>{s}</span>
            ))}
        </div>
        {a.date && (
          <p>
            <i>
              {new Date(a.date).toLocaleDateString('fr-FR', {
                timeZone: 'UTC',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </i>
          </p>
        )}
        <Markdown>{a.content}</Markdown>
        {a.topos.length > 0 && (
          <p>
            Topo :{' '}
            {a.topos.map((t) => (
              <a
                className="topo"
                key={t}
                href={t}
                target="_blank"
                rel="noreferrer"
              >
                {new URL(t).hostname}
              </a>
            ))}
          </p>
        )}
        <Gallery pictures={a.pictures} />
      </main>
    </article>
  );
}
