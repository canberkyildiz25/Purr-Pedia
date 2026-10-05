# Catalogue

An atlas of cat breeds, **filed by where each one began**: a map, six regions,
a timeline, every entry from A to Z, and around them a guide and a shelf of
articles about the animal itself.

Live: https://purr-pedia.vercel.app

This is a rebuild of Purr Pedia, a course project that showed cat breeds as
cards with trait scores. The first version is in the repository's history.

## What it does

- A home page in six scenes that the scroll wheel plays: a film that runs
  forward and back with the wheel, a map that closes in on each region while
  photographs of its breeds fly to the places they come from, the decades
  sliding past sideways, and three findings over a close-up of an eye. With
  reduced motion, without JavaScript, or in a window too short to hold a
  scene, the same page is laid out still.
- A search box in the bar (Ctrl or Cmd K, or `/`) that finds any breed,
  place, article or page.
- Six regions, each with one colour that means that region everywhere on the
  site, and a page per region that lists its places and their breeds.
- A timeline: the old natural breeds first, then every breed whose history
  names a starting date, decade by decade.
- A page per breed: photographs with their makers' names (each opens large),
  origin, coat, weight, height and life span placed among all the other
  breeds, the source's description and history, the opening of its Wikipedia
  article, and the breeds from the same place.
- An index of all entries, searchable by name or place and sortable by age
  and size.
- Sizes: every breed's weight, height or life span as a bar on one scale.
- In a word: the words the source uses for temperament, counted, with a page
  for each one that more than one breed shares.
- Articles on feeding, care, health and behaviour, each with a short version
  at the top and its sources at the bottom.
- A guide to what all the breeds have in common, with five short films and
  the study behind each statement, and a page on what a cat needs.
- Compare up to three breeds on one scale, and keep a saved list. Both live
  in the browser; there are no accounts.
- Light and dark themes, installable.

## Data

Each source is read once and stored. The site calls none of them while it
runs.

