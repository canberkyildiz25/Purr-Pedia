import type { Metadata } from 'next';
import Link from 'next/link';
import { BreedTile } from '@/components/BreedTile';
import { breedBySlug, toTile } from '@/lib/catalogue';

export const metadata: Metadata = {
  title: 'Not on the map',
  robots: { index: false },
};

const INSTEAD = ['sphynx', 'maine-coon', 'japanese-bobtail', 'turkish-van'];

export default function NotFound() {
  const breeds = INSTEAD.flatMap((slug) => breedBySlug(slug) ?? []);
  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>Not on the map.</h1>
        <p>There is no page at this address. It may have moved, or the address may be mistyped.</p>
        <div className="hero__actions">
          <Link className="btn" href="/">
            Open the atlas
          </Link>
          <Link className="btn btn--quiet" href="/breeds/">
            Browse A to Z
          </Link>
        </div>
      </div>
      <div className="tiles">
        {breeds.map((breed) => (
          <BreedTile key={breed.id} breed={toTile(breed)} />
        ))}
      </div>
      <div className="page-foot" />
    </main>
  );
}
