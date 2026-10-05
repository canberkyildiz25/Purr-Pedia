import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDANCE, SOURCES } from '@/lib/sources';

export const metadata: Metadata = {
  title: 'What a cat needs',
  description: 'Five needs every cat has, as the two main bodies of cat vets set them out, and the short list of things in a home that poison cats. A summary with its sources, not advice.',
  alternates: { canonical: '/care/' },
};

/* The five headings are the guidelines' own. The line under each is a plain
   summary of what the guidelines go on to say. */
const NEEDS = [
  { need: 'A safe place', how: 'Somewhere to withdraw to that feels enclosed, often up high: a box, a shelf, a carrier left open. One for each cat in the house.' },
  { need: 'Several of everything, kept apart', how: 'Food, water, litter trays, places to scratch, play and sleep. More than one of each, in different spots, so that no cat has to pass another to reach them.' },
  { need: 'Play that works like hunting', how: 'The chance to stalk, chase, pounce and catch: toys that move, and food that has to be found or worked for.' },
  { need: 'Calm, predictable company', how: 'Contact that the cat can start and end. Most cats prefer it often and brief, and from people who behave the same way each time.' },
  { need: 'A home that smells like home', how: 'Cats mark what is theirs with scent from the face and paws. Strong cleaners and perfumes wipe those marks out.' },
];

const Ref = ({ to }: { to: keyof typeof GUIDANCE }) => (
  <p className="cite">
    <a className="link" href={GUIDANCE[to].url}>
      {GUIDANCE[to].who}
    </a>
  </p>
);

export default function Care() {
  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>What a cat needs.</h1>
        <p>
          The same five things, whatever the breed, and a short list of what to keep away from one. This is a summary of published guidance with its
          sources. It is not advice about your cat: for that, ask a vet.
        </p>
      </div>

      <section className="chapter" aria-labelledby="needs">
        <h2 id="needs">Five needs</h2>
        <p className="chapter__lede">
          In 2013 the American Association of Feline Practitioners and the International Society of Feline Medicine wrote down what a cat needs from
          the place it lives. They named five things.
        </p>
        <ol className="ledger ledger--counted">
          {NEEDS.map((entry) => (
            <li key={entry.need}>
              <h3>{entry.need}</h3>
              <p>{entry.how}</p>
            </li>
          ))}
        </ol>
        <p className="cite">
          {SOURCES.needs.who} ({SOURCES.needs.year}).{' '}
          <a className="link" href={SOURCES.needs.url}>
            {SOURCES.needs.title}
          </a>
          . {SOURCES.needs.where}.
        </p>
      </section>

      <section className="chapter" aria-labelledby="harm">
        <h2 id="harm">Keep these away from a cat</h2>
        <ul className="ledger">
          <li>
            <h3>Lilies</h3>
            <p>
              True lilies and daylilies. The whole plant is poisonous to cats: stem, leaves, flowers, pollen, even the water in the vase. The kidneys
              fail within one to three days.
            </p>
            <Ref to="lilies" />
          </li>
          <li>
            <h3>Paracetamol</h3>
            <p>Sold as acetaminophen in North America. Cats lack the liver enzymes to break it down, and it kills them. No other human painkiller should be given without a vet saying so.</p>
            <Ref to="painkillers" />
          </li>
          <li>
            <h3>Onions, garlic, chives</h3>
            <p>They damage red blood cells. Cats are more easily harmed by them than dogs are.</p>
            <Ref to="foods" />
          </li>
          <li>
            <h3>Chocolate, coffee, anything with caffeine</h3>
            <p>All three contain the same family of stimulants, which cause vomiting, an abnormal heart rhythm and seizures in pets.</p>
            <Ref to="foods" />
          </li>
          <li>
            <h3>A saucer of milk</h3>
            <p>Not a poison, but not the treat it is drawn as. Grown animals make little of the enzyme that digests milk, and it upsets the stomach.</p>
            <Ref to="foods" />
          </li>
        </ul>
        <p className="chapter__after chapter__after--strong">If a cat has eaten any of the first four, ring a vet straight away. Do not wait for it to look ill.</p>
      </section>

      <section className="chapter" aria-labelledby="food">
        <h2 id="food">Food and water</h2>
        <ul className="ledger">
          <li>
            <h3>Meat is not optional</h3>
            <p>Cats are obligate carnivores: they depend on nutrients found only in animal products.</p>
          </li>
          <li>
            <h3>Water, always</h3>
            <p>Clean and fresh, and within reach at all times.</p>
          </li>
          <li>
            <h3>Treats are a small share</h3>
            <p>As a rule of thumb, no more than 10 to 15 percent of the day&rsquo;s calories.</p>
          </li>
        </ul>
        <Ref to="feeding" />
      </section>

      <div className="refs__next refs__next--end">
        <Link className="btn" href="/guide/">
          One animal: the guide
        </Link>
        <Link className="btn btn--quiet" href="/breeds/">
          Browse A to Z
        </Link>
      </div>
    </main>
  );
}
