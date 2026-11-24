import type { Article } from '@/lib/model';
import sports from '@/lib/sports.json';
import Photo from './Photo';
import Markdown from './Markdown';
import Gallery from './Gallery';

const sportIcons: Record<string, string> = {
  ALPINISM: 'rockClimbing',
  SPELEO: 'rockClimbing',
  ESCALADE_COUENNE: 'rockClimbing',
  ESCALADE_GRANDE_VOIE: 'rockClimbing',
  SKI_ALPIN: 'skiBoot',
  SKI_DE_RANDO: 'skiBoot',
};

function Fact({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="article-fact" aria-label={`${label} : ${value}`}>
      <img
        src={`/icons/${icon}.svg`}
        width={56}
        height={56}
        alt=""
        aria-hidden="true"
      />
      <span>{value}</span>
    </div>
  );
}

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
          <Fact icon="mountain" label="Lieu" value={a.places.join(', ')} />
          <Fact
            icon={sportIcons[a.sports[0]] || 'hikeBoot'}
            label="Sport"
            value={a.sports
              .map((s) => sports.find((x) => x.slug === s)?.name || s)
              .join(', ')}
          />
          <Fact icon="strength" label="Cotation" value={a.cotation} />
          <Fact icon="compass" label="Orientation" value={a.orientation} />
          <Fact
            icon="mountain"
            label="Dénivelé"
            value={a.elevation !== null ? `${a.elevation} m` : null}
          />
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
