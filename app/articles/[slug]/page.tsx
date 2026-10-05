import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, CHECKED, COVER_SIZE, articleBySlug } from '@/lib/articles';
import { AUTHOR, SITE } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articleBySlug((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: `${article.dek} ${article.short[0]}`,
    alternates: { canonical: `/articles/${article.slug}/` },
    openGraph: { type: 'article', title: article.title, description: article.dek, images: [{ url: article.cover.src, ...COVER_SIZE, alt: article.cover.alt }] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = articleBySlug((await params).slug);
  if (!article) notFound();

  const at = ARTICLES.indexOf(article);
  const next = ARTICLES[(at + 1) % ARTICLES.length];
  const data = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.dek,
    image: `${SITE}${article.cover.src}`,
    articleSection: article.topic,
    inLanguage: 'en',
    author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    mainEntityOfPage: `${SITE}/articles/${article.slug}/`,
    citation: article.sources.map((source) => source.url),
  });

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />
      <article className="piece">
        <header className="piece__head">
          <Link className="crumb" href="/articles/">
            <ArrowLeft size={18} weight="bold" aria-hidden="true" />
            Articles
          </Link>
          <h1>{article.title}</h1>
          <p className="piece__dek">{article.dek}</p>
          <p className="piece__meta">
            {article.topic}, a {article.minutes} minute read. Sources checked in {CHECKED}.
          </p>
        </header>

        <figure className="piece__cover">
          <Image src={article.cover.src} alt={article.cover.alt} {...COVER_SIZE} sizes="(min-width: 70rem) 64rem, 92vw" quality={82} preload />
          <figcaption className="by">
            Photo:{' '}
            <a className="link" href={article.cover.page}>
              {article.cover.by}
            </a>
            , {article.cover.licence}
          </figcaption>
        </figure>

        <div className="piece__body">
          <aside className="piece__short" aria-labelledby="short">
            <h2 id="short">The short version</h2>
            <ul>
              {article.short.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </aside>

          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          {article.more && (
            <p className="piece__more">
              <Link className="link" href={article.more.href}>
                {article.more.label}
              </Link>
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </p>
          )}

          <section className="piece__sources" aria-labelledby="sources">
            <h2 id="sources">Where this comes from</h2>
            <ul>
              {article.sources.map((source) => (
                <li key={source.url}>
                  {source.who}.{' '}
                  <a className="link" href={source.url}>
                    {source.title}
                  </a>
                  .
                </li>
              ))}
            </ul>
            <p>This is a summary of what those sources say. It is not advice about your cat: if something is wrong, ask a vet.</p>
          </section>
        </div>
      </article>

      <div className="wrap">
        <Link className="piece__next" href={`/articles/${next.slug}/`}>
          <span>Next</span>
          <span className="piece__next-title">{next.title}</span>
          <ArrowRight size={24} weight="bold" aria-hidden="true" />
        </Link>
        <div className="page-foot" />
      </div>
    </main>
  );
}
