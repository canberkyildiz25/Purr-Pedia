import type { Metadata } from 'next';
import { Finder, type FinderItem } from '@/components/Finder';
import { BREEDS, COATS, toTile, type CoatKey } from '@/lib/catalogue';
import { REGIONS } from '@/lib/regions';

export const metadata: Metadata = {
  title: 'A to Z',
  description: `Every cat breed in the catalogue from ${BREEDS[0].name} to ${BREEDS[BREEDS.length - 1].name}, searchable by name and place, and sortable by age and size.`,
  alternates: { canonical: '/breeds/' },
};

export default function Breeds() {
  const items: FinderItem[] = BREEDS.map((breed) => ({
    ...toTile(breed),
    coat: breed.coat,
    heavy: breed.weight?.[1] ?? 0,
    age: breed.era.kind === 'old' ? 0 : breed.era.kind === 'dated' ? breed.era.year : 9999,
  }));
  const used = new Set(BREEDS.map((breed) => breed.coat));
  const coats = (Object.keys(COATS) as CoatKey[]).filter((key) => used.has(key)).map((key) => ({ key, name: COATS[key] }));

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>A to Z</h1>
        <p>All {BREEDS.length} entries. Search by name or place, narrow by region or coat, or put the oldest or the largest first.</p>
      </div>
      <Finder items={items} regions={REGIONS.map((region) => ({ key: region.key, name: region.name }))} coats={coats} />
      <div className="page-foot" />
    </main>
  );
}
