'use client';

import Link from 'next/link';
import { useId, type CSSProperties } from 'react';
import type { Range, TileData } from '@/lib/catalogue';
import { COMPARE_LIMIT, useCatalogue, useHydrated } from '@/lib/store';
import { BreedTile } from './BreedTile';

export interface CompareItem extends TileData {
  coat: string;
  weight: Range | null;
  height: Range | null;
  life: Range | null;
  began: string;
  words: string[];
}

/** The top of each scale, so every column is drawn against the same ruler. */
export interface Scales {
  weight: number;
  height: number;
  life: number;
}

/** A range drawn on the scale all columns share, with its figures beside it. */
function Span({ value, top, unit }: { value: Range | null; top: number; unit: string }) {
  if (!value) return <>Not given</>;
  const style = { left: `${(value[0] / top) * 100}%`, width: `${Math.max(((value[1] - value[0]) / top) * 100, 2)}%` } as CSSProperties;
  return (
    <>
      {value[0]} to {value[1]} {unit}
      <span className="span" aria-hidden="true">
        <i style={style} />
      </span>
    </>
  );
}

/** Up to three breeds side by side. */
export function CompareView({ items, scales }: { items: CompareItem[]; scales: Scales }) {
  const id = useId();
  const hydrated = useHydrated();
  const picked = useCatalogue((state) => state.compare);
  const toggle = useCatalogue((state) => state.toggleCompare);
  const clear = useCatalogue((state) => state.clearCompare);

  if (!hydrated) {
    return (
      <p className="muted" role="status">
        Looking in this browser.
      </p>
    );
  }

  const chosen = picked.flatMap((slug) => items.find((item) => item.slug === slug) ?? []);
  const common = chosen.length > 1 ? chosen[0].words.filter((word) => chosen.every((item) => item.words.includes(word))) : [];
  const rest = items.filter((item) => !picked.includes(item.slug));

  return (
    <>
      <div className="toolbar">
        <div className="field">
          <label htmlFor={`${id}-add`}>Add a breed</label>
          <select
            id={`${id}-add`}
            className="select"
            value=""
            onChange={(event) => {
              if (event.target.value) toggle(event.target.value);
            }}
          >
            <option value="">{chosen.length >= COMPARE_LIMIT ? 'Choose one to swap in' : 'Choose a breed'}</option>
            {rest.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {chosen.length > 0 && (
          <button type="button" className="btn btn--quiet btn--small" onClick={clear}>
            Clear all
          </button>
        )}
      </div>

      {chosen.length === 0 ? (
        <div className="empty">
          <p>Nothing to compare yet. Choose up to three breeds here, or press Compare on any breed&rsquo;s page.</p>
          <Link className="btn" href="/breeds/">
            Browse A to Z
          </Link>
        </div>
      ) : (
        <>
          <p className="tally" role="status">
            {common.length > 0 ? `All ${chosen.length} are described as ${common.join(', ')}.` : chosen.length > 1 ? 'No word describes all of them.' : 'Add another breed to compare.'}
          </p>
          <div className="compare">
            {chosen.map((item) => (
              <div key={item.slug} className="compare__col" data-region={item.region}>
                <BreedTile breed={item} sizes="(min-width: 52rem) 28vw, 92vw" />
                <dl>
                  <div>
                    <dt>Began</dt>
                    <dd>{item.began}</dd>
                  </div>
                  <div>
                    <dt>Coat</dt>
                    <dd>{item.coat}</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd>
                      <Span value={item.weight} top={scales.weight} unit="kg" />
                    </dd>
                  </div>
                  <div>
                    <dt>Height</dt>
                    <dd>
                      <Span value={item.height} top={scales.height} unit="cm" />
                    </dd>
                  </div>
                  <div>
                    <dt>Life span</dt>
                    <dd>
                      <Span value={item.life} top={scales.life} unit="years" />
                    </dd>
                  </div>
                  <div>
                    <dt>Described as</dt>
                    <dd>{item.words.join(', ') || 'Not given'}</dd>
                  </div>
                </dl>
                <button type="button" className="btn btn--quiet btn--small" aria-label={`Take ${item.name} out of the comparison`} onClick={() => toggle(item.slug)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/** The breeds the visitor saved. */
export function SavedView({ items }: { items: TileData[] }) {
  const hydrated = useHydrated();
  const saved = useCatalogue((state) => state.saved);
  const toggle = useCatalogue((state) => state.toggleSaved);

  if (!hydrated) {
    return (
      <p className="muted" role="status">
        Looking in this browser.
      </p>
    );
  }

  const kept = saved.flatMap((slug) => items.find((item) => item.slug === slug) ?? []);
  if (!kept.length) {
    return (
      <div className="empty">
        <p>Nothing saved yet. Press Save on a breed&rsquo;s page and it will wait here.</p>
        <Link className="btn" href="/breeds/">
          Browse A to Z
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="tally nums" role="status">
        {kept.length} saved
      </p>
      <div className="tiles">
        {kept.map((item) => (
          <div key={item.slug} className="compare__col">
            <BreedTile breed={item} />
            <button type="button" className="btn btn--quiet btn--small" aria-label={`Take ${item.name} off the saved list`} onClick={() => toggle(item.slug)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