**Breed records** come from [TheCatAPI](https://thecatapi.com).
`npm run snapshot` saves what the API says into `data/source.json`. Two
reasons for the copy: the API has already changed shape once (it dropped the
1 to 5 trait scores the first version depended on), and a key used in the
browser is a key in public. Its photographs stay on its own CDN and are
resized by `next/image`; it does not say who took them.

**Wikipedia and Wikimedia Commons** add an article and photographs to a
breed. `npm run wikimedia` looks up each breed's article and keeps its
opening lines. It takes photographs of two kinds: the ones I chose from the
breed's own category on Commons (the `CHOSEN` list in the script), and up to
three that the article itself shows. They are saved to `public/commons` at
1600 pixels, with the maker, the licence and the file's page recorded in
`data/wikimedia.json`. Commons photographs may be copied with credit, which
is why these are stored here and the first source's are not. Where a breed
has chosen photographs, the first of them leads its page.

Nothing from Commons is taken blind. The first source's photographs are
mostly snapshots, so for each breed I went through its Commons category for
large, sharp pictures with the cat clear of its surroundings, cat-show
portraits and the files Commons has marked as good first, and wrote the ones
I picked into `CHOSEN`. A file whose own name says it is a cross, another
breed or a street cat is not in it. Two more lists are filled in the same
way: `SKIP`, for files in an article that cannot stand for the breed
(manuscript pages, a chart, a temple, a cat of another breed), and `FOCUS`,
for where the cat's face is when the automatic guess was wrong. After a new
run, look at what changed before committing it.

**Article covers.** `npm run covers` fetches the photograph at the head of
each article from Commons, cuts it to 16:9 around a point given in the
script, and writes the credits to `data/covers.json`.

**Films.** `npm run films` (needs ffmpeg) makes everything in `public/film`
and writes the credits to `data/films.json`:

- the five films on the guide page, cut from videos on Commons;
- the two films the home page plays with the wheel, from free stock
  ([Pexels](https://www.pexels.com) and [Mixkit](https://mixkit.co)). They
  are encoded with a keyframe every six frames, because a film that is
  scrubbed is sought, not played, and a seek has to start from a keyframe.
  The kitten was filmed in 4K on a flat cyan backdrop; the script cuts out
  the part of the frame it sits in and turns the backdrop white, pixel by
  pixel, so that the film can be multiplied onto the page. That step takes
  several minutes.

**The guide, the care page and the articles** are written from published
papers and public guidance. The papers are in `lib/sources.ts`, each checked
against its DOI; an article lists its own sources in `lib/articles.ts`. The
numbers on those pages are the sources' numbers.

`lib/catalogue.ts` turns the snapshots into the catalogue. It parses and
groups; it does not fill gaps. Seven records arrive broken and are left out,
and one breed is listed twice and appears once. Where the two sources
disagree about a breed, both are shown as they are.

The dates on the timeline are in `lib/eras.ts`. They were read by hand from
each breed's history: the first year or decade the history names as the
beginning. If a new snapshot changes a history, that file has to be read
against it again.

Every photograph and film that is not the first source's is listed on
`/credits/`.

## Stack

Next.js 16 (static pages, built on Vercel), React 19, TypeScript, Tailwind
CSS 4, Zustand for the browser-side store, Phosphor icons, Instrument Sans
through `next/font`. The map is Natural Earth's coastline in an Equal Earth
projection, drawn at build time with d3-geo.

There is no animation library. The scenes are driven by one scroll listener
(`lib/scroll.ts`) that hands each scene its progress as a number and a CSS
variable; the photograph that grows from a tile into a breed's page is
React's `<ViewTransition>`.

```bash
npm install
npm run dev
```

To refresh the data, copy `.env.example` to `.env.local`, add a key, and run:

```bash
npm run snapshot
npm run wikimedia
npm run covers
npm run films
```

## Layout of the code

| Path | What is there |
| --- | --- |
| `app/` | Pages: home, `regions/[key]/`, `breeds/`, `breeds/[slug]/`, `timeline/`, `sizes/`, `words/`, `words/[word]/`, `articles/`, `articles/[slug]/`, `guide/`, `care/`, `compare/`, `saved/`, `about/`, `credits/`, 404 and the error page; `search.json/`, `robots.ts`, `sitemap.ts`, `manifest.ts` |
| `app/globals.css`, `app/styles/` | Tokens and base styles; one stylesheet per part of the site |
| `components/Scene.tsx` | A stretch of scroll with a stage pinned inside it |
| `components/ScrubFilm.tsx` | A film whose position follows the scroll |
| `components/AtlasFlight.tsx` | The map scene on the home page |
| `components/Rail.tsx` | The row that moves sideways as the page moves down |
| `components/Motion.tsx` | Things that arrive once, and numbers that count up |
| `components/Search.tsx` | The search box |
| `components/Gallery.tsx` | A breed's photographs, and the large view |
| `components/Finder.tsx` | Search, filters and order on the index |
| `components/Scale.tsx` | The chart on the sizes page |
| `components/Clip.tsx` | A film that waits to be asked and plays once |
| `components/Lists.tsx` | The compare page and the saved page |
| `lib/catalogue.ts` | The snapshots, tidied into breeds, places, regions and words |
| `lib/articles.ts` | The articles and their sources |
| `lib/eras.ts` | When each breed began, read by hand |
| `lib/regions.ts` | The six regions and where each place sits on the map |
| `lib/sources.ts` | The papers and guidance behind the guide and the care page |
| `lib/map.ts` | The world, projected at build time |
| `lib/scroll.ts` | The one scroll listener, whether the scenes run, and the easing they share |
| `lib/room.ts` | How tall a window has to be for the scenes to run |
| `scripts/` | `snapshot.mjs`, `wikimedia.mjs`, `covers.mjs`, `films.mjs` |
| `data/` | `source.json`, `wikimedia.json`, `covers.json`, `films.json` |
| `public/commons`, `public/film`, `public/articles` | Photographs, films and article covers |
| `vercel.json` | Security headers |
| `design.md` | The design system and the reasons behind it |

## Checks

Type check, lint and build are clean. The built site is tested with
Playwright: layout from 320 to 1920 px, counts that have to agree with each
other, the scenes at set scroll positions and in thirty-odd window sizes
(nothing a scene shows may fall outside it), the search box from the keyboard,
the large view of a photograph, the articles, saving, comparing, the sizes
chart, the films, the credits, both themes, the phone menu, reduced motion
and no JavaScript. Every kind of page is audited with axe-core in both
themes.

One thing those checks cannot say: how the scrubbed films behave on a real
iPhone. A headless browser does not have its video decoder.

## Author

Canberk Yıldız · https://canberkyildiz.netlify.app
