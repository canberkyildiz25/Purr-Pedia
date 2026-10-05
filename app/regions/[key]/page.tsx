import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreedTile } from '@/components/BreedTile';
import { byAge, breedsIn, placesIn, regionLine, toTile } from '@/lib/catalogue';
import { REGIONS, type RegionKey } from '@/lib/regions';

interface Props {
  params: Promise<{ key: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return REGIONS.map((region) => ({ key: region.key }));
}

const find = (key: string) => REGIONS.find((region) => region.key === key);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = find((await params).key);
  if (!region) return {};
  const count = breedsIn(region.key).length;
  return {
    title: region.name,
    description: `${count} cat breeds that began in ${region.name === 'No single place' ? 'no single place' : region.name}. ${regionLine(region.key)}`,
    alternates: { canonical: `/regions/${region.key}/` },
  };
}

export default async function RegionPage({ params }: Props) {
  const region = find((await params).key);
  if (!region) notFound();

  const key = region.key as RegionKey;
  const breeds = breedsIn(key);
  const places = placesIn(key);

  return (
    <main id="main">
      <div className="field-head" data-region={key}>
        <Link className="crumb" href="/#atlas">
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          The atlas
        </Link>
        <h1>{region.name}</h1>
        <p>
          {breeds.length} {breeds.length === 1 ? 'entry' : 'entries'}
          {places.length > 0 && ` from ${places.length} ${places.length === 1 ? 'place' : 'places'}`}. {regionLine(key)}
        </p>
        {places.length > 1 && (
          <nav className="jump" aria-label="Places in this region">
            {places.map((entry) => (
              <a key={entry.place.slug} className="btn btn--quiet btn--small" href={`#${entry.place.slug}`}>
                {entry.place.name}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div className="wrap">
        {places.length > 0 ? (
          places.map((entry) => (
            <section key={entry.place.slug} id={entry.place.slug} className="place" aria-labelledby={`${entry.place.slug}-title`}>
              <h2 id={`${entry.place.slug}-title`}>{entry.place.name}</h2>
              <p>
                {entry.breeds.length} {entry.breeds.length === 1 ? 'breed' : 'breeds'}, oldest first
              </p>
              <div className="tiles" data-in>
                {[...entry.breeds].sort(byAge).map((breed) => (
                  <BreedTile key={breed.id} breed={toTile(breed)} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <section className="place" aria-label="Entries">
            <div className="tiles" data-in>
              {breeds.map((breed) => (
                <BreedTile key={breed.id} breed={toTile(breed)} />
              ))}
            </div>
          </section>
        )}
        <div className="page-foot" />
      </div>
    </main>
  );
}
