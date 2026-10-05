import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import { COMMONS, WIKI_FETCHED } from '@/lib/catalogue';
import { FILMS, STOCK, STOCK_LICENCES } from '@/lib/sources';
import { DATA_SOURCE, REPO } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Credits',
  description: 'Who took the photographs and films that come from Wikimedia Commons, the licence each one is shown under, the stock films, and what else the site is made from.',
  alternates: { canonical: '/credits/' },
};

const when = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${WIKI_FETCHED}T00:00:00Z`));

/** A licence by its short name, linked to its text where it has one. */
function Licence({ name, url }: { name: string; url: string | null }) {
  return url ? (
    <a className="link" href={url}>
      {name}
    </a>
  ) : (
    <>{name}</>
  );
}

export default function Credits() {
  const breeds = new Set(COMMONS.map((entry) => entry.breed.id)).size;

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>Credits.</h1>
        <p>Who took the photographs and films that come from Wikimedia Commons, and the terms each one is shown under.</p>
      </div>

      <section className="credits" aria-labelledby="photographs">
        <h2 id="photographs">Photographs from Wikimedia Commons</h2>
        <p className="credits__lede">
          {`${COMMONS.length} photographs of ${breeds} breeds, taken from each breed’s category on Commons or from its Wikipedia article on ${when}. Each was resized to fit 1600 pixels and nothing else was changed. The name leads to the original and its full record.`}
        </p>
        <div className="credits__head" aria-hidden="true">
          <span>Breed</span>
          <span>Photograph</span>
          <span>By</span>
          <span>Licence</span>
        </div>
        <ul className="credits__list">
          {COMMONS.map(({ breed, photo }, index) => (
            <li key={photo.id}>
              {/* a breed's name is printed once, at the first of its photographs */}
              <span className={index > 0 && COMMONS[index - 1].breed.id === breed.id ? 'sr-only' : undefined}>
                <Link className="link" href={`/breeds/${breed.slug}/`}>
                  {breed.name}
                </Link>
              </span>
              <span>
                <a className="link" href={photo.credit.page}>
                  {photo.credit.title.replace(/\.(jpe?g|png)$/i, '')}
                </a>
              </span>
              <span>
                <span className="sr-only">by </span>
                {photo.credit.by}
              </span>
              <span>
                <Licence name={photo.credit.licence} url={photo.credit.licenceUrl} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="credits" aria-labelledby="covers">
        <h2 id="covers">Article covers</h2>
        <p className="credits__lede">
          The photograph at the head of each article is also from Commons. Each was cut to fit and resized to 2000 pixels; nothing else was
          changed. Where a licence asks that changed copies be shared the same way, these are.
        </p>
        <div className="credits__head" aria-hidden="true">
          <span>Article</span>
          <span>Photograph</span>
          <span>By</span>
          <span>Licence</span>
        </div>
        <ul className="credits__list">
          {ARTICLES.map(({ slug, title, cover }) => (
            <li key={slug}>
              <span>
                <Link className="link" href={`/articles/${slug}/`}>
                  {title}
                </Link>
              </span>
              <span>
                <a className="link" href={cover.page}>
                  {cover.title.replace(/\.(jpe?g|png)$/i, '')}
                </a>
              </span>
              <span>
                <span className="sr-only">by </span>
                {cover.by}
              </span>
              <span>
                <Licence name={cover.licence} url={cover.licenceUrl} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="credits" aria-labelledby="films">
        <h2 id="films">Films</h2>
        <p className="credits__lede">
          The five films on the guide page are also from Commons. Each was shortened to a few seconds, resized to 960 by 540 and had its sound removed.
          Where a licence asks that changed copies be shared the same way, these are.
        </p>
        <div className="credits__head credits__head--films" aria-hidden="true">
          <span>Film</span>
          <span>By</span>
          <span>Licence</span>
        </div>
        <ul className="credits__list credits__list--films">
          {FILMS.map((film) => (
            <li key={film.key}>
              <span>
                <a className="link" href={film.page}>
                  {film.title.replace(/(\.gk)?\.webm$/i, '')}
                </a>
              </span>
              <span>
                <span className="sr-only">by </span>
                {film.by}
              </span>
              <span>
                <Licence name={film.licence} url={film.licenceUrl} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="credits" aria-labelledby="stock">
        <h2 id="stock">Stock films</h2>
        <p className="credits__lede">
          The two films the wheel plays on the home page are free stock. Neither licence asks for credit; they are listed anyway. The kitten was
          filmed on a cyan backdrop, which was turned white, and only the part of the frame it sits in is used.
        </p>
        <ul className="credits__list credits__list--films">
          {STOCK.map((item) => (
            <li key={item.key}>
              <span>
                <a className="link" href={item.page}>
                  {item.page.split('/').slice(-2)[0].replace(/-\d+$/, '').replace(/-/g, ' ')}
                </a>
              </span>
              <span>
                <span className="sr-only">by </span>
                {item.by ?? item.from}
              </span>
              <span>
                <a className="link" href={STOCK_LICENCES[item.from]}>
                  {item.from} licence
                </a>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="about">
        <section aria-labelledby="first">
          <h2 id="first">The other photographs</h2>
          <p>
            The rest come from{' '}
            <a className="link" href={DATA_SOURCE.url}>
              {DATA_SOURCE.name}
            </a>
            , which does not say who took them. They are shown from its own servers and are not copied here.
          </p>
          <p>
            If one of them is yours and you would like your name on it, or would like it gone,{' '}
            <a className="link" href={`${REPO}/issues`}>
              open an issue
            </a>{' '}
            and it will be done.
          </p>
        </section>
        <section aria-labelledby="rest">
          <h2 id="rest">Everything else</h2>
          <p>
            The opening lines quoted on breed pages are from Wikipedia, under CC BY-SA 4.0. The plate of a falling cat is by Étienne-Jules Marey, 1894,
            and out of copyright.
          </p>
          <p>
            The coastline on the map is Natural Earth&rsquo;s, which is in the public domain. The typeface is Instrument Sans, under the SIL Open Font
            License. The icons are Phosphor, under the MIT licence.
          </p>
        </section>
      </div>
    </main>
  );
}
