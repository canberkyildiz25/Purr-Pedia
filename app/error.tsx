'use client';

import Link from 'next/link';

/** Shown in place of a page that failed while it was being drawn. */
export default function PageError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>This page did not load properly.</h1>
        <p>The fault is in the site, not in anything you did. Trying again usually clears it, and nothing you saved is lost.</p>
        <div className="hero__actions">
          <button type="button" className="btn" onClick={reset}>
            Try again
          </button>
          <Link className="btn btn--quiet" href="/">
            Open the atlas
          </Link>
        </div>
      </div>
      <div className="page-foot" />
    </main>
  );
}
