'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Article, Draft, Picture } from '@/lib/model';
import { SaveQueue } from '@/lib/save-queue';
import { download } from './DraftList';
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
    [recovery, setRecovery] = useState<Draft | null>(null),
    [ready, setReady] = useState(false),
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
          }
          throw new Error(result.error);
        }
        setMessage(publish ? 'Publié' : 'Brouillon enregistré');
        return result;
      },
      (d) => {
        setDraft(d);
        try {
          localStorage.setItem(`recovery-${d.id}`, JSON.stringify(d));
        } catch {
          setMessage('Stockage local indisponible : exportez votre travail.');
        }
      },
    );
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`recovery-${initial.id}`);
      if (raw) {
        const local = JSON.parse(raw);
        if (JSON.stringify(local.data) !== JSON.stringify(initial.data)) {
          setRecovery(local);
          return;
        }
      }
    } catch {
      setMessage('Copie locale illisible.');
    }
    setReady(true);
  }, [initial]);
  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      const q = queue.current!;
      if (q.dirty && !q.blocked && navigator.onLine)
        q.save().catch((e) => {
          setMessage(e.message);
          q.blocked = true;
        });
    }, 2000);
    return () => clearInterval(timer);
  }, [ready]);
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
      {recovery && (
        <div className="notice error">
          <p>
            Une copie locale diffère du serveur. Exportez-la ou restaurez-la ;
            une révision ancienne déclenchera un conflit.
          </p>
          <button onClick={() => download(recovery, 'recuperation.json')}>
            Exporter
          </button>
          <button
            onClick={() => {
              queue.current!.current = recovery;
              queue.current!.edit(recovery.data);
              setEpoch((x) => x + 1);
              setRecovery(null);
              setReady(true);
            }}
          >
            Restaurer la copie locale
          </button>
          <button
            onClick={() => {
              setRecovery(null);
              setReady(true);
            }}
          >
            Utiliser la version serveur
          </button>
        </div>
      )}
      {conflict && (
        <div className="notice error">
          <h2>Conflit : aucune modification locale n’a été supprimée</h2>
          <button onClick={() => download(draft, 'conflit-local.json')}>
            Exporter mon travail
          </button>
          <details>
            <summary>
              Voir le texte du serveur (révision {conflict.revision})
            </summary>
            <pre>{JSON.stringify(conflict.data, null, 2)}</pre>
          </details>
          <button
            onClick={() => {
              download(draft, 'avant-fusion.json');
              queue.current!.current = {
                ...draft,
                revision: conflict.revision,
              };
              queue.current!.blocked = false;
              queue.current!.dirty = true;
              setDraft(queue.current!.current);
              setConflict(null);
              setMessage('Vérifiez votre fusion, puis enregistrez.');
              setReady(false);
            }}
          >
            Garder mon travail sur cette révision (après comparaison)
          </button>
          <button
            onClick={() => {
              download(draft, 'avant-remplacement.json');
              queue.current!.current = conflict;
              queue.current!.dirty = false;
              queue.current!.blocked = false;
              setDraft(conflict);
              setConflict(null);
              setEpoch((x) => x + 1);
            }}
          >
            Charger le serveur et exporter mon travail
          </button>
        </div>
      )}
      <fieldset disabled={!!recovery} style={{ border: 0, padding: 0 }}>
        <div className="actions">
          <button onClick={() => save()}>Enregistrer</button>
          <button onClick={() => save(true)} disabled={!!conflict}>
            Publier
          </button>
          <button onClick={() => setPreview(!preview)}>
            {preview ? 'Modifier' : 'Aperçu'}
          </button>
          <button onClick={() => download(draft, 'brouillon.json')}>
            Exporter
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
