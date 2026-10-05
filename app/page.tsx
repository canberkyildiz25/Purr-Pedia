import { ArrowRight, Cat } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { AtlasFlight, type FlightPlace, type FlightStop } from '@/components/AtlasFlight';
import { BreedTile } from '@/components/BreedTile';
import { CatPhoto } from '@/components/CatPhoto';
import { Count } from '@/components/Motion';
import { Rail } from '@/components/Rail';
import { Scene } from '@/components/Scene';
import { ScrubFilm } from '@/components/ScrubFilm';
import { SearchPlate } from '@/components/Search';
import { ARTICLES } from '@/lib/articles';
import { BREEDS, COMMONS, PLACE_ENTRIES, REGION_COUNTS, WORDS, breedsIn, heaviest, placesIn, regionLine, toTile, type Breed } from '@/lib/catalogue';
import { LAND_PATH, MAP_HEIGHT, MAP_WIDTH, project } from '@/lib/map';
import { REGIONS } from '@/lib/regions';
import { SOURCES, short, type SourceKey } from '@/lib/sources';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

type Dated = Breed & { era: { kind: 'dated'; year: number; decade: number; label: string } };

/* How many photographs fly to a place: more where more breeds began. */
const flyersFor = (breeds: number) => (breeds >= 20 ? 6 : breeds >= 8 ? 4 : breeds >= 5 ? 3 : breeds >= 3 ? 2 : 1);

/* A steady number between 0 and 1 from a name, so that every build scatters
   the photographs the same way. */
function spread(text: string) {
  let hash = 2166136261;
  for (const letter of text) hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619);
  return ((hash >>> 0) % 10000) / 10000;
}

/* The tour of the map: the regions that have places, in order, and for every
   place the photographs that fly to it. */
function tour() {
  const regions = REGIONS.filter((region) => placesIn(region.key).length > 0);
  const stops: FlightStop[] = regions.map((region) => {
    const points = placesIn(region.key).map((entry) => project(entry.place.lon, entry.place.lat));
    const xs = points.map((point) => point[0]);
    const ys = points.map((point) => point[1]);
    const margin = 44;
    return {
      key: region.key,
      name: region.name,
      count: breedsIn(region.key).length,
      line: regionLine(region.key),
      box: [Math.min(...xs) - margin, Math.min(...ys) - margin, Math.max(...xs) + margin, Math.max(...ys) + margin],
    };
  });

  const places: FlightPlace[] = [];
  regions.forEach((region, stop) => {
    const entries = placesIn(region.key);
    // every photograph of the region gets its turn, the busiest place first
    const queue = entries.flatMap((entry) =>
      entry.breeds
        .filter((breed) => breed.photos.length > 0)
        .slice(0, flyersFor(entry.breeds.length))
        .map((breed) => ({ place: entry.place.slug, breed })),
    );
    const turnOf = (index: number) => (queue.length > 1 ? index / (queue.length - 1) : 0);

    entries.forEach((entry, order) => {
      const [x, y] = project(entry.place.lon, entry.place.lat);
      const own = queue.map((item, index) => ({ ...item, index })).filter((item) => item.place === entry.place.slug);
      places.push({
        slug: entry.place.slug,
        name: entry.place.name,
        region: region.key,
        x,
        y,
        r: 4 + Math.sqrt(entry.breeds.length) * 4,
        count: entry.breeds.length,
        stop,
        turn: own.length ? turnOf(own[0].index) : entries.length > 1 ? order / (entries.length - 1) : 0,
        flyers: own.map(({ breed, index }) => {
          const angle = spread(breed.slug) * Math.PI * 2;
          const far = 0.8 + spread(`${breed.slug} far`) * 0.45;
          return {
            slug: `${entry.place.slug}-${breed.slug}`,
            photo: toTile(breed).photo!,
            turn: turnOf(index),
            from: [Math.round(Math.cos(angle) * far * 1000) / 1000, Math.round(Math.sin(angle) * far * 1000) / 1000],
            tilt: Math.round((spread(`${breed.slug} tilt`) - 0.5) * 36),
          };
        }),
      });
    });
  });
  return { stops, places };
}

