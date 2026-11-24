'use client';
import { useState } from 'react';
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
        <button
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
          Connecter Google Photos
        </button>
        <button
          disabled={busy}
          onClick={() =>
            run(async () => {
              const data = await api('create');
              localStorage.removeItem('picker-cursor');
              setPickerUrl(data.pickerUri);
              setMessage(
                'Ouvrez Google Photos, terminez la sélection, puis importez.',
              );
            })
          }
        >
          Nouvelle sélection
        </button>
        {pickerUrl && (
          <a href={pickerUrl} target="_blank" rel="noreferrer">
            Choisir dans Google Photos
          </a>
        )}
        <button
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
                localStorage.getItem(`picker-cursor-${status.id}`) || '';
              let skipped = 0;
              do {
                const data = await api('import', cursor);
                onPhotos(data.pictures);
                skipped += data.skipped.length;
                cursor = data.nextPageToken || '';
                localStorage.setItem(`picker-cursor-${status.id}`, cursor);
                setMessage('Photos importées ; progression enregistrée.');
              } while (cursor);
              setMessage(`Import terminé. ${skipped} vidéo(s) ignorée(s).`);
            })
          }
        >
          Importer / reprendre
        </button>
        <button
          disabled={busy}
          onClick={() =>
            run(async () => {
              await fetch('/api/photos/picker', { method: 'DELETE' });
              localStorage.removeItem('picker-cursor');
              setPickerUrl('');
              setMessage(
                'Connexion Google fermée. Les photos importées sont conservées.',
              );
            })
          }
        >
          Terminer / annuler Google
        </button>
      </div>
      <label>
        Ou importer des photos locales (4 Mo maximum par photo)
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={busy}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
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
      </label>
      <p role="status">{message}</p>
    </div>
  );
}
