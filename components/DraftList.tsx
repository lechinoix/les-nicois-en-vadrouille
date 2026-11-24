'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Draft } from '@/lib/model';
export default function DraftList({ drafts }: { drafts: Draft[] }) {
  return (
    <main className="below-header">
      <h1>Nos brouillons</h1>
      <div className="actions">
        <Button
          onClick={() => (location.href = `/editor/${crypto.randomUUID()}`)}
        >
          Nouvelle aventure
        </Button>
        <Button
          onClick={async () => {
            await fetch('/api/auth', { method: 'DELETE' });
            location.href = '/login';
          }}
        >
          Déconnexion
        </Button>
      </div>
      {drafts.map((d) => (
        <p key={d.id}>
          <Link href={`/editor/${d.id}`}>{d.data.title || 'Sans titre'}</Link> ·
          révision {d.revision}
        </p>
      ))}
    </main>
  );
}
