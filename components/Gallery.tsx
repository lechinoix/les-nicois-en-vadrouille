'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Picture } from '@/lib/model';
import Photo from './Photo';
export default function Gallery({ pictures }: { pictures: Picture[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (index !== null) dialog.current?.showModal();
  }, [index]);
  const close = () => {
    dialog.current?.close();
    setIndex(null);
  };
  const move = (n: number) =>
    setIndex((i) => ((i ?? 0) + n + pictures.length) % pictures.length);
  return (
    <>
      <div className="gallery">
        {pictures.map((p, i) => (
          <button
            key={p.id}
            aria-label={`Ouvrir la photo ${i + 1}`}
            onClick={() => setIndex(i)}
          >
            <Photo url={p.url} alt={`Photo ${i + 1}`} thumbnail />
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        aria-label="Galerie photos"
        onCancel={close}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') move(-1);
          if (e.key === 'ArrowRight') move(1);
        }}
      >
        <div className="gallery-toolbar">
          <Button
            variant="ghost"
            size="icon"
            className="gallery-control"
            aria-label="Fermer la galerie"
            title="Fermer la galerie"
            onClick={close}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        {index !== null && pictures[index] && (
          <>
            <Photo url={pictures[index].url} alt={`Photo ${index + 1}`} eager />
            <div className="gallery-navigation">
              <Button
                variant="ghost"
                size="icon"
                className="gallery-control"
                aria-label="Photo précédente"
                title="Photo précédente"
                onClick={() => move(-1)}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <span role="status" aria-atomic="true">
                {index + 1} / {pictures.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="gallery-control"
                aria-label="Photo suivante"
                title="Photo suivante"
                onClick={() => move(1)}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
