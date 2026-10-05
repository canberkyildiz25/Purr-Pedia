'use client';

import { BookmarkSimple, Scales } from '@phosphor-icons/react';
import { useState } from 'react';
import { useCatalogue, useHydrated } from '@/lib/store';

/** Keeps a breed on the visitor's list, in this browser. */
export function SaveButton({ slug, name }: { slug: string; name: string }) {
  const hydrated = useHydrated();
  const kept = useCatalogue((state) => state.saved.includes(slug));
  const toggle = useCatalogue((state) => state.toggleSaved);
  const on = hydrated && kept;
  return (
    <button type="button" className="btn btn--quiet" aria-pressed={on} aria-label={`${on ? 'Saved' : 'Save'}: ${name}`} onClick={() => toggle(slug)}>
      <BookmarkSimple size={20} weight={on ? 'fill' : 'bold'} aria-hidden="true" />
      {on ? 'Saved' : 'Save'}
    </button>
  );
}

/** Puts a breed on the compare page. A fourth choice pushes the oldest one out. */
export function CompareButton({ slug, name }: { slug: string; name: string }) {
  const hydrated = useHydrated();
  const picked = useCatalogue((state) => state.compare.includes(slug));
  const toggle = useCatalogue((state) => state.toggleCompare);
  const on = hydrated && picked;
  return (
    <button type="button" className="btn btn--quiet" aria-pressed={on} aria-label={`${on ? 'On the compare page' : 'Compare'}: ${name}`} onClick={() => toggle(slug)}>
      <Scales size={20} weight={on ? 'fill' : 'bold'} aria-hidden="true" />
      {on ? 'Comparing' : 'Compare'}
    </button>
  );
}

/** Removes everything this site keeps in the browser. */
export function EraseButton() {
  const [erased, setErased] = useState(false);
  const reset = useCatalogue((state) => state.reset);
  const erase = () => {
    reset();
    useCatalogue.persist.clearStorage();
    try {
      localStorage.removeItem('theme');
    } catch {
      /* storage is blocked, so there was nothing to remove */
    }
    delete document.documentElement.dataset.theme;
    setErased(true);
  };
  return (
    <>
      <button type="button" className="btn btn--quiet" onClick={erase}>
        Erase what this site has stored
      </button>
      <p className="status" role="status">
        {erased && 'Erased. Nothing from Catalogue is stored in this browser now.'}
      </p>
    </>
  );
}
