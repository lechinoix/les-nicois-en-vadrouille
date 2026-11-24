'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Link2,
  Images,
  Download,
  Unplug,
  Upload,
  ExternalLink,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { Picture } from '@/lib/model';
async function api(action: string, pageToken?: string) {
  const r = await fetch('/api/photos/picker', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, pageToken }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error);
  return data;
}
export default function PhotoImport({
  onPhotos,
}: {
  onPhotos: (p: Picture[]) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const progress = useRef({ id: '', cursor: '' });
  const [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [pickerUrl, setPickerUrl] = useState('');
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setMessage(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <div className="actions">
        <Button
          variant="ghost"
          className="photo-action"
          disabled={busy}
          onClick={() =>
            run(async () => {
              const popup = window.open('about:blank', 'google-authorization');
              const r = await fetch('/api/photos/google/start', {
                method: 'POST',
              });
              const data = await r.json();
              if (!r.ok) {
                popup?.close();
                throw new Error(data.error);
              }
              if (popup) popup.location.href = data.url;
              else
                setMessage(
                  'Autorisez les fenêtres contextuelles puis réessayez.',
                );
            })
          }
        >
          <Link2 size={20} /> Connecter Google Photos
        </Button>
        <Button
          variant="ghost"
          className="photo-action"
          disabled={busy}
          onClick={() =>
            run(async () => {
              const data = await api('create');
              progress.current = { id: '', cursor: '' };
              setPickerUrl(data.pickerUri);
              setMessage(
                'Ouvrez Google Photos, terminez la sélection, puis importez.',
              );
            })
          }
        >
          <Images size={20} /> Nouvelle sélection
        </Button>
        {pickerUrl && (
          <a
            className="photo-action picker-link"
            href={pickerUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={18} aria-hidden="true" /> Choisir dans Google
            Photos
          </a>
        )}
        <Button
          variant="ghost"
          className="photo-action"
          disabled={busy}
          onClick={() =>
            run(async () => {
              const status = await api('status');
              if (!status.mediaItemsSet) {
                setMessage(
                  'Terminez la sélection dans Google Photos puis réessayez.',
                );
                return;
              }
              let cursor =
                progress.current.id === status.id
                  ? progress.current.cursor
                  : '';
              let skipped = 0;
              do {
                const data = await api('import', cursor);
                onPhotos(data.pictures);
                skipped += data.skipped.length;
                cursor = data.nextPageToken || '';
                progress.current = { id: status.id, cursor };
                setMessage('Photos importées ; progression enregistrée.');
              } while (cursor);
              setMessage(`Import terminé. ${skipped} vidéo(s) ignorée(s).`);
            })
          }
        >
          <Download size={20} /> Importer / reprendre
        </Button>
        <Button
          variant="ghost"
          className="photo-action"
          disabled={busy}
          onClick={() =>
            run(async () => {
              const response = await fetch('/api/photos/picker', {
                method: 'DELETE',
              });
              if (!response.ok) throw new Error((await response.json()).error);
              progress.current = { id: '', cursor: '' };
              setPickerUrl('');
              setMessage(
                'Connexion Google fermée. Les photos importées sont conservées.',
              );
            })
          }
        >
          <Unplug size={20} /> Terminer / annuler Google
        </Button>
      </div>
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="photo-action"
          disabled={busy}
          onClick={() => fileInput.current?.click()}
        >
          <Upload size={20} /> Importer depuis cet appareil
        </Button>
        <p className="text-sm text-muted-foreground">
          JPEG, PNG, WebP ou AVIF · 4 Mo maximum par photo
        </p>
        <Input
          id="photo-files"
          ref={fileInput}
          aria-label="Importer des photos locales"
          className="sr-only"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={busy}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            e.target.value = '';
            run(async () => {
              for (const file of files) {
                const form = new FormData();
                form.set('file', file);
                const r = await fetch('/api/photos/upload', {
                  method: 'POST',
                  body: form,
                });
                const data = await r.json();
                if (!r.ok) throw new Error(data.error);
                onPhotos([data]);
              }
              setMessage('Photos importées.');
            });
          }}
        />
      </div>
      <p role="status">{message}</p>
    </div>
  );
}
