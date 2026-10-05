import type { Metadata } from 'next';
import Link from 'next/link';
import { EraseButton } from '@/components/Buttons';
import { ARTICLES, CHECKED } from '@/lib/articles';
import { BREEDS, COMMONS, FETCHED, PLACE_ENTRIES, SOURCE_COUNT, WIKI_FETCHED } from '@/lib/catalogue';
import { AUTHOR, DATA_SOURCE, REPO } from '@/lib/site';
import { FILMS, SOURCES } from '@/lib/sources';

export const metadata: Metadata = {
  title: 'About the data',
  description: 'Where the breed records, photographs, films and facts come from, what was left out and why, how the dates were read, and what the site keeps in your browser.',
  alternates: { canonical: '/about/' },
};

const day = (iso: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

export default function About() {
  const withPhotos = BREEDS.filter((breed) => breed.photos.length).length;
  const ledByCommons = BREEDS.filter((breed) => breed.photos[0]?.credit).length;
  const articles = BREEDS.filter((breed) => breed.article).length;
  const dated = BREEDS.filter((breed) => breed.era.kind === 'dated').length;
  const old = BREEDS.filter((breed) => breed.era.kind === 'old').length;

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>About the data</h1>
        <p>Catalogue is an atlas of cat breeds, filed by where each one began. This page says what it is built from and where it stops.</p>
      </div>

      <div className="about">
        <section aria-labelledby="source">
          <h2 id="source">The records</h2>
          <p>
            Every breed record comes from{' '}
            <a className="link" href={DATA_SOURCE.url}>
              {DATA_SOURCE.name}
            </a>
            , as it stood on {day(FETCHED)}. The site is built from that copy and does not call the service while you browse.
          </p>
          <p>
            The source sent {SOURCE_COUNT} records. {SOURCE_COUNT - BREEDS.length - 1} arrive broken, with no origin, no history and sentences in the
            weight column, so they cannot be filed and are left out. One breed is listed twice and appears once. That leaves {BREEDS.length} entries
            in {PLACE_ENTRIES.length} places.
          </p>
        </section>

        <section aria-labelledby="second">
          <h2 id="second">What Wikipedia adds</h2>
          <p>
            {`${articles} of the ${BREEDS.length} entries have a Wikipedia article of their own. Its opening lines are quoted on the breed’s page, as read on ${day(WIKI_FETCHED)}, next to the first source’s account and never mixed into it.`}
          </p>
          <p>
            An article that turned out to be about something else, a list or a parent breed, was not used. Where the two sources disagree, both are
            left as they are.
          </p>
        </section>

        <section aria-labelledby="dates">
          <h2 id="dates">How the dates were read</h2>
          <p>
            The source gives each breed a short history, not a date. Each history was read by hand, and the first year or decade it names as the
            breed&rsquo;s beginning was taken: {dated} breeds have one. A date of recognition by a registry was not counted as a beginning.
          </p>
          <p>
            {old} more are called ancient or natural and are filed as old, with no year. The rest have no date, and the timeline says so instead of
            guessing.
          </p>
        </section>

        <section aria-labelledby="photos">
          <h2 id="photos">Photographs</h2>
          <p>
            {`${withPhotos} of the ${BREEDS.length} entries have photographs, all of them real. ${COMMONS.length} are from Wikimedia Commons, and one of those leads the page of ${ledByCommons} breeds. The rest are from the first source, shown from its own servers.`}
          </p>
          <p>
            The Commons photographs were chosen by looking. For each breed I went through its category there for large, sharp pictures in which
            the cat is clear of what is around it, and took a few; one more may come from the breed&rsquo;s Wikipedia article. A file whose own name
            says it is a cross, another breed or a cat met in the street was left out, as were manuscript pages, a chart and a temple. The ones
            that stayed are listed with their makers on the{' '}
            <Link className="link" href="/credits/">
              credits page
            </Link>
            . The other {BREEDS.length - withPhotos} entries have no picture, and none was generated to fill the gap.
          </p>
        </section>

        <section aria-labelledby="facts">
          <h2 id="facts">The guide, the care page and the articles</h2>
          <p>
            The{' '}
            <Link className="link" href="/guide/">
              guide
            </Link>{' '}
            rests on {Object.keys(SOURCES).length - 1} published studies, each looked up by its DOI, and its numbers are theirs. The {FILMS.length}{' '}
            films are short cuts from videos on Commons.
          </p>
          <p>
            {`The ${ARTICLES.length} `}
            <Link className="link" href="/articles/">
              articles
            </Link>
            {` are written from the same kind of source, and each lists its own at the end. They were last checked in ${CHECKED}.`}
          </p>
          <p>
            The{' '}
            <Link className="link" href="/care/">
              care page
            </Link>{' '}
            summarises guidance from vets&rsquo; associations and public bodies. It is not advice about any one cat.
          </p>
        </section>

        <section aria-labelledby="gone">
          <h2 id="gone">What the first version had</h2>
          <p>
            Catalogue began as Purr Pedia, with a quiz, filters and bar charts built on scores from 1 to 5 for traits such as energy and affection.
            The source no longer publishes those scores.
          </p>
          <p>Rather than keep old numbers or invent new ones, this version is built on what the source still says: place, coat, size, life span and history.</p>
        </section>

        <section aria-labelledby="kept">
          <h2 id="kept">What is kept in your browser</h2>
          <p>
            No accounts, no cookies, no analytics. Your saved breeds, the breeds on the compare page and your choice of light or dark are held in this
            browser&rsquo;s local storage and nowhere else.
          </p>
          <EraseButton />
        </section>

        <section aria-labelledby="made">
          <h2 id="made">How it was made</h2>
          <p>
            Designed and built by{' '}
            <a className="link" href={AUTHOR.url}>
              {AUTHOR.name}
            </a>{' '}
            with Next.js, React and TypeScript, and set in Instrument Sans. The map is Natural Earth&rsquo;s coastline in an Equal Earth projection.
          </p>
          <p>
            The two films the home page plays as you scroll are free stock, from Pexels and Mixkit. If your system asks for reduced motion, or the
            window is too short to hold a scene, they do not play and the page is laid out still.
          </p>
          <p>
            The site aims to meet WCAG 2.2 at level AA. Nothing here is veterinary advice. The code, and the first version, are in the{' '}
            <a className="link" href={REPO}>
              repository
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
