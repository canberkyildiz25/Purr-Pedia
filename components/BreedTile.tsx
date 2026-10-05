import { Cat } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { ViewTransition } from 'react';
import type { TileData } from '@/lib/catalogue';
import { CatPhoto } from './CatPhoto';

/** One breed: its photograph, its name, and the place it comes from with the
    dot of that place's region. A breed nobody has a free photograph of keeps
    its place, with a plain mark where the picture would be.

    The photograph carries a name the breed's own page uses too, so that
    opening a breed grows this picture into that one. On a page that shows the
    same breed twice, only one of the two may carry it: pass morph={false} to
    the other. */
export function BreedTile({ breed, sizes = '(min-width: 40rem) 16rem, 46vw', lead = false, morph = true }: { breed: TileData; sizes?: string; lead?: boolean; morph?: boolean }) {
  const photo = breed.photo ? <CatPhoto photo={breed.photo} alt="" sizes={sizes} lead={lead} /> : null;
  return (
    <Link className="tile" href={`/breeds/${breed.slug}/`} data-region={breed.region}>
      <span className="tile__photo">
        {photo ? (
          morph ? (
            <ViewTransition name={`photo-${breed.slug}`}>{photo}</ViewTransition>
          ) : (
            photo
          )
        ) : (
          <span className="tile__blank">
            <Cat size={40} weight="light" aria-hidden="true" />
          </span>
        )}
      </span>
      <span className="tile__text">
        <span className="tile__name">{breed.name}</span>
        <span className="tile__place">
          {breed.place}
          {!breed.photo && <span className="sr-only">, no photograph</span>}
        </span>
      </span>
    </Link>
  );
}
