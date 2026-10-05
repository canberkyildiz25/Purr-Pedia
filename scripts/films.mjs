/* Makes every moving picture on the site, and the stills cut from them.

   Two kinds:
   - the short films on the guide page, cut from videos on Wikimedia Commons:
     a few seconds each, 960 by 540, sound removed;
   - the two films the wheel plays on the home page, from free stock (Pexels
     and Mixkit): encoded with a key frame every few frames, because a film
     that is scrubbed has to be able to jump anywhere at once.

   Makers and licences go to data/films.json.

   usage: npm run films   (needs ffmpeg on the PATH) */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const UA = 'CatalogueSnapshot/1.0 (https://purr-pedia.vercel.app; https://github.com/canberkyildiz25/Purr-Pedia)';
const get = (url) => fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
const strip = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const cache = path.join(tmpdir(), 'catalogue-films');
const films = path.join(root, 'public', 'film');
for (const folder of [cache, films]) mkdirSync(folder, { recursive: true });
const ffmpeg = (args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args]);

/* The original, fetched once and kept in the system's temporary folder. */
async function original(name, url) {
  const file = path.join(cache, name);
  if (!existsSync(file)) {
    const media = await get(url);
    if (!media.ok) throw new Error(`${media.status} for ${url}`);
    writeFileSync(file, Buffer.from(await media.arrayBuffer()));
  }
  return file;
}

/* ---------- Guide: short films from Commons ----------
   from: where the cut starts, in seconds. still: the frame shown before the
   film plays. quality: x264's CRF; the hand-held one needs a higher number
   to stay near a megabyte. */
const GUIDE = [
  { key: 'lapping', file: 'Cat lapping water off ground in slow motion.gk.webm', from: 0, seconds: 8, still: 0.2, quality: 27 },
  { key: 'grooming', file: 'Housecat Grooming Itself.webm', from: 0.5, seconds: 8, still: 2.2, quality: 27 },
  { key: 'kneading', file: 'Cat kneading blanket.gk.webm', from: 1, seconds: 8, still: 3, quality: 27 },
  { key: 'catnip', file: 'Cat interacting with catnip (nepeta).webm', from: 2, seconds: 8, still: 3, quality: 27 },
  { key: 'walking', file: 'Black Cat walking.webm', from: 0.8, seconds: 7, still: 6.6, quality: 31 },
];
const frame = 'scale=960:540:force_original_aspect_ratio=increase,crop=960:540';

