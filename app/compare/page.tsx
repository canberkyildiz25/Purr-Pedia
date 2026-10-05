import type { Metadata } from 'next';
import { CompareView, type CompareItem } from '@/components/Lists';
import { BREEDS, COATS, eraLabel, toTile, type Breed } from '@/lib/catalogue';

export const metadata: Metadata = {
  title: 'Compare',
  description: 'Up to three cat breeds side by side: where and when they began, coat, weight, height and life span, drawn on one scale.',
  alternates: { canonical: '/compare/' },
};

export default function Compare() {
  const items: CompareItem[] = BREEDS.map((breed) => ({
    ...toTile(breed),
    coat: COATS[breed.coat],
    weight: breed.weight,
    height: breed.height,
    life: breed.life,
    began: eraLabel(breed),
    words: breed.words,
  }));
  const top = (pick: (breed: Breed) => number | undefined) => Math.max(...BREEDS.map((breed) => pick(breed) ?? 0));
  const scales = { weight: top((breed) => breed.weight?.[1]), height: top((breed) => breed.height?.[1]), life: top((breed) => breed.life?.[1]) };

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>Side by side</h1>
        <p>Up to three breeds at once. The bars share one scale, so a longer bar is a bigger cat. Your choices are kept in this browser.</p>
      </div>
      <CompareView items={items} scales={scales} />
      <div className="page-foot" />
    </main>
  );
}
