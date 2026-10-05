/* The photograph at the head of each article, from Wikimedia Commons.

   Each was chosen by looking: a large, sharp photograph of the thing the
   article is about, under a licence that lets it be copied with credit. It
   is cut to 16:9 around the point given here, saved at 2000 pixels wide in
   public/articles, and its maker and licence go to data/covers.json.

   usage: npm run covers */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const UA = 'CatalogueSnapshot/1.0 (https://purr-pedia.vercel.app; https://github.com/canberkyildiz25/Purr-Pedia)';
const get = (url) => fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* key: the file's name in public/articles, used by lib/articles.ts.
   focus: where the cut is centred, as percentages from the left and the top. */
const COVERS = [
  { key: 'feeding', file: 'Nicosia 01-2017 img06 cats.jpg', focus: [50, 52] },
  { key: 'drinking', file: 'Drinking Cat.jpg', focus: [50, 45] },
  { key: 'litter', file: 'Japanese litter box in use.jpg', focus: [50, 44] },
  { key: 'grooming', file: 'Mocchi the cat licking his paw.jpg', focus: [50, 55] },
  { key: 'poisons', file: 'Tomcat Leonidas in spring 06.jpg', focus: [50, 50] },
  { key: 'vet', file: 'Kitten check up at Guantanamo.jpg', focus: [50, 42] },
  { key: 'teeth', file: 'Cat yawn.jpg', focus: [50, 42] },
  { key: 'play', file: 'Ellie playing with her mouse. (19195686924).jpg', focus: [50, 39] },
  { key: 'reading', file: 'Tabby cats of Ōizumi Ryokuchi Park, January 2019 - 8816.jpg', focus: [50, 50] },
];

const WIDTH = 2000;
const HEIGHT = 1125;
const FREE = /^(cc0|cc[ -]by|public domain|pd\b|attribution|fal\b)/i;
const strip = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
/* Commons records the author as free text: keep the name, drop where they are from. */
const author = (html) =>
  strip(html)
    .replace(/https?:\/\/\S+/g, '')
    .replace(/^User:/i, '')
    .replace(/\s+from\s+[A-Z].*$/, '')
    .trim() || 'Unknown author';

const store = path.join(root, 'public', 'articles');
mkdirSync(store, { recursive: true });

const covers = {};
for (const cover of COVERS) {
  const res = await get(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2560&titles=${encodeURIComponent(`File:${cover.file}`)}`,
  );
  const info = (await res.json()).query?.pages?.[0]?.imageinfo?.[0];
  if (!info) throw new Error(`not on Commons: ${cover.file}`);
  const meta = info.extmetadata ?? {};
  const licence = strip(meta.LicenseShortName?.value);
  if (!FREE.test(licence)) throw new Error(`not freely licensed: ${cover.file} (${licence})`);

  const file = await get(info.thumburl && info.thumbwidth < info.width ? info.thumburl : info.url);
  if (!file.ok) throw new Error(`${file.status} for ${cover.file}`);
  const original = sharp(Buffer.from(await file.arrayBuffer())).rotate();
  const size = await original.metadata();

  // the widest 16:9 window the photograph holds, centred on the focus and kept inside the frame
  const window = { width: Math.min(size.width, Math.round((size.height * WIDTH) / HEIGHT)), height: Math.min(size.height, Math.round((size.width * HEIGHT) / WIDTH)) };
  const left = Math.round(Math.min(Math.max((cover.focus[0] / 100) * size.width - window.width / 2, 0), size.width - window.width));
  const top = Math.round(Math.min(Math.max((cover.focus[1] / 100) * size.height - window.height / 2, 0), size.height - window.height));
  await original
    .extract({ left, top, ...window })
    .resize({ width: WIDTH, height: HEIGHT, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(store, `${cover.key}.jpg`));

  covers[cover.key] = { title: cover.file, by: author(meta.Artist?.value), licence, licenceUrl: meta.LicenseUrl?.value ?? null, page: info.descriptionurl, full: info.width };
  console.log(`  ${cover.key}: ${covers[cover.key].by}, ${licence}, from ${info.width}px`);
  await pause(300);
}

writeFileSync(path.join(root, 'data', 'covers.json'), `${JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), width: WIDTH, height: HEIGHT, covers }, null, 1)}\n`);
console.log(`covers: ${COVERS.length} photographs`);
