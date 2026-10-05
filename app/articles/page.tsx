import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ARTICLES, COVER_SIZE, TOPICS, articlesIn, type Article } from '@/lib/articles';
import { BREEDS } from '@/lib/catalogue';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Short, sourced articles on living with a cat: what to feed it, how much it should drink, the litter tray, teeth, play, and how to read what it is telling you.',
  alternates: { canonical: '/articles/' },
};

function Card({ article, sizes, lead = false }: { article: Article; sizes: string; lead?: boolean }) {
  return (
    <Link className="story-card" href={`/articles/${article.slug}/`}>
      <span className="story-card__photo">
        <Image src={article.cover.src} alt="" {...COVER_SIZE} sizes={sizes} quality={82} preload={lead} loading={lead ? 'eager' : 'lazy'} />
      </span>
      <span className="story-card__meta">
        {article.topic}, {article.minutes} min
      </span>
      <span className="story-card__title">{article.title}</span>
      <span className="story-card__dek">{article.dek}</span>
    </Link>
  );
}

export default function Articles() {
  const [first, ...rest] = ARTICLES;
  const next = rest.slice(0, 2);

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>Articles</h1>
        <p>
          Living with a cat, in {ARTICLES.length} short pieces. Each one says where its facts come from, and none of them is advice about your cat in
          particular: for that there is a vet.
        </p>
      </div>

      <div className="stories stories--lead" data-in>
        <Card article={first} sizes="(min-width: 60rem) 56vw, 92vw" lead />
        <div className="stories__side">
          {next.map((article) => (
            <Card key={article.slug} article={article} sizes="(min-width: 60rem) 28vw, 92vw" />
          ))}
        </div>
      </div>

      {TOPICS.map((topic) => (
        <section key={topic.key} className="topic" aria-labelledby={`topic-${topic.key.toLowerCase()}`}>
          <div className="topic__head">
            <h2 id={`topic-${topic.key.toLowerCase()}`}>{topic.key}</h2>
            <p>{topic.say}</p>
          </div>
          <div className="stories" data-in>
            {articlesIn(topic.key).map((article) => (
              <Card key={article.slug} article={article} sizes="(min-width: 60rem) 28vw, 92vw" />
            ))}
          </div>
        </section>
      ))}

      <ul className="ways" data-in>
        <li>
          <Link href="/guide/">
            <span className="ways__fig">The guide</span>
            <span className="ways__say">What all {BREEDS.length} breeds have in common, in five short films and sixteen studies.</span>
            <span className="ways__go">
              One animal
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/care/">
            <span className="ways__fig">Five needs</span>
            <span className="ways__say">What a cat needs from the place it lives, as the two main bodies of cat vets set it out.</span>
            <span className="ways__go">
              What a cat needs
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </span>
          </Link>
        </li>
      </ul>
      <div className="page-foot" />
    </main>
  );
}
