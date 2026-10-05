import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/articles';
import { BREEDS, WORDS, hasPage } from '@/lib/catalogue';
import { REGIONS } from '@/lib/regions';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/breeds/',
    '/timeline/',
    '/sizes/',
    '/articles/',
    '/guide/',
    '/care/',
    '/words/',
    '/compare/',
    '/about/',
    '/credits/',
    ...REGIONS.map((region) => `/regions/${region.key}/`),
    ...BREEDS.map((breed) => `/breeds/${breed.slug}/`),
    ...WORDS.filter(hasPage).map((entry) => `/words/${entry.slug}/`),
    ...ARTICLES.map((article) => `/articles/${article.slug}/`),
  ];
  return paths.map((path) => ({ url: `${SITE}${path}` }));
}
