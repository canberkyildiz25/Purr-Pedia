'use client';

import { CircleHalf, List, X } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { useCatalogue, useHydrated } from '@/lib/store';
import { Search } from './Search';

const LINKS = [
  { href: '/', label: 'Atlas', match: (path: string) => path === '/' || path.startsWith('/regions') },
  { href: '/breeds/', label: 'A to Z', match: (path: string) => path.startsWith('/breeds') || path.startsWith('/words') },
  { href: '/timeline/', label: 'Timeline', match: (path: string) => path.startsWith('/timeline') },
  { href: '/sizes/', label: 'Sizes', match: (path: string) => path.startsWith('/sizes') },
  { href: '/articles/', label: 'Articles', match: (path: string) => path.startsWith('/articles') || path.startsWith('/guide') || path.startsWith('/care') },
  { href: '/compare/', label: 'Compare', match: (path: string) => path.startsWith('/compare') },
  { href: '/saved/', label: 'Saved', match: (path: string) => path.startsWith('/saved') },
];

const REGION_ORDER = ['americas', 'isles', 'europe', 'westasia', 'east', 'everywhere'];

/** The wordmark: the name, and the six regions as six dots. */
function Wordmark() {
  return (
    <>
      <svg className="wordmark__dots" viewBox="0 0 22 14" width="22" height="14" aria-hidden="true">
        {REGION_ORDER.map((region, index) => (
          <circle key={region} data-region={region} cx={3 + (index % 3) * 8} cy={3 + Math.floor(index / 3) * 8} r="3" />
        ))}
      </svg>
      Catalogue
    </>
  );
}

/** The seven places, once as a row in the bar and once large in the menu. */
function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const path = usePathname().replace(/\/$/, '') || '/';
  const hydrated = useHydrated();
  const saved = useCatalogue((state) => state.saved.length);
  const compare = useCatalogue((state) => state.compare.length);
  const counts: Record<string, number> = { '/saved/': hydrated ? saved : 0, '/compare/': hydrated ? compare : 0 };

  return LINKS.map((link) => (
    <Link key={link.href} className={className} href={link.href} aria-current={link.match(path) ? 'page' : undefined} onClick={onNavigate}>
      {link.label}
      {counts[link.href] > 0 && (
        <span className="count" aria-label={`${counts[link.href]} chosen`}>
          {counts[link.href]}
        </span>
      )}
    </Link>
  ));
}

export function Header() {
  const menu = useRef<HTMLDialogElement>(null);
  const openMenu = () => menu.current?.showModal();
  const closeMenu = () => menu.current?.close();

  const flip = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode: the choice lasts for this page view only */
    }
  };

  return (
    <header className="site-header">
      <div className="bar">
        <Link className="wordmark" href="/" aria-label="Catalogue, home">
          <Wordmark />
        </Link>
        <Search />
        <nav className="bar__links" aria-label="Primary">
          <NavLinks className="navlink" />
        </nav>
        <button type="button" className="iconbtn bar__theme" onClick={flip} aria-label="Switch between light and dark" title="Switch between light and dark">
          <CircleHalf size={20} weight="fill" aria-hidden="true" />
        </button>
        <button type="button" className="iconbtn bar__menu" onClick={openMenu} aria-label="Open the menu">
          <List size={22} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <dialog ref={menu} className="menu" aria-label="Menu">
        <div className="menu__in">
          <div className="menu__top">
            <span className="wordmark">
              <Wordmark />
            </span>
            <button type="button" className="iconbtn" onClick={closeMenu} aria-label="Close the menu">
              <X size={22} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Primary, small screens">
            <NavLinks onNavigate={closeMenu} />
          </nav>
        </div>
      </dialog>
    </header>
  );
}
