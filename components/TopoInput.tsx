'use client';
import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  camptocampRouteId,
  topoDetailsSchema,
  type TopoDetails,
} from '@/lib/topo';

export default function TopoInput({
  value,
  onChange,
  onDetails,
}: {
  value: string[];
  onChange: (links: string[]) => void;
  onDetails: (url: string, details: TopoDetails) => string[];
}) {
  const [text, setText] = useState(value.join('\n'));
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const linksKey = JSON.stringify(value);
  const lastValue = useRef(linksKey);
  const handled = useRef(new Set(value.map(camptocampRouteId).filter(Boolean)));
  const onDetailsRef = useRef(onDetails);
  onDetailsRef.current = onDetails;
  // Preserve trailing blank lines while typing; sync canonical/reset draft values.
  useEffect(() => {
    if (lastValue.current !== linksKey)
      setText((JSON.parse(linksKey) as string[]).join('\n'));
    lastValue.current = linksKey;
  }, [linksKey]);

  useEffect(() => {
    const routes = new Map<string, string>();
    for (const url of JSON.parse(linksKey) as string[]) {
      const id = camptocampRouteId(url);
      if (id) routes.set(id, url);
    }
    handled.current = new Set(
      [...handled.current].filter((id) => id && routes.has(id)),
    );
    const pending = [...routes].filter(([id]) => !handled.current.has(id));
    setStatus('');
    setLoading(false);
    if (!pending.length) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      const messages: string[] = [];
      for (const [id, url] of pending) {
        if (controller.signal.aborted) return;
        try {
          const response = await fetch('/api/topos/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
            signal: controller.signal,
          });
          const data = await response.json().catch(() => null);
          if (!response.ok)
            throw new Error(
              typeof data?.error === 'string'
                ? data.error
                : 'Extraction impossible. Réessayez.',
            );
          const details = topoDetailsSchema.safeParse(data);
          if (!details.success)
            throw new Error(
              'Les informations du topo sont illisibles. Réessayez.',
            );
          if (controller.signal.aborted) return;
          const filled = onDetailsRef.current(url, details.data);
          messages.push(
            filled.length
              ? `Champs complétés : ${filled.join(', ')}.`
              : 'Aucun champ vide à compléter avec les données de ce topo.',
          );
        } catch (error) {
          if (controller.signal.aborted) return;
          messages.push(
            error instanceof Error
              ? error.message
              : 'Extraction impossible. Réessayez.',
          );
        }
        handled.current.add(id);
      }
      if (!controller.signal.aborted) {
        setStatus(messages.join(' '));
        setLoading(false);
      }
    }, 600);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [linksKey, retry]);

  return (
    <div className="min-w-0">
      <Label htmlFor="article-topos">Topos (un lien par ligne)</Label>
      <Textarea
        id="article-topos"
        value={text}
        aria-describedby="topos-help"
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          const links = next
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
          lastValue.current = JSON.stringify(links);
          onChange(links);
        }}
      />
      <p id="topos-help" className="m-0 text-sm text-muted-foreground">
        Un nouveau lien Camptocamp complète automatiquement la cotation, le
        dénivelé et l’orientation vides. Vos valeurs déjà saisies sont
        conservées.
      </p>
      <Button
        type="button"
        variant="ghost"
        className="mt-2 h-auto max-w-full whitespace-normal text-left"
        disabled={loading || !value.some(camptocampRouteId)}
        onClick={() => {
          handled.current.clear();
          setRetry((count) => count + 1);
        }}
      >
        <RefreshCw
          aria-hidden="true"
          className={loading ? 'animate-spin' : ''}
        />
        Compléter les champs vides depuis Camptocamp
      </Button>
      <p role="status" className="m-0 text-sm [overflow-wrap:anywhere]">
        {loading ? 'Lecture du topo Camptocamp…' : status}
      </p>
    </div>
  );
}
