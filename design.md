# Design: Catalogue

The design system for the site, and the reasons behind it. Read it before
changing a page; amend it when the system needs to grow. Written in October
2026, when I rebuilt my Purr Pedia course project on Next.js 16.

## The idea

Purr Pedia was a grid of cat breeds with bar charts for traits scored 1 to 5.
The source has since stopped publishing those scores, so the charts, the
filters and the quiz had nothing left to stand on.

What the source still says about every breed is **where it began**. Catalogue
is built on that: an atlas of cat breeds, filed by place. A map, six regions,
a timeline, every entry from A to Z, and around them a guide and a shelf of
articles about the animal itself.

| What you see | What it means |
| --- | --- |
| A small dot of colour | A region. The same colour, everywhere, always means the same region |
| A mark on the map | A place. Its size is the number of breeds that began there |
| A bar on a chart | A range (weight, height, life span) on a scale every row shares |
| A tile with a cat's face in outline | A breed nobody has a free photograph of |
| A name under a photograph | It came from Wikimedia Commons, and that is who took it |

## The look: a quiet page

My first pass at this rebuild was loud: flat fields of colour behind every
photograph and headlines at weight 900. On a real screen it shouted over the
cats. This is the second pass, and it does the opposite.

- **The page is nearly white and almost empty.** Hairlines, air, and
  photographs with soft corners.
- **Colour belongs to the photographs.** The only colour the page adds is the
  region dot: tangerine for the Americas, cobalt for the British Isles, green
  for Europe and Russia, yellow for West Asia and Africa, rose for East Asia
  and the Pacific, grey for entries with no single place. A dot, a map mark, a
  bar on a chart. Never a surface.
- **Controls are ink.** Buttons are black pills, or outlined ones. There is no
  accent colour.
- **Three radii.** Controls are pills, photographs have 14px corners, panels
  (the map, an opened photograph, a film) have 20px. Nothing else.
- No gradients for show, no glass, no glow. One soft shadow, and only under
  things that float: the search box, a photograph on its way to the map.
- One scene on the home page is dark whatever the theme, because an eye in
  close-up needs the dark around it.

Tokens live at the top of `app/globals.css`; the rest of the styles are in
`app/styles/`. Use tokens by name. Do not write a colour or a font family
anywhere else.

## Type

- **Instrument Sans**, one family, through `next/font`, at three weights: 400
  for reading, 500 for labels and links, 560 for headings.
- Headings are large and tight (-0.03 to -0.04em) but never heavy. Size does
  the work that weight did in the first pass.
- No italics, no all-caps labels, no small label above a heading.
- The wordmark is the name beside six dots, one per region.

## Motion

Motion is where this version spends its energy, and it has rules.

- **On the home page, the wheel is the only clock.** The page is six scenes,
  and each one does something different with the scroll:
  1. a kitten, filmed from above, looks up and around as you scroll (it was
     shot on a flat cyan backdrop; the backdrop is turned white and the film
     multiplied onto the page, so the kitten sits on the page itself and the
     film has no edge);
  2. three numbers count up, once;
  3. the map: the view closes in on each region in turn, and photographs of
     that region's breeds fly in and land on the places the breeds come from,
     each shrinking into the mark of its place. This is the scene the page is
     built around;
  4. the decades slide past sideways;
  5. the page goes dark and one eye fills the frame while three findings take
     turns;
  6. tiles settle into a grid, and the last thing on screen is a search field.
- **Nothing plays by itself.** Scroll forward and the film runs; scroll back
  and it runs backwards; stop and it stops. The films on the guide page wait
  for Play, run once, and go back to their still. Nothing loops.
- **Elsewhere, things arrive once.** A grid's first dozen tiles come in one
  after another; text rises 14px. Whatever has arrived stays.
- **Opening a breed grows its photograph** from the tile into the page.
- Hover effects are only for devices that hover. UI transitions are under
  300ms and ease out.
- **With `prefers-reduced-motion`, or with no JavaScript, none of the scenes
  run.** The home page is then an ordinary page: the last frame of each film,
  the finished map with its legend, the timeline as a row that scrolls
  sideways, all three findings in a list. Every scene was designed in that
  state first.
