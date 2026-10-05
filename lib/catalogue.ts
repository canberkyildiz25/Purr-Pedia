import source from '@/data/source.json';
import wikimedia from '@/data/wikimedia.json';
import { eraOf, type Era } from './eras';
import { PLACES, REGIONS, type Place, type RegionKey } from './regions';

/* Turns the two snapshots into the catalogue. The records are tidied, never
   improved: fields are parsed and grouped, broken records are left out, and
   nothing is filled in that the source does not say. Wikipedia and Wikimedia
   Commons add photographs and an article to an entry; they never change a
   field of it. */

/** Who took a photograph from Wikimedia Commons, and on what terms it may be shown. */
export interface PhotoCredit {
  title: string;
  by: string;
  licence: string;
  licenceUrl: string | null;
  page: string;
}

export interface Photo {
  id: string;
  url: string;
  w: number;
  h: number;
  /** Where the cat is, as percentages from the left and the top. Missing when the photograph needed no crop to find it. */
  fx?: number | null;
  fy?: number | null;
  /** Present on photographs from Commons. The first source does not name its photographers. */
  credit?: PhotoCredit;
}

/** The breed's article on Wikipedia, where it has one of its own. */
export interface Article {
  title: string;
  url: string;
  extract: string;
}

export type CoatKey = 'short' | 'semi' | 'long' | 'either' | 'rex' | 'hairless' | 'hybrid' | 'varies';

export const COATS: Record<CoatKey, string> = {
  short: 'Shorthair',
  semi: 'Semi-longhair',
  long: 'Longhair',
  either: 'Short or long',
  rex: 'Rex (curly)',
  hairless: 'Hairless',
  hybrid: 'Hybrid',
  varies: 'Varies',
};

export type Range = [low: number, high: number];

export interface Breed {
  id: string;
  slug: string;
  name: string;
  places: Place[];
  region: RegionKey;
  coat: CoatKey;
  /** Kilograms. */
  weight: Range | null;
  /** Centimetres at the shoulder. */
  height: Range | null;
  /** Years. */
  life: Range | null;
  words: string[];
  description: string;
  history: string | null;
  photos: Photo[];
  article: Article | null;
  era: Era;
  /** False for the entries whose own history says "not a breed". */
  isBreed: boolean;
}

/* The source types its sentences with straight quotes. Set them properly;
   the words stay as they are. */
