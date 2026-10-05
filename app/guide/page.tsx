import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clip } from '@/components/Clip';
import { BREEDS, breedBySlug, breedsIn } from '@/lib/catalogue';
import { regionByKey } from '@/lib/regions';
import { SOURCES, filmByKey, short, type SourceKey } from '@/lib/sources';

export const metadata: Metadata = {
  title: 'One animal',
  description: 'What every cat breed shares: where the house cat came from, how it drinks, grooms, hears and greets, with five short films and the study behind each statement.',
  alternates: { canonical: '/guide/' },
};

/** "Reis, Jung, Aristoff & Stocker, 2010", linked to the paper. */
function Cite({ from }: { from: SourceKey[] }) {
  return (
    <p className="cite">
      {from.map((key, index) => (
        <span key={key}>
          {index > 0 && '; '}
          <a className="link" href={SOURCES[key].url}>
            {short(key)}
          </a>
        </span>
      ))}
    </p>
  );
}

interface Plate {
  film: string;
  title: string;
  text: string;
  label: string;
  from: SourceKey[];
  also?: { name: string; url: string }[];
}

const PLATES: Plate[] = [
  {
    film: 'lapping',
    title: 'It drinks by pulling, not scooping.',
    text: 'The tip of the tongue touches the water and is drawn straight back up. A column of water rises after it, and the jaw closes before gravity breaks the column. A house cat does this about four times a second and takes about a tenth of a millilitre each time. The film is slowed down.',
    label: 'A ginger cat lapping water from the ground, slowed down',
    from: ['lapping'],
  },
  {
    film: 'grooming',
    title: 'The tongue is a comb that carries its own water.',
    text: 'It is covered in small spines, and each spine is hollow at the tip. The hollow picks up saliva and wicks it down to the roots of the fur. Cats filmed around the clock slept or rested for about half of it and spent about 4% of the day licking themselves clean.',
    label: 'A tabby cat washing itself in its bed',
    from: ['papillae', 'grooming'],
  },
  {
    film: 'kneading',
    title: 'The claws come out when it chooses.',
    text: 'At rest they sit sheathed in the skin and fur around the toes. A cat puts them out to climb, to hunt, to fight, and to knead. Kneading is thought to be left over from nursing, when a newborn presses at its mother to bring milk. Some cats keep it up for life.',
    label: 'A tabby cat kneading a blanket with its front paws, claws showing',
    from: [],
    also: [
      { name: 'Wikipedia, Cat: claws', url: 'https://en.wikipedia.org/wiki/Cat#Claws' },
      { name: 'Wikipedia, Kneading (cats)', url: 'https://en.wikipedia.org/wiki/Kneading_(cats)' },
    ],
  },
  {
    film: 'catnip',
    title: 'One cat in three ignores catnip.',
    text: 'Of 100 house cats offered it, 68 responded. Silver vine, a plant from East Asia, did better with 79. The rubbing and rolling has a use: it spreads compounds from the leaves over the fur, and those compounds keep mosquitoes off.',
    label: 'A black and white cat sniffing and rubbing against a catnip plant in a garden',
    from: ['catnip', 'iridoids'],
  },
  {
    film: 'walking',
    title: 'A tail held straight up is a greeting.',
    text: 'A cat raises its tail as it walks up to a cat or a person it means well towards. In a colony of cats living free, the tail went up most often from lower-ranking cats to higher-ranking ones.',
    label: 'A black cat walking towards the camera across grass with its tail straight up',
    from: ['tail'],
  },
];

