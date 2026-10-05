/* Saves what TheCatAPI says today into data/source.json.

   The site is built from that file and never calls the API, for two reasons:
   the API has already changed shape once (it dropped the 1 to 5 trait scores
   the first version of this project was built on), and a key in the browser
   is a key in public.

   usage: npm run snapshot   (needs CAT_API_KEY in .env.local) */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const env = (() => {
  try {
    return readFileSync(path.join(root, '.env.local'), 'utf8');
  } catch {
    return '';
  }
})();
const KEY = process.env.CAT_API_KEY || (env.match(/^CAT_API_KEY=(.*)$/m) || [])[1]?.trim() || '';
if (!KEY) {
  console.error('snapshot: CAT_API_KEY is missing. Put it in .env.local.');
  process.exit(1);
}

const API = 'https://api.thecatapi.com/v1';
const PHOTOS_PER_BREED = 6;
/* Photographs that cannot stand for a breed: this one is a tail leaving the frame. */
const SKIP = new Set(['bTo6m3PVg']);
const get = async (url) => {
  const res = await fetch(url, { headers: { 'x-api-key': KEY } });
  if (!res.ok) throw new Error(`${res.status} for ${url.replace(API, '')}`);
  return res.json();
};
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Where the cat is in the photograph, as a percentage from the left and from
   the top. Photographs are cropped to fit tiles, and a crop around the middle
   often keeps the sofa and loses the cat. */
async function focus(url) {
  try {
    const buffer = Buffer.from(await (await fetch(url)).arrayBuffer());
    const { width, height } = await sharp(buffer).rotate().toBuffer({ resolveWithObject: true }).then((result) => result.info);
    const { info } = await sharp(buffer).rotate().resize({ width: 320, height: 320, fit: 'cover', position: 'attention' }).toBuffer({ resolveWithObject: true });
    const clamp = (value) => Math.min(85, Math.max(15, Math.round(value)));
    return { fx: clamp((info.attentionX / width) * 100), fy: clamp((info.attentionY / height) * 100) };
  } catch {
    return { fx: 50, fy: 40 };
  }
}

const raw = await get(`${API}/breeds`);
const breeds = raw.map((breed) => ({
  id: breed.id,
  name: breed.name,
  origin: breed.origin ?? null,
  description: breed.description ?? null,
  history: breed.history ?? null,
  temperament: breed.temperament ?? null,
  life_span: breed.life_span ?? null,
  weight: breed.weight?.metric ?? null,
  height: breed.height?.metric ?? null,
  breed_group: breed.breed_group ?? null,
  reference_image_id: breed.reference_image_id ?? null,
}));

const chosen = new Map(raw.filter((breed) => breed.image?.url).map((breed) => [breed.id, breed.image]));

const photos = {};
for (const breed of breeds) {
  const list = await get(`${API}/images/search?breed_ids=${breed.id}&limit=12&order=ASC`);
  const usable = list.filter((image) => image.url && /\.(jpe?g|png|webp)$/i.test(image.url) && image.width >= 600 && !SKIP.has(image.id));
  // the photograph the source itself picked for the breed goes first, even
  // when the search did not return it
  const lead = chosen.get(breed.id);
  if (lead && !SKIP.has(lead.id) && !usable.some((image) => image.id === lead.id)) usable.unshift(lead);
  usable.sort((a, b) => Number(b.id === breed.reference_image_id) - Number(a.id === breed.reference_image_id));
  photos[breed.id] = [];
  for (const image of usable.slice(0, PHOTOS_PER_BREED)) {
    photos[breed.id].push({ id: image.id, url: image.url, w: image.width, h: image.height, ...(await focus(image.url)) });
  }
  await pause(120);
}

const out = { fetched: new Date().toISOString().slice(0, 10), source: API, breeds, photos };
writeFileSync(path.join(root, 'data', 'source.json'), `${JSON.stringify(out, null, 1)}\n`);
const withPhotos = breeds.filter((breed) => photos[breed.id].length).length;
console.log(`snapshot: ${breeds.length} entries, ${withPhotos} with photographs, ${Object.values(photos).flat().length} photographs kept, dated ${out.fetched}`);
