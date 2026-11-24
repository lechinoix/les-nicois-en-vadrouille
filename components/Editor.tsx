'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Article, Draft, Picture } from '@/lib/model';
import { SaveQueue } from '@/lib/save-queue';
import ArticleView from './ArticleView';
import PhotoImport from './PhotoImport';
import sports from '@/lib/sports.json';
const MilkdownEditor = dynamic(() => import('./MilkdownEditor'), {
  ssr: false,
});
export default function Editor({ initial }: { initial: Draft }) {
  const [draft, setDraft] = useState(initial),
    [message, setMessage] = useState(''),
    [conflict, setConflict] = useState<Draft | null>(null),
    [preview, setPreview] = useState(false),
    [source, setSource] = useState(false),
    [epoch, setEpoch] = useState(0);
  const queue = useRef<SaveQueue | null>(null);
  if (!queue.current)
    queue.current = new SaveQueue(
      initial,
      async (data, expectedRevision, publish) => {
        setMessage('Enregistrement…');
        const r = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, expectedRevision, publish }),
        });
        const result = await r.json();
        if (!r.ok) {
          if (r.status === 409) {
            queue.current!.blocked = true;
            setConflict(result.current);
          } else if (r.status < 500) {
            queue.current!.blocked = true;
          }
          throw new Error(result.error);
        }
        setMessage(publish ? 'Publié' : 'Brouillon enregistré');
        return result;
      },
      (d) => {
        setDraft(d);
        if (queue.current?.dirty) setMessage('Modifications non enregistrées…');
      },
    );
  useEffect(() => {
    const timer = setInterval(() => {
      const q = queue.current!;
      if (!q.dirty || q.blocked) return;
      if (!navigator.onLine) {
        setMessage(
          'Hors ligne : gardez cette page ouverte jusqu’à l’enregistrement.',
        );
        return;
      }
      q.save().catch((e) => {
        setMessage(e.message);
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      if (queue.current?.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', listener);
    return () => window.removeEventListener('beforeunload', listener);
  }, []);
  const edit = (patch: Partial<Article>) =>
    queue.current!.edit({ ...queue.current!.current.data, ...patch });
  const save = (publish = false) => {
    if (!conflict) queue.current!.blocked = false;
    queue.current!.save(publish).catch((e) => setMessage(e.message));
  };
  const a = draft.data;
  const addPhotos = (pictures: Picture[]) => {
    const existing = queue.current!.current.data.pictures;
    edit({
      pictures: [
        ...existing,
        ...pictures.filter(
          (p) => !existing.some((x) => String(x.id) === String(p.id)),
        ),
      ],
    });
  };
  return (
    <main className="below-header editor">
      <a href="/editor">Tous les brouillons</a>
      <h1>{a.title || 'Nouvelle aventure'}</h1>
      <p role="status" className="notice">
        {message || `Révision ${draft.revision} · Brouillon privé`}
      </p>
      {conflict && (
        <div className="notice error">
          <h2>Conflit : votre travail reste dans cette page</h2>
          <details>
            <summary>
              Voir le texte du serveur (révision {conflict.revision})
            </summary>
            <pre>{JSON.stringify(conflict.data, null, 2)}</pre>
          </details>
          <button
            onClick={() => {
              queue.current!.current = {
                ...queue.current!.current,
                revision: conflict.revision,
              };
              // Keep autosave paused until the explicit save after comparison.
              queue.current!.blocked = true;
              queue.current!.dirty = true;
              setDraft(queue.current!.current);
              setConflict(null);
              setMessage('Vérifiez votre fusion, puis enregistrez.');
            }}
          >
            Garder mon travail sur cette révision (après comparaison)
          </button>
          <button
            onClick={() => {
              if (
                !window.confirm(
                  'Remplacer votre travail non enregistré par la version serveur ?',
                )
              )
                return;
              queue.current!.current = conflict;
              queue.current!.dirty = false;
              queue.current!.blocked = false;
              setDraft(conflict);
              setConflict(null);
              setEpoch((x) => x + 1);
            }}
          >
            Remplacer mon travail par la version serveur
          </button>
        </div>
      )}
      <fieldset style={{ border: 0, padding: 0 }}>
        <div className="actions">
          <button onClick={() => save()}>Enregistrer</button>
          <button onClick={() => save(true)} disabled={!!conflict}>
            Publier
          </button>
          <button onClick={() => setPreview(!preview)}>
            {preview ? 'Modifier' : 'Aperçu'}
          </button>
        </div>
        {preview ? (
          <ArticleView article={a} />
        ) : (
          <>
            <div className="editor-fields">
              <label>
                Titre
                <input
                  value={a.title}
                  onChange={(e) => edit({ title: e.target.value })}
                />
              </label>
              <label>
                Date
                <input
                  value={a.date}
                  onChange={(e) => edit({ date: e.target.value })}
                  placeholder="2026-11-23"
                />
              </label>
              {(['cotation', 'orientation'] as const).map((k) => (
                <label key={k}>
                  {k}
                  <input
                    value={a[k] || ''}
                    onChange={(e) => edit({ [k]: e.target.value || null })}
                  />
                </label>
              ))}
              <label>
                Dénivelé (m)
                <input
                  type="number"
                  value={a.elevation ?? ''}
                  onChange={(e) =>
                    edit({
                      elevation:
                        e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                />
              </label>
              {(['participants', 'places', 'periods'] as const).map((k) => (
                <label key={k}>
                  {k} (séparés par des virgules)
                  <input
                    value={a[k].join(',')}
                    onChange={(e) =>
                      edit({
                        [k]: e.target.value ? e.target.value.split(',') : [],
                      })
                    }
                  />
                </label>
              ))}
              <label>
                Sports
                <select
                  multiple
                  value={a.sports}
                  onChange={(e) =>
                    edit({
                      sports: Array.from(
                        e.target.selectedOptions,
                        (o) => o.value,
                      ),
                    })
                  }
                >
                  {sports.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Topos (un lien par ligne)
                <textarea
                  value={a.topos.join('\n')}
                  onChange={(e) =>
                    edit({ topos: e.target.value.split('\n').filter(Boolean) })
                  }
                />
              </label>
            </div>
            <h2>Récit</h2>
            <button
              onClick={() => {
                setSource(!source);
                setEpoch((x) => x + 1);
              }}
            >
              {source ? 'Éditeur visuel' : 'Markdown source'}
            </button>
            {source ? (
              <textarea
                aria-label="Markdown"
                value={a.content}
                onChange={(e) => edit({ content: e.target.value })}
              />
            ) : (
              <MilkdownEditor
                key={epoch}
                value={a.content}
                onChange={(content) => edit({ content })}
              />
            )}
            <h2>Photos</h2>
            <PhotoImport onPhotos={addPhotos} />
            <label>
              Position de couverture
              <select
                value={a.cover?.position || 'CENTER'}
                onChange={(e) =>
                  a.cover &&
                  edit({ cover: { ...a.cover, position: e.target.value } })
                }
              >
                {[
                  'CENTER',
                  'TOP',
                  'BOTTOM',
                  'LEFT',
                  'RIGHT',
                  'TOP_LEFT',
                  'TOP_RIGHT',
                  'BOTTOM_LEFT',
                  'BOTTOM_RIGHT',
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <div className="photo-editor">
              {a.pictures.map((p, i) => (
                <figure key={p.id}>
                  <img src={p.formats.small.url} alt={`Photo ${i + 1}`} />
                  <figcaption>
                    <button
                      onClick={() => {
                        edit({
                          content: `${queue.current!.current.data.content}\n\n![](${p.url})\n`,
                        });
                        setEpoch((x) => x + 1);
                      }}
                    >
                      Insérer dans le récit
                    </button>
                    <button
                      onClick={() =>
                        edit({
                          cover: {
                            ...p,
                            position: a.cover?.position || 'CENTER',
                          },
                        })
                      }
                    >
                      Couverture
                    </button>
                    <button
                      disabled={!i}
                      onClick={() => {
                        const pictures = [...a.pictures];
                        [pictures[i - 1], pictures[i]] = [
                          pictures[i],
                          pictures[i - 1],
                        ];
                        edit({ pictures });
                      }}
                    >
                      Avant
                    </button>
                    <button
                      onClick={() =>
                        edit({
                          pictures: a.pictures.filter((x) => x.id !== p.id),
                          cover: a.cover?.id === p.id ? null : a.cover,
                        })
                      }
                    >
                      Retirer
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
      </fieldset>
    </main>
  );
}