const typeset = (text: string) =>
  text
    .replace(/(^|[\s(\[])'/g, '$1\u2018')
    .replace(/'/g, '\u2019')
    .replace(/(^|[\s(\[])"/g, '$1\u201c')
    .replace(/"/g, '\u201d')
    .replace(/\.\.\./g, '\u2026');

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const range = (text: string | null): Range | null => {
  const match = text?.match(/^\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*$/);
  return match ? [Number(match[1]), Number(match[2])] : null;
};

function coatOf(group: string | null): CoatKey {
  const text = (group ?? '').toLowerCase();
  if (text.includes('hybrid')) return 'hybrid';
  if (text.includes('hairless')) return 'hairless';
  if (text.includes('rex')) return 'rex';
  if (text === 'short/long-hair') return 'either';
  if (text.includes('semi') || text.includes('medium')) return 'semi';
  if (text.startsWith('long')) return 'long';
  if (text.startsWith('short')) return 'short';
  return 'varies';
}

/* The temperament field is mostly single words, with a few notes about
   grooming mixed in and some words written two ways. */
const SAME: Record<string, string> = {
  'easy going': 'easygoing',
  sociable: 'social',
  'sweet-tempered': 'sweet',
  'highly intelligent': 'intelligent',
  'highly interactive': 'interactive',
  'extremely affectionate': 'affectionate',
  'easily leash-trained': 'trainable',
};
function wordsOf(text: string | null): string[] {
  const words = (text ?? '')
    .split(',')
    .map((word) =>
      word
        .trim()
        .toLowerCase()
        .replace(/^varies (widely|by individual) - typically /, ''),
    )
    .filter((word) => word && !/grooming|skin care|brushing|not applicable/.test(word))
    .map((word) => SAME[word] ?? word);
  return [...new Set(words)];
}

const placesOf = (origin: string | null): Place[] =>
  (origin ?? '')
    .split('/')
    .map((part) => PLACES[part.trim()])
    .filter((place): place is Place => Boolean(place));

interface CommonsPhoto extends PhotoCredit {
  id: string;
  url: string;
  w: number;
  h: number;
  fx: number;
  fy: number;
  full: number;
}
interface WikiEntry extends Article {
  photos: CommonsPhoto[];
}
const WIKI = wikimedia.entries as Record<string, WikiEntry | undefined>;
/** Photographs chosen by eye from a breed's own category on Commons. The first one leads. */
const CHOSEN = (wikimedia as { chosen?: Record<string, CommonsPhoto[] | undefined> }).chosen ?? {};

const fromCommons = (photo: CommonsPhoto): Photo => ({
  id: photo.id,
  url: photo.url,
  w: photo.w,
  h: photo.h,
  fx: photo.fx,
  fy: photo.fy,
  credit: { title: photo.title, by: photo.by, licence: photo.licence, licenceUrl: photo.licenceUrl, page: photo.page },
});

/* Which of the first source's photographs leads, for the few breeds where its
   first is not its best. Chosen by looking at them side by side. */
const LEADS: Record<string, string> = { awir: 'Q6TDnfM_O', csho: 'aAf-WmnRl', cymr: 'WXcD6qZEn', java: 'UYBsKV2Gg' };

/* Where photographs were chosen for a breed, they come first: then the
   larger of the first source's, then the ones its article shows. Where none
   were, the first source's come first, and Commons leads only if the first
   source has nothing, or nothing a full page can show sharply. */
function photosOf(id: string): Photo[] {
  const sent = (source.photos as Record<string, Photo[]>)[id] ?? [];
  const own = [...sent].sort((a, b) => Number(b.id === LEADS[id]) - Number(a.id === LEADS[id]));
  const chosen = (CHOSEN[id] ?? []).map(fromCommons);
  const article = (WIKI[id]?.photos ?? []).map(fromCommons);
  if (chosen.length) return [...chosen, ...own.filter((photo) => photo.w >= 1200).slice(0, 3), ...article];
  const thin = own.length > 0 && own[0].w < 1000;
  return own.length === 0 || (thin && article.length > 0) ? [...article, ...own] : [...own, ...article];
}

function build(): Breed[] {
  const seen = new Set<string>();
  const breeds: Breed[] = [];
  for (const row of source.breeds) {
    // Seven records arrive with no origin and no history, and with sentences
    // in the weight and height columns. They cannot be filed, so they are
    // left out. One breed is listed twice; the second copy is skipped.
    if (!row.origin && !row.history) continue;
    if (seen.has(row.name)) continue;
    seen.add(row.name);

    const places = placesOf(row.origin);
    breeds.push({
      id: row.id,
      slug: slugify(row.name),
      name: row.name,
      places,
      region: places[0]?.region ?? 'everywhere',
      coat: coatOf(row.breed_group),
      weight: range(row.weight),
      height: range(row.height),
      life: range(row.life_span),
      words: wordsOf(row.temperament),
      description: typeset(row.description ?? ''),
      history: row.history ? typeset(row.history) : null,
      photos: photosOf(row.id),
      article: WIKI[row.id] ? { title: WIKI[row.id]!.title, url: WIKI[row.id]!.url, extract: typeset(WIKI[row.id]!.extract) } : null,
      era: eraOf(row.id),
      isBreed: !/^not a breed\b/i.test(row.history ?? '') && !/not a breed but a trait/i.test(row.history ?? ''),
    });
  }
  return breeds.sort((a, b) => a.name.localeCompare(b.name));
}

export const BREEDS: Breed[] = build();
export const FETCHED: string = source.fetched;
/** The day Wikipedia and Commons were read. */
export const WIKI_FETCHED: string = wikimedia.fetched;
/** How many records the source sent, before the broken and repeated ones were set aside. */
export const SOURCE_COUNT: number = source.breeds.length;

export const breedBySlug = (slug: string) => BREEDS.find((breed) => breed.slug === slug);

export const breedsIn = (region: RegionKey) => BREEDS.filter((breed) => breed.region === region);

/** Every place that has at least one breed, with its breeds. A breed with two
    origins is listed under both. */
export interface PlaceEntry {
  place: Place;
  breeds: Breed[];
}
export const PLACE_ENTRIES: PlaceEntry[] = Object.values(PLACES)
  .map((place) => ({ place, breeds: BREEDS.filter((breed) => breed.places.some((own) => own.slug === place.slug)) }))
  .filter((entry) => entry.breeds.length > 0)
  .sort((a, b) => b.breeds.length - a.breeds.length || a.place.name.localeCompare(b.place.name));

export const placesIn = (region: RegionKey) => PLACE_ENTRIES.filter((entry) => entry.place.region === region);

export const REGION_COUNTS = REGIONS.map((region) => ({ region, count: breedsIn(region.key).length }));

/** Oldest first: the old natural breeds, then the dated ones in order, then the rest by name. */
export function byAge(a: Breed, b: Breed) {
  const rank = (breed: Breed) => (breed.era.kind === 'old' ? 0 : breed.era.kind === 'dated' ? breed.era.year : 9999);
  return rank(a) - rank(b) || a.name.localeCompare(b.name);
}

/** Breeds from the same place, or failing that the same region, nearest in age first. */
export function neighbours(breed: Breed, limit = 4): Breed[] {
  const own = new Set(breed.places.map((place) => place.slug));
  const samePlace = BREEDS.filter((other) => other.id !== breed.id && other.places.some((place) => own.has(place.slug)));
  const sameRegion = BREEDS.filter((other) => other.id !== breed.id && other.region === breed.region && !samePlace.includes(other));
  const withPhoto = (list: Breed[]) => [...list].sort((a, b) => Number(b.photos.length > 0) - Number(a.photos.length > 0) || byAge(a, b));
  return [...withPhoto(samePlace), ...withPhoto(sameRegion)].slice(0, limit);
}

/** A place name as it reads inside a sentence: "the United Kingdom", but "Thailand". */
export const the = (name: string) => (/^(United|Isle)\b/.test(name) ? `the ${name}` : name);

export const originPhrase = (breed: Breed) => breed.places.map((place) => the(place.name)).join(' and ');

export const originLabel = (breed: Breed) => (breed.places.length ? breed.places.map((place) => place.name).join(' and ') : 'No single place');

/** The first whole sentences of an article's opening, up to about 380 characters. */
export function opening(extract: string): string {
  let text = '';
  for (const sentence of extract.split(/(?<=[.!?]["”’]?)\s+(?=[A-Z"“‘'(])/)) {
    if (text && `${text} ${sentence}`.length > 380) break;
    text = text ? `${text} ${sentence}` : sentence;
  }
  return text.trim();
}

/** The smallest and the largest figure the source gives any breed, for each measure. */
function extent(pick: (breed: Breed) => Range | null): Range {
  const all = BREEDS.flatMap((breed) => pick(breed) ?? []);
  return [Math.min(...all), Math.max(...all)];
}
export const EXTENT = { weight: extent((breed) => breed.weight), height: extent((breed) => breed.height), life: extent((breed) => breed.life) };

/** Every range the source gives, per measure: what one breed's range is set against. */
export const RANGES = {
  weight: BREEDS.flatMap((breed) => (breed.weight ? [breed.weight] : [])),
  height: BREEDS.flatMap((breed) => (breed.height ? [breed.height] : [])),
  life: BREEDS.flatMap((breed) => (breed.life ? [breed.life] : [])),
};

/** The top of the weight scale, and every breed that reaches it. */
export function heaviest(): { kg: number; names: string } {
  const top = Math.max(...BREEDS.map((breed) => breed.weight?.[1] ?? 0));
  const names = BREEDS.filter((breed) => breed.weight?.[1] === top).map((breed) => breed.name);
  return { kg: top, names: names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] };
}

export const kg = (weight: Range) => `${weight[0]} to ${weight[1]} kg`;
export const cm = (height: Range) => `${height[0]} to ${height[1]} cm`;
export const years = (life: Range) => `${life[0]} to ${life[1]} years`;

export function eraLabel(breed: Breed): string {
  if (breed.era.kind === 'dated') return breed.era.label;
  return breed.era.kind === 'old' ? 'Old natural breed' : 'No date given';
}

/** What a tile needs, small enough to hand to the browser for every breed. */
export interface TileData {
  slug: string;
  name: string;
  region: RegionKey;
  place: string;
  photo: Photo | null;
}
export function toTile(breed: Breed): TileData {
  const lead = breed.photos[0];
  // a tile does not show the credit, so it does not carry it
  const photo = lead ? { id: lead.id, url: lead.url, w: lead.w, h: lead.h, fx: lead.fx, fy: lead.fy } : null;
  return { slug: breed.slug, name: breed.name, region: breed.region, place: originLabel(breed), photo };
}

/** Every photograph that came from Commons, with the breed it stands for. */
export const COMMONS: { breed: Breed; photo: Photo & { credit: PhotoCredit } }[] = BREEDS.flatMap((breed) =>
  breed.photos.filter((photo): photo is Photo & { credit: PhotoCredit } => Boolean(photo.credit)).map((photo) => ({ breed, photo })),
);

/** The source's words for temperament, most used first, each with its breeds. */
export interface WordEntry {
  word: string;
  slug: string;
  breeds: Breed[];
}
export const WORDS: WordEntry[] = [...new Set(BREEDS.flatMap((breed) => breed.words))]
  .map((word) => ({ word, slug: slugify(word), breeds: BREEDS.filter((breed) => breed.words.includes(word)) }))
  .sort((a, b) => b.breeds.length - a.breeds.length || a.word.localeCompare(b.word));

export const wordSlug = (word: string) => slugify(word);
export const wordBySlug = (slug: string) => WORDS.find((entry) => entry.slug === slug);

/** A word has a page of its own when more than one breed shares it. */
export const hasPage = (entry: WordEntry) => entry.breeds.length > 1;

/** The words most often given alongside this one, with how many breeds have both. */
export function saidWith(entry: WordEntry, limit = 5): { other: WordEntry; both: number }[] {
  return WORDS.filter((other) => other.word !== entry.word)
    .map((other) => ({ other, both: other.breeds.filter((breed) => entry.breeds.includes(breed)).length }))
    .filter((pair) => pair.both > 1)
    .sort((a, b) => b.both - a.both || a.other.word.localeCompare(b.other.word))
    .slice(0, limit);
}

/** What can be counted about a region: how many of its breeds are old natural
    ones, how many have a date, and which dated ones are first and last. */
export function regionFacts(region: RegionKey) {
  const breeds = breedsIn(region);
  const dated = breeds
    .filter((breed): breed is Breed & { era: { kind: 'dated'; year: number; decade: number; label: string } } => breed.era.kind === 'dated')
    .sort((a, b) => a.era.year - b.era.year || a.name.localeCompare(b.name));
  return {
    count: breeds.length,
    places: placesIn(region).length,
    old: breeds.filter((breed) => breed.era.kind === 'old').length,
    dated: dated.length,
    first: dated[0],
    last: dated[dated.length - 1],
  };
}

/** The same facts as a sentence or two, for the head of a region's page. */
export function regionLine(region: RegionKey): string {
  const facts = regionFacts(region);
  if (region === 'everywhere') return 'Entries the source files under the whole world.';
  const parts: string[] = [];
  if (facts.old) parts.push(`${facts.old} old natural ${facts.old === 1 ? 'breed' : 'breeds'} with no founding date.`);
  if (facts.dated > 1 && facts.first && facts.last) parts.push(`${facts.dated} with a date, from ${facts.first.name} (${facts.first.era.label}) to ${facts.last.name} (${facts.last.era.label}).`);
  else if (facts.first) parts.push(`One with a date: ${facts.first.name}, ${facts.first.era.label}.`);
  return parts.join(' ');
}
