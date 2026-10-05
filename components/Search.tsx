'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { TileData } from '@/lib/catalogue';
import type { RegionKey } from '@/lib/regions';
import { CatPhoto } from './CatPhoto';

interface Index {
  breeds: (TileData & { words: string[] })[];
  places: { title: string; note: string; href: string; region: RegionKey }[];
  articles: { title: string; note: string; href: string; text: string }[];
  pages: { title: string; note: string; href: string }[];
}

interface Hit {
  group: 'Breeds' | 'Places' | 'Articles' | 'Pages';
  title: string;
  note: string;
  href: string;
  region?: RegionKey;
  photo?: TileData['photo'];
}

/** Anything on the page can ask for the search box with this event. */
export const OPEN_SEARCH = 'catalogue:search';

/* What the box offers before anything is typed. */
const FIRST = ['maine-coon', 'siamese', 'british-shorthair', 'bengal', 'turkish-van'];

const never = () => () => {};
/** The shortcut as this machine writes it. The server cannot know, so it says Ctrl. */
const useShortcut = () =>
  useSyncExternalStore(
    never,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K'),
    () => 'Ctrl K',
  );

function find(index: Index, query: string): Hit[] {
  const q = query.trim().toLowerCase();
  const breed = (item: Index['breeds'][number]): Hit => ({ group: 'Breeds', title: item.name, note: item.place, href: `/breeds/${item.slug}/`, region: item.region, photo: item.photo });
  const place = (item: Index['places'][number]): Hit => ({ group: 'Places', ...item });
  const page = (item: Index['pages'][number]): Hit => ({ group: 'Pages', ...item });
  const article = (item: Index['articles'][number]): Hit => ({ group: 'Articles', title: item.title, note: item.note, href: item.href });

  if (!q) return [...FIRST.flatMap((slug) => index.breeds.find((item) => item.slug === slug) ?? []).map(breed), ...index.pages.slice(0, 5).map(page)];

  // a name that starts with what was typed comes first, then a word inside the
  // name, then the place, then the words the source uses for the breed
  const rank = (item: Index['breeds'][number]) => {
    const name = item.name.toLowerCase();
    if (name.startsWith(q)) return 0;
    if (name.includes(` ${q}`)) return 1;
    if (name.includes(q)) return 2;
    if (item.place.toLowerCase().includes(q)) return 3;
    return item.words.some((word) => word.startsWith(q)) ? 4 : -1;
  };
  const breeds = index.breeds
    .map((item) => ({ item, at: rank(item) }))
    .filter((entry) => entry.at >= 0)
    .sort((a, b) => a.at - b.at || a.item.name.localeCompare(b.item.name))
    .slice(0, 7)
    .map((entry) => breed(entry.item));
  const places = index.places.filter((item) => item.title.toLowerCase().includes(q)).slice(0, 4).map(place);
  // an article is found by its title, or by a word in its summary that starts with what was typed
  const articles = index.articles
    .filter((item) => item.title.toLowerCase().includes(q) || item.text.split(/[^a-z]+/).some((word) => word.startsWith(q)))
    .slice(0, 4)
    .map(article);
  const pages = index.pages.filter((item) => `${item.title} ${item.note}`.toLowerCase().includes(q)).slice(0, 3).map(page);
  return [...breeds, ...places, ...articles, ...pages];
}

/** The same search, asked for from the page itself: a field-shaped button. */
export function SearchPlate({ label }: { label: string }) {
  return (
    <button type="button" className="plate-search" onClick={() => dispatchEvent(new Event(OPEN_SEARCH))}>
      <MagnifyingGlass size={22} weight="bold" aria-hidden="true" />
      {label}
    </button>
  );
}

/** The search box in the bar, and the list it opens: every breed, place and
    page, reachable from anywhere with the keyboard. */
export function Search() {
  const id = useId();
  const router = useRouter();
  const shortcut = useShortcut();
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<Index | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const open = useCallback(() => {
    const box = dialog.current;
    if (!box || box.open) return;
    box.showModal();
    if (index) return;
    fetch('/search.json')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: Index) => setIndex(data))
      .catch(() => setFailed(true));
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName);
      if ((event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        open();
      }
    };
    addEventListener('keydown', onKey);
    addEventListener(OPEN_SEARCH, open);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener(OPEN_SEARCH, open);
    };
  }, [open]);

  const hits = useMemo(() => (index ? find(index, query) : []), [index, query]);
  const current = Math.min(active, Math.max(hits.length - 1, 0));

  const go = (hit: Hit) => {
    dialog.current?.close();
    router.push(hit.href);
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!hits.length) return;
      const next = (current + (event.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length;
      setActive(next);
      document.getElementById(`${id}-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && hits[current]) {
      event.preventDefault();
      go(hits[current]);
    }
  };

  return (
    <>
      <button type="button" className="searchpill" onClick={open} aria-label="Search breeds, places and pages" aria-keyshortcuts="Control+K Meta+K">
        <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
        <span className="searchpill__text">Search breeds and places</span>
        <kbd className="searchpill__key" aria-hidden="true">
          {shortcut}
        </kbd>
      </button>

      <dialog
        ref={dialog}
        className="finder-box"
        aria-label="Search"
        onClose={() => {
          setQuery('');
          setActive(0);
        }}
        onClick={(event) => {
          // a click on the dimmed page around the box closes it
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="finder-box__in">
          <div className="finder-box__field">
            <MagnifyingGlass size={20} weight="bold" aria-hidden="true" />
            <input
              type="text"
              role="combobox"
              aria-label="Search breeds, places and pages"
              aria-expanded="true"
              aria-controls={`${id}-list`}
              aria-activedescendant={hits[current] ? `${id}-${current}` : undefined}
              aria-autocomplete="list"
              placeholder="A breed, a country, a question"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="go"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
            <button type="button" className="finder-box__close" onClick={() => dialog.current?.close()}>
              Esc
              <span className="sr-only">: close the search</span>
            </button>
          </div>

          <ul id={`${id}-list`} className="finder-box__list" role="listbox" aria-label="Results">
            {hits.map((hit, position) => (
              <li
                key={hit.href}
                id={`${id}-${position}`}
                role="option"
                aria-selected={position === current}
                className="hit"
                data-region={hit.region}
                data-first={position === 0 || hits[position - 1].group !== hit.group ? hit.group : undefined}
                onClick={() => go(hit)}
                onPointerMove={() => setActive(position)}
              >
                <span className="hit__mark" aria-hidden="true">
                  {hit.photo ? <CatPhoto photo={hit.photo} alt="" sizes="44px" /> : null}
                </span>
                <span className="hit__title">{hit.title}</span>
                <span className="hit__note">{hit.note}</span>
              </li>
            ))}
          </ul>

          <p className="finder-box__status" role="status">
            {failed ? 'The list could not be loaded. Try again in a moment.' : !index ? 'Opening the list.' : hits.length ? `${hits.length} ${hits.length === 1 ? 'result' : 'results'}. Arrows to move, Enter to open.` : 'Nothing by that name. Try a country or a shorter word.'}
          </p>
        </div>
      </dialog>
    </>
  );
}