const guide = [];
for (const film of GUIDE) {
  const res = await get(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=videoinfo&viprop=url|extmetadata&titles=${encodeURIComponent(`File:${film.file}`)}`);
  const info = Object.values((await res.json()).query.pages)[0].videoinfo[0];
  const meta = info.extmetadata ?? {};
  const source = await original(`${film.key}.webm`, info.url);

  ffmpeg(['-ss', String(film.from), '-i', source, '-t', String(film.seconds), '-an', '-vf', `${frame},fps=30`, '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p', '-crf', String(film.quality), '-preset', 'slow', '-movflags', '+faststart', path.join(films, `${film.key}.mp4`)]);
  ffmpeg(['-ss', String(film.still), '-i', source, '-frames:v', '1', '-vf', frame, '-q:v', '4', path.join(films, `${film.key}.jpg`)]);

  guide.push({
    key: film.key,
    seconds: film.seconds,
    title: film.file,
    by: strip(meta.Artist?.value) || 'Unknown author',
    licence: strip(meta.LicenseShortName?.value),
    licenceUrl: meta.LicenseUrl?.value ?? null,
    page: info.descriptionurl,
  });
  console.log(`  ${film.key}: ${film.seconds}s, by ${guide.at(-1).by}, ${guide.at(-1).licence}`);
}

/* ---------- Home: two films the wheel plays, from free stock ----------
   The kitten was filmed from above, in 4K, on a flat cyan backdrop. The cut
   takes the part of the frame the kitten is in, and `white` turns the
   backdrop white: multiplied onto the page it disappears, and the kitten sits
   on the page itself. speed: the cut is played this much faster than it was
   shot. A key frame every few frames, because a scrubbed film is sought.
   Turning the backdrop white is worked out pixel by pixel and takes several
   minutes. */
const mixkit = (id, size) => `https://assets.mixkit.co/videos/${id}/${id}-${size}.mp4`;

/* Cyan to white, one pixel at a time. A pixel is backdrop to the degree that
   its green and blue stand above its red. Red is raised to meet them, which
   makes the backdrop white and leaves grey fur as it was; green and blue are
   brought level, so that the soft shadow under the kitten is grey. Green the
   backdrop threw onto the fur is held to the larger of red and blue. The
   last stretch before each edge goes to white, so the frame has no edge. */
const least = 'min(g(X,Y),b(X,Y))';
const backdrop = `clip((${least}-r(X,Y))/60,0,1)`;
const red = `max(r(X,Y),${least})`;
const blue = `(b(X,Y)-${backdrop}*(b(X,Y)-${least}))`;
const levelled = `(g(X,Y)-${backdrop}*(g(X,Y)-${least}))`;
const held = `max(${red},${blue})`;
const green = `min(${levelled},${held}+0.05*(${levelled}-${held}))`;
const edge = 'clip(1-min(min(X,W-X),min(Y,H-Y))/90,0,1)';
const toEdge = (channel) => `(${channel})+(255-(${channel}))*${edge}`;
const white = `format=gbrp,geq=r='${toEdge(red)}':g='${toEdge(green)}':b='${toEdge(blue)}',eq=saturation=0.55:gamma=0.97,colorbalance=rm=0.03:bm=-0.02,colorlevels=rimax=0.955:gimax=0.955:bimax=0.955,`;

const SCRUB = [
  {
    key: 'arrival',
    file: 'pexels-7120007.mp4',
    url: 'https://videos.pexels.com/video-files/7120007/7120007-uhd_3840_2160_25fps.mp4',
    from: 'Pexels',
    by: 'Kmeel.com Videos',
    page: 'https://www.pexels.com/video/kitten-on-a-light-blue-background-7120007/',
    start: 3,
    seconds: 8,
    speed: 1.6,
    look: `crop=2112:1188:816:729,${white}`,
    large: [1600, 900],
    small: [854, 480],
    end: 5.6,
  },
  {
    key: 'eye',
    file: 'mixkit-1546.mp4',
    url: mixkit(1546, 1080),
    from: 'Mixkit',
    by: null,
    page: 'https://mixkit.co/free-stock-video/yellow-eyed-black-cat-close-up-1546/',
    start: 0.4,
    seconds: 6,
    speed: 1,
    look: '',
    large: [720, 1280],
    small: [540, 960],
    end: 3.2,
  },
];
const scrub = ['-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-sc_threshold', '0', '-movflags', '+faststart'];

const stock = [];
for (const film of SCRUB) {
  const source = await original(film.file, film.url);
  const cut = ['-ss', String(film.start), '-t', String(film.seconds), '-i', source];
  const pace = film.speed === 1 ? '' : `setpts=PTS/${film.speed},`;
  const sized = ([width, height]) => `${film.look}${pace}fps=24,scale=${width}:${height}:flags=lanczos`;
  ffmpeg([...cut, '-vf', sized(film.large), ...scrub, '-crf', film.key === 'eye' ? '24' : '21', '-g', '6', '-keyint_min', '6', path.join(films, `${film.key}.mp4`)]);
  ffmpeg([...cut, '-vf', sized(film.small), ...scrub, '-crf', film.key === 'eye' ? '26' : '24', '-g', '4', '-keyint_min', '4', path.join(films, `${film.key}-m.mp4`)]);
  const one = `${film.look}scale=${film.large[0]}:${film.large[1]}:flags=lanczos`;
  // the frame that holds the place before the film is in, and the frame shown when nothing may move
  ffmpeg(['-ss', String(film.start), '-i', source, '-frames:v', '1', '-vf', one, '-q:v', '2', path.join(films, `${film.key}-0.jpg`)]);
  ffmpeg(['-ss', String(film.end), '-i', source, '-frames:v', '1', '-vf', one, '-q:v', '2', path.join(films, `${film.key}.jpg`)]);
  stock.push({ key: film.key, use: 'Home page', from: film.from, by: film.by, page: film.page });
  console.log(`  ${film.key}: scrub film from ${film.from}`);
}

writeFileSync(path.join(root, 'data', 'films.json'), `${JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), films: guide, stock }, null, 1)}\n`);
console.log(`films: ${guide.length} for the guide, ${SCRUB.length} for the home page`);
