'use client';

import { useId, useState } from 'react';
import type { CoatKey, TileData } from '@/lib/catalogue';
import type { RegionKey } from '@/lib/regions';
import { BreedTile } from './BreedTile';

export interface FinderItem extends TileData {
  coat: CoatKey;
  /** Top of the weight range in kilograms, or 0 when the source gives none. */
  heavy: number;
  /** 0 for old natural breeds, the year for dated ones, 9999 for the rest. */
  age: number;
}

type Order = 'name' | 'oldest' | 'small' | 'large';

/** Every breed, narrowed by name, region and coat, in the order asked for. */
export function Finder({ items, regions, coats }: { items: FinderItem[]; regions: { key: RegionKey; name: string }[]; coats: { key: CoatKey; name: string }[] }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<RegionKey | ''>('');
  const [coat, setCoat] = useState<CoatKey | ''>('');
  const [order, setOrder] = useState<Order>('name');
  const [photosOnly, setPhotosOnly] = useState(false);

  const needle = query.trim().toLowerCase();
  const shown = items
    .filter((item) => !needle || item.name.toLowerCase().includes(needle) || item.place.toLowerCase().includes(needle))
    .filter((item) => !region || item.region === region)
    .filter((item) => !coat || item.coat === coat)
    .filter((item) => !photosOnly || item.photo)
    .sort((a, b) => {
      if (order === 'oldest') return a.age - b.age || a.name.localeCompare(b.name);
      if (order === 'small') return (a.heavy || 99) - (b.heavy || 99) || a.name.localeCompare(b.name);
      if (order === 'large') return b.heavy - a.heavy || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  const narrowed = Boolean(needle || region || coat || photosOnly);
  const clear = () => {
    setQuery('');
    setRegion('');
    setCoat('');
    setPhotosOnly(false);
  };

  return (
    <>
      <div className="finder">
        <div className="field field--wide">
          <label htmlFor={`${id}-q`}>Name or place</label>
          <input id={`${id}-q`} className="input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" spellCheck={false} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-region`}>Region</label>
          <select id={`${id}-region`} className="select" value={region} onChange={(event) => setRegion(event.target.value as RegionKey | '')}>
            <option value="">Anywhere</option>
            {regions.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-coat`}>Coat</label>
          <select id={`${id}-coat`} className="select" value={coat} onChange={(event) => setCoat(event.target.value as CoatKey | '')}>
            <option value="">Any coat</option>
            {coats.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-order`}>Order</label>
          <select id={`${id}-order`} className="select" value={order} onChange={(event) => setOrder(event.target.value as Order)}>
            <option value="name">A to Z</option>
            <option value="oldest">Oldest first</option>
            <option value="small">Smallest first</option>
            <option value="large">Largest first</option>
          </select>
        </div>
        <label className="check">
          <input type="checkbox" checked={photosOnly} onChange={(event) => setPhotosOnly(event.target.checked)} />
          With a photograph
        </label>
        {narrowed && (
          <button type="button" className="btn btn--quiet btn--small" onClick={clear}>
            Clear
          </button>
        )}
      </div>

      <p className="tally nums" role="status">
        {shown.length ? `${shown.length} of ${items.length}` : 'Nothing matches. Loosen the search or clear it.'}
      </p>

      <div className="tiles" data-in>
        {shown.map((item) => (
          <BreedTile key={item.slug} breed={item} />
        ))}
      </div>
    </>
  );
}