/** A breed as one line in a column: a small photograph, its name, a note. */
function Mini({ breed, note }: { breed: Breed; note: string }) {
  const tile = toTile(breed);
  return (
    <Link className="mini" href={`/breeds/${breed.slug}/`} data-region={breed.region}>
      <span className="mini__photo">{tile.photo ? <CatPhoto photo={tile.photo} alt="" sizes="56px" /> : <Cat size={22} weight="light" aria-hidden="true" />}</span>
      <span className="mini__name">{breed.name}</span>
      <span className="mini__note">{note}</span>
    </Link>
  );
}

/* Three findings from the guide, each said while the eye is on screen. */
const FINDINGS: { figure: string; text: string; from: SourceKey }[] = [
  { figure: '135 times', text: 'How much a cat’s pupil opens between a slit in daylight and a full circle in the dark. A person’s manages 15.', from: 'pupils' },
  { figure: '48 Hz to 85 kHz', text: 'What a cat hears at an ordinary loudness. A person stops near 20 kHz.', from: 'hearing' },
  { figure: 'Four laps a second', text: 'How a cat drinks: the tongue pulls a column of water up, and the jaw closes before it falls.', from: 'lapping' },
];

const COLUMN = 6;

export default function Home() {
  const { stops, places } = tour();
  const dated = BREEDS.filter((breed): breed is Dated => breed.era.kind === 'dated').sort((a, b) => a.era.year - b.era.year || a.name.localeCompare(b.name));
  const old = BREEDS.filter((breed) => breed.era.kind === 'old');
  const decades = [...new Set(dated.map((breed) => breed.era.decade))];
  const recent = dated.filter((breed) => breed.era.year >= 1950).length;
  const top = heaviest();
  const word = WORDS[0];
  // two with photographs from each region, for the last screen
  const closing = REGIONS.flatMap((region) =>
    breedsIn(region.key)
      .filter((breed) => breed.photos.length > 0)
      .slice(2, 4),
  ).slice(0, 10);

  return (
    <main id="main">
      <Scene span={2.3} className="arrival" fromTop>
        <div className="arrival__in">
          <div className="arrival__text">
            <h1>Where cats come from.</h1>
            <p className="arrival__lede">
              {BREEDS.length} breeds, filed by the place each one began: {PLACE_ENTRIES.length} places on one map.
            </p>
            <div className="hero__actions">
              <a className="btn" href="#atlas">
                Open the atlas
              </a>
              <Link className="btn btn--quiet" href="/breeds/">
                Browse A to Z
              </Link>
            </div>
          </div>
          <div className="arrival__film">
            <ScrubFilm name="arrival" width={1600} height={900} alt="A tabby kitten seen from above, sitting on a white floor and looking up" through="held" />
          </div>
        </div>
      </Scene>

      <section className="tally-act" aria-label="In numbers">
        <p className="wrap" data-in>
          <Count to={BREEDS.length} /> breeds. <Count to={PLACE_ENTRIES.length} /> places. <Count to={REGIONS.length} /> regions.
        </p>
      </section>

      <Scene span={4.8} className="tour" id="atlas" labelledBy="atlas-title">
        <AtlasFlight
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          places={places}
          stops={stops}
          regions={REGION_COUNTS.map(({ region, count }) => ({ key: region.key, name: region.name, count }))}
          land={<path className="map__land" d={LAND_PATH} />}
        />
      </Scene>

      <Scene span={3.6} className="era" labelledBy="timeline-title">
        <Rail label="Breeds in order of appearance">
          <div className="rail__card">
            <h2 id="timeline-title">In order of appearance</h2>
            <p>
              {dated.length} breeds have a history that names a starting date. {recent} of them began in 1950 or later.
            </p>
          </div>
          <div className="rail__col">
            <h3>Old</h3>
            <p className="rail__count">{old.length} with no founding date</p>
            {old.slice(0, COLUMN).map((breed) => (
              <Mini key={breed.id} breed={breed} note={toTile(breed).place} />
            ))}
            {old.length > COLUMN && (
              <Link className="rail__more" href="/timeline/#old">
                and {old.length - COLUMN} more
              </Link>
            )}
          </div>
          {decades.map((decade) => {
            const breeds = dated.filter((breed) => breed.era.decade === decade);
            return (
              <div key={decade} className="rail__col">
                <h3>{decade}s</h3>
                <p className="rail__count">
                  {breeds.length} {breeds.length === 1 ? 'breed' : 'breeds'}
                </p>
                {breeds.slice(0, COLUMN).map((breed) => (
                  <Mini key={breed.id} breed={breed} note={breed.era.label} />
                ))}
                {breeds.length > COLUMN && (
                  <Link className="rail__more" href={`/timeline/#d${decade}`}>
                    and {breeds.length - COLUMN} more
                  </Link>
                )}
              </div>
            );
          })}
          <div className="rail__card rail__card--end">
            <p>Every breed, decade by decade, with the ones that give no date at the end.</p>
            <Link className="btn" href="/timeline/">
              See the timeline
            </Link>
          </div>
        </Rail>
      </Scene>

      <Scene span={2.8} className="animal" labelledBy="animal-title">
        <div className="animal__in">
          <div className="animal__film">
            <ScrubFilm name="eye" width={720} height={1280} alt="The yellow eye of a black cat, very close, its pupil a narrow upright slit" />
          </div>
          <div className="animal__text">
            <h2 id="animal-title">{BREEDS.length} breeds, one animal</h2>
            <ol className="animal__facts">
              {FINDINGS.map((finding, index) => (
                <li
                  key={finding.figure}
                  className="cue"
                  style={{ '--in': (0.04 + index * 0.3).toFixed(2), ...(index < FINDINGS.length - 1 ? { '--out': (0.36 + index * 0.3).toFixed(2) } : {}) } as CSSProperties}
                >
                  <p className="animal__fig">{finding.figure}</p>
                  <p>{finding.text}</p>
                  <p className="cite">
                    <a className="link" href={SOURCES[finding.from].url}>
                      {short(finding.from)}
                    </a>
                  </p>
                </li>
              ))}
            </ol>
            <Link className="btn" href="/guide/">
              Read the guide
            </Link>
          </div>
        </div>
      </Scene>

      <section className="section close" aria-labelledby="closing-title">
        <div className="wrap">
          <h2 id="closing-title">
            All {BREEDS.length}, from {BREEDS[0].name} to {BREEDS[BREEDS.length - 1].name}.
          </h2>
          <div className="tiles tiles--row" data-in>
            {closing.map((breed) => (
              <BreedTile key={breed.id} breed={toTile(breed)} sizes="(min-width: 60rem) 15vw, 46vw" />
            ))}
          </div>
          <div className="close__find">
            <SearchPlate label={`Search ${BREEDS.length} breeds and ${PLACE_ENTRIES.length} places`} />
            <Link className="btn btn--quiet" href="/breeds/">
              Browse A to Z
            </Link>
          </div>

          <ul className="ways" data-in>
            <li>
              <Link href="/articles/">
                <span className="ways__fig">{ARTICLES.length}</span>
                <span className="ways__say">Short articles on living with a cat: feeding, water, the litter tray, teeth, play, and how to read one.</span>
                <span className="ways__go">
                  Articles
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </span>
              </Link>
            </li>
            <li>
              <Link href="/sizes/">
                <span className="ways__fig">{top.kg} kg</span>
                <span className="ways__say">
                  As heavy as the source says any breed gets: the {top.names}. Every breed on one scale, by weight, height or life span.
                </span>
                <span className="ways__go">
                  Sizes
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </span>
              </Link>
            </li>
            <li>
              <Link href="/words/">
                <span className="ways__fig">{word.breeds.length}</span>
                <span className="ways__say">
                  Breeds the source calls {word.word}. All {WORDS.length} of the words it uses for temperament, counted.
                </span>
                <span className="ways__go">
                  In a word
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </span>
              </Link>
            </li>
            <li>
              <Link href="/care/">
                <span className="ways__fig">5</span>
                <span className="ways__say">Things every cat needs from the place it lives, whatever its breed, and what to keep away from one.</span>
                <span className="ways__go">
                  What a cat needs
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </span>
              </Link>
            </li>
            <li>
              <Link href="/credits/">
                <span className="ways__fig">{COMMONS.length}</span>
                <span className="ways__say">Photographs from Wikimedia Commons, each under the name of the person who took it.</span>
                <span className="ways__go">
                  Credits
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
