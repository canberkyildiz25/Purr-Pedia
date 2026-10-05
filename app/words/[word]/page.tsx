import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreedTile } from '@/components/BreedTile';
import { BREEDS, WORDS, hasPage, saidWith, toTile, wordBySlug } from '@/lib/catalogue';
import { REGIONS } from '@/lib/regions';

interface Props {
  params: Promise<{ word: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return WORDS.filter(hasPage).map((entry) => ({ word: entry.slug }));
}

const title = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = wordBySlug((await params).word);
  if (!entry) return {};
  return {
    title: `${title(entry.word)} breeds`,
    description: `The ${entry.breeds.length} cat breeds the source describes as ${entry.word}, out of ${BREEDS.length}, with where each one comes from and the words most often said alongside it.`,
    alternates: { canonical: `/words/${entry.slug}/` },
  };
}

export default async function WordPage({ params }: Props) {
  const entry = wordBySlug((await params).word);
  if (!entry || !hasPage(entry)) notFound();

  const byRegion = REGIONS.map((region) => ({ region, count: entry.breeds.filter((breed) => breed.region === region.key).length })).filter((row) => row.count > 0);
  const together = saidWith(entry);

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <Link className="crumb" href="/words/">
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          All the words
        </Link>
        <h1>{title(entry.word)}.</h1>
        <p>
          The source says this of {entry.breeds.length} of its {BREEDS.length} entries.
        </p>
      </div>

      <ul className="key" aria-label="Where they come from">
        {byRegion.map(({ region, count }) => (
          <li key={region.key}>
            <Link href={`/regions/${region.key}/`} data-region={region.key}>
              <span className="swatch" aria-hidden="true" />
              <span>{region.name}</span>
              <span className="key__n">{count}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="tiles" data-in>
        {entry.breeds.map((breed, index) => (
          <BreedTile key={breed.id} breed={toTile(breed)} lead={index < 4} />
        ))}
      </div>

      {together.length > 0 && (
        <section className="near" aria-labelledby="together">
          <h2 id="together">Often said in the same breath</h2>
          <ul className="words">
            {together.map(({ other, both }) => (
              <li key={other.word}>
                <Link className="word" href={`/words/${other.slug}/`}>
                  {other.word}
                  <span className="count">{both}</span>
                  <span className="sr-only"> breeds have both</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {together.length === 0 && <div className="page-foot" />}
    </main>
  );
}
