'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Draft } from '@/lib/model';
export function download(value: unknown, name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
export default function DraftList({ drafts }: { drafts: Draft[] }) {
  const [message, setMessage] = useState('');
  return (
    <main className="below-header">
      <h1>Nos brouillons</h1>
      <div className="actions">
        <button
          onClick={() => (location.href = `/editor/${crypto.randomUUID()}`)}
        >
          Nouvelle aventure
        </button>
        <a href="/api/export">Exporter Neon</a>
        <button
          onClick={() => {
            const values = Object.keys(localStorage)
              .filter(
                (k) => k.startsWith('draft-') || k.startsWith('recovery-'),
              )
              .map((k) => ({
                key: k,
                value: JSON.parse(localStorage.getItem(k)!),
              }));
            download(values, 'brouillons-navigateur.json');
          }}
        >
          Exporter les copies locales
        </button>
        <button
          onClick={async () => {
            await fetch('/api/auth', { method: 'DELETE' });
            location.href = '/login';
          }}
        >
          Déconnexion
        </button>
      </div>
      <label>
        Importer les brouillons d’un ancien navigateur (copies privées séparées)
        <input
          type="file"
          accept="application/json"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const r = await fetch('/api/drafts/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: await file.text(),
              });
              const result = await r.json();
              if (!r.ok) throw new Error(JSON.stringify(result));
              location.reload();
            } catch (e) {
              setMessage(String(e));
            }
          }}
        />
      </label>
      <p role="status">{message}</p>
      {drafts.map((d) => (
        <p key={d.id}>
          <Link href={`/editor/${d.id}`}>{d.data.title || 'Sans titre'}</Link> ·
          révision {d.revision}
        </p>
      ))}
    </main>
  );
}
