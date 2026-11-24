'use client';
import { useEffect, useRef, useState } from 'react';
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
        onCancel={close}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') move(-1);
          if (e.key === 'ArrowRight') move(1);
        }}
      >
        <button onClick={close}>Fermer</button>
        {index !== null && pictures[index] && (
          <>
            <Photo url={pictures[index].url} alt={`Photo ${index + 1}`} eager />
            <div className="actions">
              <button onClick={() => move(-1)}>Précédente</button>
              <span>
                {index + 1} / {pictures.length}
              </span>
              <button onClick={() => move(1)}>Suivante</button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
