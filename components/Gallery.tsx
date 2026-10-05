'use client';

import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/lib/catalogue';
import { CatPhoto } from './CatPhoto';

/** Who took a photograph from Commons, and its licence. The first source names nobody. */
export function By({ photo }: { photo: Photo }) {
  if (!photo.credit) return null;
  return (
    <figcaption className="by">
      Photo:{' '}
      <a className="link" href={photo.credit.page}>
        {photo.credit.by}
      </a>
      ,{' '}
      {photo.credit.licenceUrl ? (
        <a className="link" href={photo.credit.licenceUrl}>
          {photo.credit.licence}
        </a>
      ) : (
        photo.credit.licence
      )}
    </figcaption>
  );
}

/** The rest of a breed's photographs. Each one opens large, and the arrow
    keys walk through them. */
export function Gallery({ photos, name }: { photos: Photo[]; name: string }) {
  const viewer = useRef<HTMLDialogElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const [at, setAt] = useState(0);
  const shown = photos[Math.min(at, photos.length - 1)];
  const step = (by: number) => setAt((current) => (current + by + photos.length) % photos.length);

  // A maker's name is a link, and it goes when the next photograph has no
  // maker. If the focus was on it, the focus goes too, and the arrow keys with
  // it: bring it back inside.
  useEffect(() => {
    const dialog = viewer.current;
    if (dialog?.open && !dialog.contains(document.activeElement)) next.current?.focus();
  }, [at]);

  return (
    <>
      <div className="gallery" data-in>
        {photos.map((photo, index) => (
          <figure key={photo.id}>
            <button
              type="button"
              className="gallery__photo"
              aria-label={`${name}, photograph ${index + 1} of ${photos.length}. Open it larger`}
              onClick={() => {
                setAt(index);
                viewer.current?.showModal();
                // start on a control that is always there, not on a name that may not be
                next.current?.focus();
              }}
            >
              <CatPhoto photo={photo} alt="" sizes="(min-width: 52rem) 30vw, 46vw" />
            </button>
            <By photo={photo} />
          </figure>
        ))}
      </div>

      <dialog
        ref={viewer}
        className="viewer"
        aria-label={`Photographs of ${name}`}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
        onClick={(event) => {
          if (event.target === viewer.current) viewer.current?.close();
        }}
      >
        <figure className="viewer__in">
          <div className="viewer__photo">
            <CatPhoto key={shown.id} photo={shown} alt={`${name}, photograph ${at + 1} of ${photos.length}`} sizes="92vw" />
          </div>
          <figcaption className="viewer__bar">
            <span className="viewer__count" aria-hidden="true">
              {at + 1} of {photos.length}
            </span>
            {shown.credit ? (
              <span className="viewer__by">
                <a className="link" href={shown.credit.page}>
                  {shown.credit.by}
                </a>
                , {shown.credit.licence}
              </span>
            ) : (
              <span className="viewer__by">From TheCatAPI</span>
            )}
            <span className="viewer__keys">
              <button type="button" className="iconbtn" onClick={() => step(-1)} aria-label="The photograph before">
                <ArrowLeft size={20} weight="bold" aria-hidden="true" />
              </button>
              <button ref={next} type="button" className="iconbtn" onClick={() => step(1)} aria-label="The next photograph">
                <ArrowRight size={20} weight="bold" aria-hidden="true" />
              </button>
              <button type="button" className="iconbtn" onClick={() => viewer.current?.close()} aria-label="Close the photographs">
                <X size={20} weight="bold" aria-hidden="true" />
              </button>
            </span>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}
