import type { Metadata } from 'next';
import Link from 'next/link';
import { BREEDS, WORDS, hasPage } from '@/lib/catalogue';

export const metadata: Metadata = {
  title: 'In a word',
  description: 'The words the source uses for each breed’s temperament, counted: which are said of nearly every breed, and which of only one.',
  alternates: { canonical: '/words/' },
};

export default function Words() {
  const shared = WORDS.filter(hasPage);
  const once = WORDS.filter((entry) => !hasPage(entry));
  const most = shared[0].breeds.length;
  const topThree = shared.slice(0, 3);
  const anyOfThree = BREEDS.filter((breed) => topThree.some((entry) => breed.words.includes(entry.word))).length;
  const described = BREEDS.filter((breed) => breed.words.length > 0).length;

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>In a word.</h1>
        <p>
          The source sums up each breed&rsquo;s temperament in a few words. Across {described} entries it uses {WORDS.length} different ones. Here they
          are, counted, the most used first.
        </p>
      </div>

      <ol className="wordbars">
        {shared.map((entry) => (
          <li key={entry.word}>
            <Link href={`/words/${entry.slug}/`}>{entry.word}</Link>
            <span className="wordbars__track" aria-hidden="true">
              <i style={{ width: `${(entry.breeds.length / most) * 100}%` }} />
            </span>
            <span className="wordbars__count">
              {entry.breeds.length}
              <span className="sr-only"> breeds</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="about wordnotes">
        <section aria-labelledby="once">
          <h2 id="once">Said of one breed only</h2>
          <p>
            {once.map((entry, index) => (
              <span key={entry.word}>
                {index > 0 && ', '}
                {entry.word} (
                <Link className="link" href={`/breeds/${entry.breeds[0].slug}/`}>
                  {entry.breeds[0].name}
                </Link>
                )
              </span>
            ))}
            .
          </p>
        </section>
        <section aria-labelledby="weigh">
          <h2 id="weigh">How much to read into them</h2>
          <p>
            Not much. {anyOfThree} of the {BREEDS.length} entries are called {topThree[0].word}, {topThree[1].word} or {topThree[2].word}, which says as
            much about how breeds get written up as it does about cats.
          </p>
          <p>
            These are words, not measurements. The source used to score temperament from 1 to 5 and has stopped, so nothing here ranks one breed
            above another.
          </p>
        </section>
      </div>
    </main>
  );
}
