'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import type { Range } from '@/lib/catalogue';
import type { RegionKey } from '@/lib/regions';

export interface ScaleRow {
  slug: string;
  name: string;
  region: RegionKey;
  weight: Range | null;
  height: Range | null;
  life: Range | null;
}

const MEASURES = [
  { key: 'weight', label: 'Weight', unit: 'kg', step: 2 },
  { key: 'height', label: 'Height', unit: 'cm', step: 10 },
  { key: 'life', label: 'Life span', unit: 'years', step: 5 },
] as const;
type MeasureKey = (typeof MEASURES)[number]['key'];

/** Every breed's range for one measure, largest first, on a scale that starts at zero. */
export function Scale({ rows }: { rows: ScaleRow[] }) {
  const [key, setKey] = useState<MeasureKey>('weight');
  const measure = MEASURES.find((entry) => entry.key === key) ?? MEASURES[0];

  const given = rows
    .flatMap((row) => {
      const range = row[key];
      return range ? [{ row, range }] : [];
    })
    .sort((a, b) => b.range[1] - a.range[1] || b.range[0] - a.range[0] || a.row.name.localeCompare(b.row.name));
  const top = Math.ceil(Math.max(...given.map((entry) => entry.range[1])) / measure.step) * measure.step;
  const ticks = Array.from({ length: top / measure.step + 1 }, (_, index) => index * measure.step);
  const missing = rows.length - given.length;

  return (
    <div className="scale">
      <div className="toolbar">
        <div className="scale__pick" role="group" aria-label="Measure">
          {MEASURES.map((entry) => (
            <button key={entry.key} type="button" className="btn btn--quiet btn--small" aria-pressed={entry.key === key} onClick={() => setKey(entry.key)}>
              {entry.label}
            </button>
          ))}
        </div>
        <p className="status muted" aria-live="polite">
          {given.length} entries in {measure.unit}, largest first.{missing > 0 && ` The source gives no ${measure.label.toLowerCase()} for ${missing}.`}
        </p>
      </div>

      <div className="scale__axis" aria-hidden="true">
        <span />
        <span className="scale__ticks">
          {ticks.map((tick) => (
            <i key={tick} style={{ left: `${(tick / top) * 100}%` }}>
              {tick}
            </i>
          ))}
        </span>
        <span>{measure.unit}</span>
      </div>
      <ol className="scale__rows" style={{ '--step': `${(measure.step / top) * 100}%` } as CSSProperties}>
        {given.map(({ row, range }) => (
          <li key={row.slug} data-region={row.region}>
            <Link href={`/breeds/${row.slug}/`}>{row.name}</Link>
            <span className="scale__track" aria-hidden="true">
              <i style={{ left: `${(range[0] / top) * 100}%`, width: `${((range[1] - range[0]) / top) * 100}%` }} />
            </span>
            <span className="scale__value">
              {range[0]} to {range[1]}
              <span className="sr-only"> {measure.unit}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
