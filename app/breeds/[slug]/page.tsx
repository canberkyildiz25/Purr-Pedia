import { ArrowLeft, Cat } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { BreedTile } from '@/components/BreedTile';
import { CompareButton, SaveButton } from '@/components/Buttons';
import { CatPhoto } from '@/components/CatPhoto';
import { By, Gallery } from '@/components/Gallery';
import { BREEDS, COATS, EXTENT, RANGES, WORDS, breedBySlug, cm, eraLabel, hasPage, kg, neighbours, opening, originLabel, originPhrase, the, toTile, wordSlug, years, type Range } from '@/lib/catalogue';
import { regionByKey } from '@/lib/regions';
import { DATA_SOURCE } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return BREEDS.map((breed) => ({ slug: breed.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const breed = breedBySlug((await params).slug);
  if (!breed) return {};
  return {
    title: breed.name,
    description: `${breed.name}, from ${originLabel(breed)}. ${breed.description}`,
    alternates: { canonical: `/breeds/${breed.slug}/` },
  };
}

/* Where a breed's range falls among all of them: the track runs from the
   smallest figure on the list to the largest. */
function Where({ range, extent, more, of }: { range: Range | null; extent: Range; more: string; of: Range[] }) {
  if (!range) return null;
  const width = extent[1] - extent[0];
  const below = of.filter((other) => other[1] < range[1]).length;
  return (
    <>
      <span className="where" aria-hidden="true">
        <i style={{ left: `${((range[0] - extent[0]) / width) * 100}%`, width: `${Math.max(((range[1] - range[0]) / width) * 100, 2)}%` }} />
      </span>
      <span className="where__say">
        {more} than {below} of {of.length - 1}
      </span>
    </>
  );
}

export default async function BreedPage({ params }: Props) {
  const breed = breedBySlug((await params).slug);
  if (!breed) notFound();

  const region = regionByKey(breed.region);
  const [lead, ...more] = breed.photos;
  const near = neighbours(breed, 4);
  const samePlace = near.length > 0 && near.every((other) => other.places.some((place) => breed.places.some((own) => own.slug === place.slug)));
  const alt = /cat$/i.test(breed.name) ? breed.name : `${breed.name} cat`;
  const fromFirst = breed.photos.some((photo) => !photo.credit);
  const fromCommons = breed.photos.some((photo) => photo.credit);
  const linked = new Set(WORDS.filter(hasPage).map((entry) => entry.word));

  return (
    <main id="main">
      <div className={lead ? 'breed-head' : 'breed-head breed-head--plain'} data-region={breed.region}>
        <div className="breed-head__text">
          <div>
            <Link className="crumb" href={`/regions/${breed.region}/${breed.places[0] ? `#${breed.places[0].slug}` : ''}`}>
              <ArrowLeft size={18} weight="bold" aria-hidden="true" />
              {region.name}
            </Link>
            <h1>{breed.name}</h1>
            <p className="breed-head__where">
              {breed.places.length ? `From ${originPhrase(breed)}.` : 'Filed under no single place.'}
              {!breed.isBreed && ' By the source’s own account, not a breed.'}
            </p>
            {!lead && (
              <p className="breed-head__none">
                <Cat size={22} weight="fill" aria-hidden="true" />
                No photograph of this one could be found.
              </p>
            )}
          </div>
          <div className="breed-head__actions">
            <SaveButton slug={breed.slug} name={breed.name} />
            <CompareButton slug={breed.slug} name={breed.name} />
          </div>
        </div>
        {lead && (
          // a small original is shown at its own size instead of being stretched to fill the plate
          <figure className="breed-head__figure" style={lead.w < 700 ? { maxWidth: `${lead.w}px` } : undefined}>
            <div className="breed-head__photo">
              <ViewTransition name={`photo-${breed.slug}`}>
                <CatPhoto photo={lead} alt={alt} sizes="(min-width: 60rem) 44vw, 92vw" lead />
              </ViewTransition>
            </div>
            <By photo={lead} />
          </figure>
        )}
      </div>

      <div className="wrap">
        <dl className="facts">
          <div>
            <dt>Began</dt>
            <dd>{eraLabel(breed)}</dd>
          </div>
          <div>
            <dt>Coat</dt>
            <dd>{COATS[breed.coat]}</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>
              {breed.weight ? kg(breed.weight) : 'Not given'}
              <Where range={breed.weight} extent={EXTENT.weight} more="Heavier" of={RANGES.weight} />
            </dd>
          </div>
          <div>
            <dt>Height</dt>
            <dd>
              {breed.height ? cm(breed.height) : 'Not given'}
              <Where range={breed.height} extent={EXTENT.height} more="Taller" of={RANGES.height} />
            </dd>
          </div>
          <div>
            <dt>Life span</dt>
            <dd>
              {breed.life ? years(breed.life) : 'Not given'}
              <Where range={breed.life} extent={EXTENT.life} more="Longer-lived" of={RANGES.life} />
            </dd>
          </div>
        </dl>

        <div className="story">
          <section aria-labelledby="short">
            <h2 id="short">In short</h2>
            <p>{breed.description}</p>
            {breed.words.length > 0 && (
              <ul className="words" aria-label="Described as">
                {breed.words.map((word) => (
                  <li key={word}>
                    {linked.has(word) ? (
                      <Link className="word" href={`/words/${wordSlug(word)}/`}>
                        {word}
                      </Link>
                    ) : (
                      <span className="word">{word}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
          {breed.history && (
            <section aria-labelledby="began">
              <h2 id="began">How it began</h2>
              <p>{breed.history}</p>
            </section>
          )}
          {breed.article && (
            <section className="story__wide" aria-labelledby="elsewhere">
              <h2 id="elsewhere">As Wikipedia opens it</h2>
              <blockquote cite={breed.article.url}>
                <p>{opening(breed.article.extract)}</p>
              </blockquote>
              <p className="credit">
                From{' '}
                <a className="link" href={breed.article.url}>
                  {breed.article.title} on Wikipedia
                </a>
                , under CC BY-SA 4.0. The two sources do not always agree, and neither has been corrected to match the other.
              </p>
            </section>
          )}
        </div>

        {more.length > 0 && <Gallery photos={more} name={breed.name} />}
        <p className="credit">
          {fromFirst && (
            <>
              Photographs from{' '}
              <a className="link" href={DATA_SOURCE.url}>
                {DATA_SOURCE.name}
              </a>
              , which does not name the people who took them.
              {fromCommons && ' The ones with a name under them are from Wikimedia Commons.'}
            </>
          )}
          {!fromFirst && fromCommons && (
            <>
              The first source,{' '}
              <a className="link" href={DATA_SOURCE.url}>
                {DATA_SOURCE.name}
              </a>
              , has no photograph of this one. These are from Wikimedia Commons, each under its maker&rsquo;s name.
            </>
          )}
          {!lead && (
            <>
              Record from{' '}
              <a className="link" href={DATA_SOURCE.url}>
                {DATA_SOURCE.name}
              </a>
              . It has no photograph of this one, and none that is free to copy turned up on Wikipedia, so none is shown.
            </>
          )}{' '}
          <Link className="link" href="/credits/">
            All credits
          </Link>
          .
        </p>

        {near.length > 0 && (
          <section className="near" aria-labelledby="near">
            <h2 id="near">{samePlace && breed.places[0] ? `Also from ${the(breed.places[0].name)}` : `Also from ${region.name === 'No single place' ? 'no single place' : region.name}`}</h2>
            <div className="tiles" data-in>
              {near.map((other) => (
                <BreedTile key={other.id} breed={toTile(other)} />
              ))}
            </div>
          </section>
        )}
        {near.length === 0 && <div className="page-foot" />}
      </div>
    </main>
  );
}
