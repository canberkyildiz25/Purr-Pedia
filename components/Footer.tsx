import Link from 'next/link';
import { BREEDS, COMMONS, FETCHED, PLACE_ENTRIES } from '@/lib/catalogue';
import { AUTHOR, DATA_SOURCE, REPO } from '@/lib/site';

const when = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${FETCHED}T00:00:00Z`));

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <p className="site-footer__say">
          {BREEDS.length} breeds, {PLACE_ENTRIES.length} places, one species.
        </p>
        <div>
          <p>
            Breed records and photographs come from{' '}
            <a className="link" href={DATA_SOURCE.url}>
              {DATA_SOURCE.name}
            </a>
            {`, as it stood on ${when}. Another ${COMMONS.length} photographs, the films and the article openings are from Wikipedia and Wikimedia Commons, each under its maker’s name. Nothing here is veterinary advice.`}
          </p>
          <p>
            Catalogue is a portfolio project by {AUTHOR.name}. It keeps your saved breeds in this browser and nowhere else.
          </p>
          <nav className="site-footer__links" aria-label="More">
            <Link className="link" href="/about/">
              About the data
            </Link>
            <Link className="link" href="/credits/">
              Credits
            </Link>
            <Link className="link" href="/guide/">
              The guide
            </Link>
            <Link className="link" href="/words/">
              In a word
            </Link>
            <Link className="link" href="/care/">
              What a cat needs
            </Link>
            <a className="link" href={AUTHOR.url}>
              Canberk&rsquo;s portfolio
            </a>
            <a className="link" href={REPO}>
              Source on GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
