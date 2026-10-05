import type { Metadata, Viewport } from 'next';
import { Instrument_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Header } from '@/components/Chrome';
import { Footer } from '@/components/Footer';
import { Arrivals } from '@/components/Motion';
import { ROOM } from '@/lib/room';
import { AUTHOR, DESCRIPTION, SITE } from '@/lib/site';
import './globals.css';

// One family, at three weights. Instrument Sans is narrow enough to set a long
// breed name large without shouting, and quiet enough to leave the page to the
// photographs.
const instrument = Instrument_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-instrument', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0d' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Catalogue · Where cats come from', template: '%s · Catalogue' },
  description: DESCRIPTION,
  applicationName: 'Catalogue',
  authors: [AUTHOR],
  creator: AUTHOR.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    siteName: 'Catalogue',
    locale: 'en_GB',
    title: 'Catalogue · Where cats come from',
    description: DESCRIPTION,
    url: SITE,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Where cats come from, set beside a tabby kitten on a white ground, looking up' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
};

/* Runs before first paint. The page follows the system unless the visitor
   has chosen light or dark here before. It also says that scripts run (js),
   whether motion is welcome (live), and whether the window is tall enough for
   the scenes that hold still while the wheel turns (staged): they are only
   laid out that way when all three are true. lib/scroll.ts keeps the last one
   true as the window changes. */
const BOOT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}d.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('live');var s=document.body.appendChild(document.createElement('i'));s.style.cssText='position:fixed;height:100svh;visibility:hidden';var h=s.offsetHeight||innerHeight;s.remove();var r=parseFloat(getComputedStyle(d).fontSize)||16;if(h>=(innerWidth>=${ROOM.split}*r?${ROOM.wide}:${ROOM.narrow})*r)d.classList.add('staged')})()`;

const LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Catalogue',
  url: SITE,
  description: DESCRIPTION,
  inLanguage: 'en',
  author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={instrument.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: LD }} />
        <a className="skip-link" href="#main">
          Skip to the page
        </a>
        <Header />
        {children}
        <Footer />
        <Arrivals />
      </body>
    </html>
  );
}
