'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  optionKinds,
  optionLabels,
  type EditorOption,
  type OptionKind,
} from '@/lib/editor-option-model';

function OptionRow({
  option,
  busy,
  save,
}: {
  option: EditorOption;
  busy: boolean;
  save: (data: object) => Promise<boolean>;
}) {
  const [label, setLabel] = useState(option.label);
  const update = (archived: boolean) =>
    save({ id: option.id, expectedRevision: option.revision, label, archived });
  return (
    <li className="rounded-lg border border-border p-3">
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void update(option.archived);
        }}
      >
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor={option.id}>
            {option.label}
            {option.archived ? ' · Archivé' : ''}
          </Label>
          <Input
            id={option.id}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            required
            maxLength={200}
            disabled={busy}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          disabled={busy || !label.trim() || label === option.label}
        >
          Enregistrer
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy || !label.trim()}
          onClick={() => void update(!option.archived)}
        >
          {option.archived ? 'Réactiver' : 'Archiver'}
        </Button>
      </form>
    </li>
  );
}

function AddOption({
  kind,
  busy,
  save,
}: {
  kind: OptionKind;
  busy: boolean;
  save: (data: object) => Promise<boolean>;
}) {
  const [label, setLabel] = useState('');
  return (
    <form
      className="my-4 flex items-end gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        if (await save({ kind, label })) setLabel('');
      }}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <Label htmlFor={`new-${kind}`}>
          Nouveau choix · {optionLabels[kind]}
        </Label>
        <Input
          id={`new-${kind}`}
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          required
          maxLength={200}
          disabled={busy}
        />
      </div>
      <Button type="submit" disabled={busy || !label.trim()}>
        Ajouter
      </Button>
    </form>
  );
}

export default function OptionManager({
  initial,
}: {
  initial: EditorOption[];
}) {
  const [options, setOptions] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  async function request(method: 'GET' | 'POST' | 'PATCH', data?: object) {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/editor-options', {
        method,
        cache: 'no-store',
        ...(data
          ? {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            }
          : {}),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setOptions((current) =>
        method === 'GET'
          ? result
          : [...current.filter((option) => option.id !== result.id), result],
      );
      setError(false);
      setMessage(method === 'GET' ? 'Liste actualisée.' : 'Choix enregistré.');
      return true;
    } catch (failure) {
      setError(true);
      setMessage(
        failure instanceof Error
          ? failure.message
          : 'Enregistrement impossible. Réessayez.',
      );
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="below-header editor">
      <a href="/editor">Tous les brouillons</a>
      <h1>Gérer les choix</h1>
      <p>Participants, lieux, périodes et sports proposés dans les articles.</p>
      <p>
        Renommer ou archiver un choix ne modifie pas les articles existants.
        Leurs anciennes sélections restent conservées. Le nom d’un sport est
        actualisé partout, sans modifier son adresse ni ses articles. Réactivez
        un choix archivé pour le proposer à nouveau.
      </p>
      <Button
        variant="outline"
        disabled={busy}
        onClick={() => void request('GET')}
      >
        Actualiser la liste
      </Button>
      {message && (
        <Alert
          role={error ? 'alert' : 'status'}
          variant={error ? 'destructive' : 'default'}
          className="my-4"
        >
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {optionKinds.map((kind) => (
        <section
          key={kind}
          aria-labelledby={`heading-${kind}`}
          className="my-8"
        >
          <h2 id={`heading-${kind}`}>{optionLabels[kind]}</h2>
          <AddOption
            kind={kind}
            busy={busy}
            save={(data) => request('POST', data)}
          />
          <ul className="list-none space-y-3 p-0">
            {options
              .filter((option) => option.kind === kind)
              .sort(
                (a, b) =>
                  Number(a.archived) - Number(b.archived) ||
                  a.label.localeCompare(b.label, 'fr'),
              )
              .map((option) => (
                <OptionRow
                  key={`${option.id}-${option.revision}`}
                  option={option}
                  busy={busy}
                  save={(data) => request('PATCH', data)}
                />
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