- **A scene needs a window that can hold it.** A scene is one screen held
  still, so in a short window (a phone on its side, a small pane) the scenes
  stand down and the same still page is shown. The heights are in
  `lib/room.ts`. Above them, the pictures give way before the words do: the
  kitten's film shrinks, the eye becomes a band, and on a narrow screen the
  six regions are one row to swipe so that the map keeps its height.

The scroll code is small and lives in `lib/scroll.ts`, `components/Scene.tsx`,
`ScrubFilm.tsx`, `AtlasFlight.tsx` and `Rail.tsx`. In the styles, `html.staged`
means the scenes are running and `html.live` only that motion is welcome.

## Photographs and films

- Real photographs only. Nothing is generated. An entry with no free
  photograph keeps a plain tile and says so.
- Two sources of photographs, treated differently. The first source's stay on
  its CDN and are resized on the way by `next/image`; it does not say who took
  them, so they are not copied. Photographs from Wikimedia Commons are free to
  copy with credit, so they are stored with the site and signed wherever they
  are shown large.
- **A breed is led by the best photograph there is of it, not the first.**
  The first source's pictures are mostly snapshots. For each breed I went
  through its category on Commons and chose a few that are large, sharp and
  show the cat clear of its surroundings; the first of those leads the page,
  the tile and the map. A breed with none worth choosing keeps what it had.
- Every Commons photograph was looked at, and where the automatic focal point
  missed the cat's face it was set by eye. A photograph smaller than its plate
  is shown at its own size.
- The photograph at the head of an article is a photograph, from Commons, of
  the thing the article is about, cut to 16:9.
- The guide's films are short cuts from videos on Commons. The two films the
  wheel plays are free stock, from Pexels and Mixkit, and the one of the
  kitten starts from 4K so that it stays sharp on a large screen. All of them
  are listed on the credits page.

## Layout

- The bar: the wordmark, a search field, seven links. The search field opens
  a box that finds any breed, place, article or page, and works from the
  keyboard (Ctrl or Cmd K, or `/`). On a small screen the links move into a
  full-screen menu and the field shrinks to its icon.
- A breed's page: its name large, its region as a dot, one photograph, five
  facts (three of them placed on a track that runs from the smallest breed to
  the largest), the source's account, Wikipedia's opening lines, the rest of
  the photographs (each opens large), and its neighbours.
- `/sizes/`, `/words/`, `/timeline/`, `/regions/[key]/`, `/compare/`,
  `/saved/`: lists and charts, in ink, with region dots.
- `/guide/` and `/care/` are set as ledgers: a ruled list with what is
  counted or named on the left and what there is to say about it on the
  right, with its source under it.
- `/articles/`: the first article large, the rest under four topics. An
  article is one narrow column: a cover, the short version in a panel, the
  sections, and where it all comes from.

## Honesty

- **Each source read once.** Records from TheCatAPI as it stood on the date in
  the footer; articles' openings, photographs and the guide's films from
  Wikipedia and Wikimedia Commons. The site is built from the copies in
  `data/` and calls nothing while it runs.
- **The sources are kept apart.** Wikipedia's opening lines sit beside the
  first source's account under their own heading. Where the two disagree,
  neither is corrected.
- **Every statement in the guide and the articles has a source under it.**
  Papers were looked up by DOI. A sentence with a number in it has the
  source's number.
- **The care page and the articles are summaries, not advice,** and say so.
- **Every number on a page is counted from the data** at build time.
- **No scores.** Nothing here ranks a breed's temperament.

## Accessibility

- The map and its flying photographs are a show for the eye: they are hidden
  from assistive technology, and the same regions are ordinary links beside
  the map.
- Something that is only on screen for part of a scene is moved off the page
  when it is not showing, so it cannot be clicked unseen; reaching it with the
  keyboard scrolls the page to where it shows.
- The search box is a real combobox: arrows move, Enter opens, Escape closes.
- Touch targets are at least 44px; text contrast is at least 4.5 to 1 in both
  themes.
- Without JavaScript every page reads; only search, saving, comparing and the
  scenes need it.
- Checked with axe-core on every kind of page, in both themes, at two widths.
