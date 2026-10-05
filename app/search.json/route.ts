import { ARTICLES } from '@/lib/articles';
import { BREEDS, PLACE_ENTRIES, toTile } from '@/lib/catalogue';

/* What the search box looks through: every breed, every place and the pages
   of the site. Written once at build time and fetched the first time the box
   is opened, so no page carries it that does not use it. */

export const dynamic = 'force-static';

const PAGES = [
  { title: 'Atlas', note: 'The map and the six regions', href: '/#atlas' },
  { title: 'A to Z', note: 'Every breed, searchable and sortable', href: '/breeds/' },
  { title: 'Timeline', note: 'Breeds in order of appearance', href: '/timeline/' },
  { title: 'Sizes', note: 'Weight, height and life span on one scale', href: '/sizes/' },
  { title: 'Articles', note: 'Feeding, care, health and behaviour', href: '/articles/' },
  { title: 'Guide', note: 'What every cat has in common', href: '/guide/' },
  { title: 'What a cat needs', note: 'Five needs, and what to keep away', href: '/care/' },
  { title: 'In a word', note: 'The words used for temperament, counted', href: '/words/' },
  { title: 'Compare', note: 'Up to three breeds side by side', href: '/compare/' },
  { title: 'Saved', note: 'The breeds you kept', href: '/saved/' },
  { title: 'About the data', note: 'Where it all comes from', href: '/about/' },
  { title: 'Credits', note: 'Who took the photographs and films', href: '/credits/' },
];

export function GET() {
  return Response.json({
    breeds: BREEDS.map((breed) => ({ ...toTile(breed), words: breed.words })),
    places: PLACE_ENTRIES.map((entry) => ({
      title: entry.place.name,
      note: `${entry.breeds.length} ${entry.breeds.length === 1 ? 'breed' : 'breeds'}`,
      href: `/regions/${entry.place.region}/#${entry.place.slug}`,
      region: entry.place.region,
    })),
    articles: ARTICLES.map((article) => ({ title: article.title, note: article.topic, href: `/articles/${article.slug}/`, text: `${article.dek} ${article.short.join(' ')}`.toLowerCase() })),
    pages: PAGES,
  });
}