export default function Guide() {
  const westasia = regionByKey('westasia');
  const cyprus = breedBySlug('cyprus');
  const mau = breedBySlug('egyptian-mau');
  const used = Object.keys(SOURCES).filter((key) => key !== 'needs') as SourceKey[];

  return (
    <main id="main">
      <div className="wrap">
        <div className="page-head">
          <h1>One animal.</h1>
          <p>
            All {BREEDS.length} entries in the atlas are one species, Felis catus. This page is about what they share. Every statement names the study it
            comes from, and the films are real cats, filmed by the people credited under them.
          </p>
        </div>

        <section className="chapter" aria-labelledby="before">
          <h2 id="before">Before the breeds</h2>
          <ol className="ledger">
            <li>
              <p className="ledger__fig">9,500 years</p>
              <p>
                The oldest known sign of a cat kept by people is a grave on Cyprus: a person, and forty centimetres away a cat, buried about 9,500 years
                ago. Cats are not native to the island, so somebody brought it.
              </p>
              <Cite from={['cyprus']} />
            </li>
            <li>
              <p className="ledger__fig">One wildcat</p>
              <p>
                Every house cat descends from the Near Eastern wildcat, Felis silvestris lybica. The genes of 979 cats and wildcats point back to the
                Fertile Crescent.
              </p>
              <Cite from={['origin']} />
            </li>
            <li>
              <p className="ledger__fig">Two journeys</p>
              <p>
                Ancient DNA shows cats spreading twice: first out of the Near East with the early farmers, then out of Egypt along trade and shipping
                routes in Greek and Roman times.
              </p>
              <Cite from={['dispersal']} />
            </li>
          </ol>
          <p className="chapter__after">
            In the atlas that part of the world is{' '}
            <Link className="link" href="/regions/westasia/">
              {westasia.name}
            </Link>
            : {breedsIn('westasia').length} breeds
            {cyprus && mau && (
              <>
                , among them the{' '}
                <Link className="link" href={`/breeds/${cyprus.slug}/`}>
                  {cyprus.name}
                </Link>{' '}
                cat and the{' '}
                <Link className="link" href={`/breeds/${mau.slug}/`}>
                  {mau.name}
                </Link>
              </>
            )}
            .
          </p>
        </section>

        <section className="chapter plates" aria-labelledby="films">
          <h2 id="films">Five things, filmed</h2>
          {PLATES.map((plate) => {
            const film = filmByKey(plate.film);
            return (
              <article key={plate.film} id={plate.film} className="plate">
                <div className="plate__film">
                  <Clip name={film.key} seconds={film.seconds} label={plate.label} />
                  <p className="cite">
                    Film by{' '}
                    <a className="link" href={film.page}>
                      {film.by}
                    </a>
                    , {film.licence === 'CC0' ? 'given to the public domain' : film.licence}, shortened.
                  </p>
                </div>
                <div className="plate__text">
                  <h3>{plate.title}</h3>
                  <p>{plate.text}</p>
                  {plate.from.length > 0 && <Cite from={plate.from} />}
                  {plate.also && (
                    <p className="cite">
                      {plate.also.map((entry, index) => (
                        <span key={entry.url}>
                          {index > 0 && '; '}
                          <a className="link" href={entry.url}>
                            {entry.name}
                          </a>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <section className="chapter" aria-labelledby="senses">
          <h2 id="senses">Senses, in numbers</h2>
          <ul className="ledger">
            <li>
              <p className="ledger__fig">
                <small>Hearing</small>
                48 Hz to 85 kHz
              </p>
              <p>What a cat hears at an ordinary loudness. A person stops near 20 kHz. Few mammals hear across a wider range.</p>
              <Cite from={['hearing']} />
            </li>
            <li>
              <p className="ledger__fig">
                <small>Pupils</small>
                135 times
              </p>
              <p>
                How much the opening of a cat&rsquo;s pupil grows between a slit in daylight and a full circle in the dark. A person&rsquo;s round pupil
                manages 15 times. Upright slits belong to hunters that ambush from close to the ground.
              </p>
              <Cite from={['pupils']} />
            </li>
            <li>
              <p className="ledger__fig">
                <small>Sweetness</small>
                None
              </p>
              <p>One of the two genes that build the receptor for sweet things is broken in cats, and in tigers and cheetahs too. Sugar does not interest them.</p>
              <Cite from={['sweet']} />
            </li>
          </ul>
        </section>

        <section className="chapter falling" aria-labelledby="falling">
          <figure>
            <Image src="/guide/falling-cat-1894.jpg" alt="Nineteen photographs in two rows: a cat let go upside down turns over as it falls and lands on its feet." width={1251} height={737} sizes="(min-width: 60rem) 56vw, 92vw" quality={82} />
            <figcaption className="cite">
              Étienne-Jules Marey, 1894. Out of copyright; the copy is{' '}
              <a className="link" href="https://commons.wikimedia.org/wiki/File:Falling_cat_1894.jpg">
                on Wikimedia Commons
              </a>
              .
            </figcaption>
          </figure>
          <div>
            <h2 id="falling">It lands on its feet, and in 1894 nobody could say how.</h2>
            <p>
              Étienne-Jules Marey let a cat go upside down in front of a camera he had built to take many photographs a second. Read from left to right,
              top row first: the cat turns over in the air with nothing to push against, front half first, hind half after it.
            </p>
            <Cite from={['falling']} />
          </div>
        </section>

        <section className="chapter" aria-labelledby="people">
          <h2 id="people">With people</h2>
          <ul className="ledger">
            <li>
              <h3>A slow blink is answered.</h3>
              <p>Cats narrowed their eyes more at owners who slow-blinked at them, and were readier to walk up to a stranger who did it than to one who kept a blank face.</p>
              <Cite from={['blink']} />
            </li>
            <li>
              <h3>They know their names.</h3>
              <p>Cats told their own name from other words of the same length, even when a stranger said it. They answered with a turn of the ears or the head more often than with a step.</p>
              <Cite from={['names']} />
            </li>
            <li>
              <h3>A purr can ask.</h3>
              <p>The purr a cat uses to ask for food has a high cry folded inside it. People who heard recordings rated those purrs as more urgent, whether or not they had ever kept a cat.</p>
              <Cite from={['purr']} />
            </li>
          </ul>
        </section>

        <section className="chapter refs" aria-labelledby="refs">
          <h2 id="refs">The studies</h2>
          <ol>
            {used.map((key) => (
              <li key={key}>
                {SOURCES[key].who} ({SOURCES[key].year}).{' '}
                <a className="link" href={SOURCES[key].url}>
                  {SOURCES[key].title}
                </a>
                . {SOURCES[key].where}.
              </li>
            ))}
          </ol>
          <div className="refs__next">
            <Link className="btn" href="/care/">
              What a cat needs
            </Link>
            <Link className="btn btn--quiet" href="/credits/">
              Film and photo credits
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
