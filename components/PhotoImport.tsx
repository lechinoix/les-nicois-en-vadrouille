'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Images,
  Upload,
  ImagePlus,
  LoaderCircle,
  ExternalLink,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Picture } from '@/lib/model';
import type { PhotoImportProgress } from '@/lib/photo-import-model';
import Photo from './Photo';

async function request<T>(url: string, data?: object): Promise<T> {
  const response = await fetch(
    url,
    data
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      : { cache: 'no-store' },
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || 'Import impossible. Réessayez.');
  return result;
}
export default function PhotoImport({
  articleId,
  beforeImport,
  onPhotos,
}: {
  articleId: string;
  beforeImport: () => Promise<void>;
  onPhotos: (photos: Picture[]) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [job, setJob] = useState<PhotoImportProgress | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [launchUrl, setLaunchUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const popup = useRef<Window | null>(null);
  const callbacks = useRef({ beforeImport, onPhotos });
  callbacks.current = { beforeImport, onPhotos };
  const working = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    let cancelled = false;
    request<PhotoImportProgress | null>(
      `/api/photos/picker?articleId=${encodeURIComponent(articleId)}`,
    )
      .then((pending) => {
        if (cancelled || working.current || !pending) return;
        setJob(pending);
        setOpen(true);
        if (pending.error) setError(pending.error);
        else setRunning(true);
      })
      .catch(() => {
        /* Starting an import will surface any connection failure. */
      });
    return () => {
      cancelled = true;
      alive.current = false;
    };
  }, [articleId]);

  // A single request at a time, respecting Google's polling interval. Drawer
  // visibility is independent: imports continue while the editor stays mounted.
  useEffect(() => {
    if (!running || !job || busy) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const advance = async () => {
      if (cancelled) return;
      if (working.current) {
        timer = setTimeout(advance, 250);
        return;
      }
      working.current = true;
      try {
        let current = await request<PhotoImportProgress>('/api/photos/picker', {
          action: 'advance',
          id: job.id,
        });
        if (cancelled) return;
        setJob(current);
        if (current.error) throw new Error(current.error);
        if (current.pictures.length) {
          setMessage(
            `${current.pictures.length} photo(s) importée(s). Enregistrement du brouillon…`,
          );
          await callbacks.current.onPhotos(current.pictures);
        }
        if (cancelled) return;
        if (current.status === 'ready') {
          current = await request<PhotoImportProgress>('/api/photos/picker', {
            action: 'complete',
            id: current.id,
          });
        }
        if (cancelled) return;
        if (current.status === 'complete') {
          setMessage(
            `${current.pictures.length} photo(s) ajoutée(s) au brouillon.${current.skipped ? ` ${current.skipped} vidéo(s) ignorée(s).` : ''}`,
          );
          setJob(null);
          setRunning(false);
          setOpen(false);
          popup.current?.close();
          return;
        }
        if (current.status === 'cancelled') {
          setJob(null);
          setRunning(false);
          return;
        }
        if (current.status === 'authorizing') {
          setMessage('Terminez l’autorisation dans l’onglet Google Photos.');
          if (Date.now() > current.timeoutAt)
            throw new Error(
              'Autorisation en attente. Continuez avec Google Photos pour réessayer.',
            );
        } else if (current.status === 'selecting') {
          setMessage(
            'Choisissez vos photos puis validez dans Google. L’import démarrera automatiquement.',
          );
        }
        timer = setTimeout(
          advance,
          current.status === 'importing'
            ? 100
            : Math.max(
                current.status === 'authorizing' ? 2000 : 1000,
                current.nextPollAt - Date.now(),
              ),
        );
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : 'Import interrompu. Réessayez.',
          );
          setRunning(false);
        }
      } finally {
        working.current = false;
      }
    };
    timer = setTimeout(advance, Math.max(0, job.nextPollAt - Date.now()));
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Progress updates intentionally do not restart the active polling loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, busy, job?.id]);

  async function startGoogle() {
    if (working.current) return;
    // Open during the click so browsers do not block the later OAuth redirect.
    const tab = window.open('about:blank', '_blank');
    if (tab) tab.opener = null;
    popup.current = tab;
    setBusy(true);
    setRunning(false);
    setError('');
    setLaunchUrl('');
    working.current = true;
    try {
      await callbacks.current.beforeImport();
      const result = await request<{
        job: PhotoImportProgress;
        url: string | null;
      }>('/api/photos/google/start', { articleId });
      if (!alive.current) {
        tab?.close();
        return;
      }
      setJob(result.job);
      if (result.url && tab) tab.location.href = result.url;
      else if (result.url) {
        // A normal link is the fallback when a browser blocks window.open.
        setLaunchUrl(result.url);
      } else tab?.close();
      setRunning(true);
    } catch (e) {
      tab?.close();
      setError(e instanceof Error ? e.message : 'Import impossible.');
    } finally {
      working.current = false;
      setBusy(false);
    }
  }
  async function finish() {
    if (!job || busy) return;
    setBusy(true);
    setRunning(false);
    setError('');
    try {
      while (working.current)
        await new Promise((resolve) => setTimeout(resolve, 100));
      working.current = true;
      // Synchronize the newest committed batch before cancelling (another tab
      // may have advanced it). The server also verifies the saved photo IDs.
      const latest = await request<PhotoImportProgress | null>(
        `/api/photos/picker?articleId=${encodeURIComponent(articleId)}`,
      );
      await callbacks.current.onPhotos(latest?.pictures || job.pictures);
      await request('/api/photos/picker', { id: job.id, action: 'cancel' });
      popup.current?.close();
      setJob(null);
      setLaunchUrl('');
      setMessage('Import terminé. Les photos déjà ajoutées sont conservées.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de terminer.');
    } finally {
      working.current = false;
      setBusy(false);
    }
  }
  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline" />}>
          <ImagePlus aria-hidden="true" />{' '}
          {running || busy
            ? 'Voir l’import en cours'
            : job
              ? 'Reprendre l’ajout de photos'
              : 'Ajouter des photos'}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="photo-import-drawer mx-auto max-h-[85dvh] max-w-2xl overflow-y-auto rounded-t-xl pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="pr-14">
            <SheetTitle>Ajouter des photos</SheetTitle>
            <SheetDescription>
              Depuis Google Photos ou cet appareil. Les photos sont enregistrées
              dans votre brouillon privé.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4">
            {!running && (
              <Button
                variant="ghost"
                className="photo-action"
                disabled={busy}
                onClick={startGoogle}
              >
                <Images aria-hidden="true" />{' '}
                {job ? 'Continuer avec Google Photos' : 'Google Photos'}
              </Button>
            )}
            {!job && (
              <div>
                <Button
                  variant="ghost"
                  className="photo-action"
                  disabled={busy}
                  onClick={() => fileInput.current?.click()}
                >
                  <Upload aria-hidden="true" /> Depuis cet appareil
                </Button>
                <p className="text-sm text-muted-foreground">
                  JPEG, PNG, WebP ou AVIF · 4 Mo maximum par photo
                </p>
              </div>
            )}
            {(running || busy) && (
              <p className="flex items-center gap-2">
                <LoaderCircle
                  className="size-5 shrink-0 animate-spin"
                  aria-hidden="true"
                />{' '}
                {message || 'Préparation…'}
              </p>
            )}
            {launchUrl && (
              <a
                className="picker-link"
                href={launchUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink aria-hidden="true" size={18} /> Ouvrir Google
                Photos (nouvel onglet)
              </a>
            )}
            {job?.status === 'selecting' && job.pickerUrl && (
              <div>
                <a
                  className="picker-link"
                  href={job.pickerUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink aria-hidden="true" size={18} /> Revenir à la
                  sélection Google
                </a>
                <p className="text-sm text-muted-foreground">
                  Si l’onglet Google ne se ferme pas après validation, revenez
                  ici.
                </p>
              </div>
            )}
            {error && (
              <p role="alert" className="text-destructive">
                {error}
              </p>
            )}
            {job && !running && (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setError('');
                  setRunning(true);
                }}
              >
                Réessayer l’import
              </Button>
            )}
            {!!job?.pictures.length && (
              <div
                className="grid grid-cols-3 gap-2"
                aria-label="Photos importées"
              >
                {job.pictures.map((p) => (
                  <Photo key={p.id} url={p.url} alt="" thumbnail />
                ))}
              </div>
            )}
            {job && (
              <Button variant="ghost" disabled={busy} onClick={finish}>
                Terminer cet import
              </Button>
            )}
            <p className="text-sm text-muted-foreground">
              Vous pouvez fermer ce panneau : l’import continue tant que cette
              page de l’éditeur reste ouverte. Le panneau se fermera
              automatiquement une fois les photos enregistrées.
            </p>
            <Input
              ref={fileInput}
              aria-label="Importer des photos locales"
              className="sr-only"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={busy || !!job}
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                e.target.value = '';
                if (!files.length || working.current) return;
                working.current = true;
                setBusy(true);
                setError('');
                let count = 0;
                try {
                  await callbacks.current.beforeImport();
                  for (const file of files) {
                    setMessage(
                      `Import de la photo ${count + 1} / ${files.length}…`,
                    );
                    const form = new FormData();
                    form.set('file', file);
                    const response = await fetch('/api/photos/upload', {
                      method: 'POST',
                      body: form,
                    });
                    const picture = await response.json();
                    if (!response.ok) throw new Error(picture.error);
                    await callbacks.current.onPhotos([picture]);
                    count++;
                  }
                  setMessage(`${count} photo(s) ajoutée(s) au brouillon.`);
                  setOpen(false);
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : 'Import interrompu.',
                  );
                } finally {
                  working.current = false;
                  setBusy(false);
                }
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
      <p role="status" aria-live="polite" className="flex items-center gap-2">
        {(running || busy) && (
          <LoaderCircle
            className="size-5 shrink-0 animate-spin"
            aria-hidden="true"
          />
        )}
        {error
          ? 'Import interrompu.'
          : message || (running || busy ? 'Préparation…' : '')}
      </p>
      {!open && (running || busy) && (
        <p className="text-sm text-muted-foreground">
          L’import continue en arrière-plan. Gardez cette page de l’éditeur
          ouverte.
        </p>
      )}
      {!open && error && (
        <p role="alert" className="text-destructive">
          {error} Ouvrez le panneau pour réessayer.
        </p>
      )}
    </div>
  );
}
