'use client';
import { Button } from '@/components/ui/button';
import { ImagePlus, Image, ArrowLeft, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Article, Draft, Picture } from '@/lib/model';
import { SaveQueue } from '@/lib/save-queue';
import { dateInputValue } from '@/lib/date';
import ArticleView from './ArticleView';
import PhotoImport from './PhotoImport';
import Photo from './Photo';
import PhotoLegend from './PhotoLegend';
import ReferenceSelect from './ReferenceSelect';
import { optionKinds, type EditorOption } from '@/lib/editor-option-model';
import sports from '@/lib/sports';
const coverPositions: Record<string, string> = {
  CENTER: 'Centre',
  TOP: 'Haut',
  BOTTOM: 'Bas',
  LEFT: 'Gauche',
  RIGHT: 'Droite',
  TOP_LEFT: 'En haut à gauche',
  TOP_RIGHT: 'En haut à droite',
  BOTTOM_LEFT: 'En bas à gauche',
  BOTTOM_RIGHT: 'En bas à droite',
};
const MilkdownEditor = dynamic(() => import('./MilkdownEditor'), {
  ssr: false,
});
export default function Editor({
  initial,
  initialOptions,
}: {
  initial: Draft;
  initialOptions: EditorOption[];
}) {
  const [options, setOptions] = useState(initialOptions);
  const [optionsError, setOptionsError] = useState('');
  useEffect(() => {
    let controller: AbortController | undefined;
    const refresh = async () => {
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      try {
        const response = await fetch('/api/editor-options', {
          cache: 'no-store',
          signal,
        });
        if (!response.ok)
          throw new Error(
            'Impossible d’actualiser les choix. Revenez dans cet onglet pour réessayer.',
          );
        const data = await response.json();
        if (!signal.aborted) {
          setOptions(data);
          setOptionsError('');
        }
      } catch (error) {
        if (!signal.aborted)
          setOptionsError(
            error instanceof Error ? error.message : 'Choix indisponibles.',
          );
      }
    };
    window.addEventListener('focus', refresh);
    return () => {
      controller?.abort();
      window.removeEventListener('focus', refresh);
    };
  }, []);
  const [draft, setDraft] = useState(initial),
    [message, setMessage] = useState(''),
    [conflict, setConflict] = useState<Draft | null>(null),
    [replaceOpen, setReplaceOpen] = useState(false),
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
      <Alert role="status" className="my-4">
        <AlertDescription>
          {message || `Révision ${draft.revision} · Brouillon privé`}
        </AlertDescription>
      </Alert>
      {conflict && (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Conflit : votre travail reste dans cette page</AlertTitle>
          <AlertDescription>
            <details>
              <summary>
                Voir le texte du serveur (révision {conflict.revision})
              </summary>
              <pre>{JSON.stringify(conflict.data, null, 2)}</pre>
            </details>
            <div className="conflict-actions">
              <Button
                variant="outline"
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
              </Button>
              <AlertDialog open={replaceOpen} onOpenChange={setReplaceOpen}>
                <AlertDialogTrigger render={<Button variant="outline" />}>
                  Remplacer mon travail par la version serveur
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Remplacer votre travail ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Les modifications non enregistrées de cette page seront
                      remplacées par la révision {conflict.revision} du serveur.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => {
                        queue.current!.current = conflict;
                        queue.current!.dirty = false;
                        queue.current!.blocked = false;
                        setDraft(conflict);
                        setReplaceOpen(false);
                        setConflict(null);
                        setMessage('Version serveur chargée.');
                        setEpoch((x) => x + 1);
                      }}
                    >
                      Remplacer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <fieldset style={{ border: 0, padding: 0 }}>
        <div className="actions">
          <Button variant="outline" onClick={() => save()}>
            Enregistrer
          </Button>
          <Button onClick={() => save(true)} disabled={!!conflict}>
            Publier
          </Button>
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            {preview ? 'Modifier' : 'Aperçu'}
          </Button>
        </div>
        {preview ? (
          <ArticleView article={a} />
        ) : (
          <>
            <p>
              <a
                href="/editor/options"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gérer les choix : participants, lieux et périodes (nouvel
                onglet)
              </a>
            </p>
            {optionsError && (
              <Alert variant="destructive">
                <AlertDescription>{optionsError}</AlertDescription>
              </Alert>
            )}
            <div className="editor-fields">
              <div>
                <Label htmlFor="article-title">Titre</Label>
                <Input
                  id="article-title"
                  value={a.title}
                  onChange={(e) => edit({ title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="article-date">Date</Label>
                <Input
                  id="article-date"
                  type="date"
                  value={dateInputValue(a.date)}
                  onChange={(e) => edit({ date: e.target.value })}
                />
              </div>
              {(['cotation', 'orientation'] as const).map((k) => (
                <div key={k}>
                  <Label htmlFor={`article-${k}`}>
                    {k === 'cotation' ? 'Cotation' : 'Orientation'}
                  </Label>
                  <Input
                    id={`article-${k}`}
                    value={a[k] || ''}
                    onChange={(e) => edit({ [k]: e.target.value || null })}
                  />
                </div>
              ))}
              <div>
                <Label htmlFor="article-elevation">Dénivelé (m)</Label>
                <Input
                  id="article-elevation"
                  type="number"
                  value={a.elevation ?? ''}
                  onChange={(e) =>
                    edit({
                      elevation:
                        e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                />
              </div>
              {optionKinds.map((kind) => (
                <ReferenceSelect
                  key={kind}
                  kind={kind}
                  options={options}
                  value={a[kind]}
                  onChange={(values) => edit({ [kind]: values })}
                />
              ))}
              <fieldset>
                <legend>Sports</legend>
                <div className="grid grid-cols-2 gap-3">
                  {sports.map((sport) => (
                    <Label
                      key={sport.slug}
                      htmlFor={`sport-${sport.slug}`}
                      className="min-h-8"
                    >
                      <Checkbox
                        id={`sport-${sport.slug}`}
                        checked={a.sports.includes(sport.slug)}
                        onCheckedChange={(checked) =>
                          edit({
                            sports: checked
                              ? [...a.sports, sport.slug]
                              : a.sports.filter((s) => s !== sport.slug),
                          })
                        }
                      />
                      {sport.name}
                    </Label>
                  ))}
                </div>
              </fieldset>
              <div>
                <Label htmlFor="article-topos">Topos (un lien par ligne)</Label>
                <Textarea
                  id="article-topos"
                  value={a.topos.join('\n')}
                  onChange={(e) =>
                    edit({ topos: e.target.value.split('\n').filter(Boolean) })
                  }
                />
              </div>
            </div>
            <h2>Récit</h2>
            <Button
              variant="outline"
              className="mb-3"
              onClick={() => {
                setSource(!source);
                setEpoch((x) => x + 1);
              }}
            >
              {source ? 'Éditeur visuel' : 'Markdown source'}
            </Button>
            {source ? (
              <Textarea
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
            <div className="my-4 flex flex-col gap-2">
              <Label htmlFor="cover-position">Position de couverture</Label>
              <Select
                value={a.cover?.position || 'CENTER'}
                disabled={!a.cover}
                onValueChange={(position) =>
                  a.cover &&
                  position &&
                  edit({ cover: { ...a.cover, position } })
                }
              >
                <SelectTrigger id="cover-position">
                  <SelectValue>
                    {(position) => coverPositions[position] || position}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(coverPositions).map(([position, label]) => (
                    <SelectItem key={position} value={position}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <PhotoLegend />
            <div className="photo-editor">
              {a.pictures.map((p, i) => (
                <figure key={p.id}>
                  <Photo url={p.url} alt={`Photo ${i + 1}`} thumbnail />
                  <figcaption>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="photo-action"
                      title="Insérer dans le récit"
                      aria-label="Insérer dans le récit"
                      onClick={() => {
                        edit({
                          content: `${queue.current!.current.data.content}\n\n![](${p.url})\n`,
                        });
                        setEpoch((x) => x + 1);
                      }}
                    >
                      <ImagePlus size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="photo-action"
                      title="Couverture"
                      aria-label="Couverture"
                      aria-pressed={a.cover?.id === p.id}
                      onClick={() =>
                        edit({
                          cover: {
                            ...p,
                            position: a.cover?.position || 'CENTER',
                          },
                        })
                      }
                    >
                      <Image size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="photo-action"
                      title="Déplacer vers le début de la galerie"
                      aria-label="Déplacer vers le début de la galerie"
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
                      <ArrowLeft size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="photo-action"
                      title="Retirer de la galerie"
                      aria-label="Retirer de la galerie"
                      onClick={() =>
                        edit({
                          pictures: a.pictures.filter((x) => x.id !== p.id),
                          cover: a.cover?.id === p.id ? null : a.cover,
                        })
                      }
                    >
                      <Trash2 size={20} />
                    </Button>
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
