'use client';
import { useState } from 'react';
import Link from 'next/link';
import { articleCover, articlePath, type Article } from '@/lib/model';
import type { SportChoice } from '@/lib/sports';
import Photo from './Photo';
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export default function ArticleList({
  articles,
  sports,
  initialSport = '',
  limit,
}: {
  articles: Article[];
  sports: SportChoice[];
  initialSport?: string;
  limit?: number;
}) {
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState(initialSport);
  const filtered = articles.filter(
    (a) =>
      (!sport || a.sports.includes(sport)) &&
      normalize(
        [a.title, a.content, ...a.places, ...a.participants, a.cotation].join(
          ' ',
        ),
      ).includes(normalize(query)),
  );
  return (
    <>
      <div className="filters">
        <input
          type="search"
          aria-label="Rechercher une sortie"
          placeholder="Rechercher une sortie, un lieu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Sport"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          <option value="">Tous les sports</option>
          {sports
            .filter(
              (s) =>
                !s.archived || articles.some((a) => a.sports.includes(s.slug)),
            )
            .map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
        </select>
      </div>
      <div className="grid">
        {filtered.slice(0, query || sport ? undefined : limit).map((a) => {
          const cover = articleCover(a);
          return (
            <Link className="card" key={a.id} href={articlePath(a)}>
              {cover && (
                <Photo
                  url={cover.url}
                  position={cover.position}
                  alt=""
                  thumbnail
                />
              )}
              <h2>{a.title}</h2>
            </Link>
          );
        })}
      </div>
      {!filtered.length && <p>Aucune sortie trouvée.</p>}
    </>
  );
}
