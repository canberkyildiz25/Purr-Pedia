/* Adds what Wikipedia and Wikimedia Commons have for each breed: the
   article and its opening lines go to data/wikimedia.json, and photographs
   go to public/commons, each recorded with the name of the person who took
   it and its licence. The photographs are of two kinds: ones chosen by eye
   from the breed's category on Commons (CHOSEN, below), and ones the
   breed's article itself shows.

   Only freely licensed photographs hosted on Commons are taken. Those may be
   copied with credit, which is why they are stored with the site (the first
   source's photographs are not). A picture Wikipedia shows under "fair use"
   is not free and is skipped.

   usage: npm run wikimedia   (run after npm run snapshot) */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const source = JSON.parse(readFileSync(path.join(root, 'data', 'source.json'), 'utf8'));

// Wikimedia asks every script to say who it is.
const UA = 'CatalogueSnapshot/1.0 (https://purr-pedia.vercel.app; https://github.com/canberkyildiz25/Purr-Pedia)';
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const get = async (url) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (res.status === 429) {
      await pause(2000 * (attempt + 1));
      continue;
    }
    return res;
  }
  return { ok: false, status: 429, json: async () => ({}), arrayBuffer: async () => new ArrayBuffer(0) };
};

/* Where the article is not simply "<name> cat" or "<name>". A null means
   Wikipedia has no article of its own for the entry. */
const TITLES = {
  // Wikipedia treats the Aphrodite as the Cyprus cat; one article cannot stand for two entries
  'Aphrodite Giant': null,
  Cyprus: 'Cyprus cat',
  // both domestic entries lead to the same article; it is used once, for the shorthair
  'Domestic Longhair': null,
  'Domestic Shorthair': 'Domestic short-haired cat',
  'Domestic Mediumhair': null,
  Polydactyl: 'Polydactyl cat',
  Minuet: 'Minuet cat',
  // "British Longhair cat" lands on the shorthair's article
  'British Longhair': 'British Longhair',
  'British Tipped': null,
  Burmoir: null,
  Malayan: null,
  'American Ringtail': null,
  Genetta: null,
  'Exotic Longhair': null,
  'European Burmese': null,
};

/* Articles whose title is not the entry's name but are about it all the same. */
const ALSO_KNOWN = { 'Asian Semi-longhair': 'Tiffanie', 'Domestic Shorthair': 'Moggy' };

/* Files an article shows that cannot stand for the breed here: manuscript
   pages, engravings and old prints, a chart, a cat seen from behind, another
   breed shown for comparison. Each one was looked at. */
const SKIP = new Set([
  'Cat hunting lizard.jpg',
  'European shorthair-TUROK cat show Turku 2011-11-26.JPG',
  'Tamra khao manee cat in Bangkok (cropped).jpg',
  'Wichienmaat Thai cat.jpg',
  'Ayutthaya cat 9999.jpg',
  '1950s style Siamese cat.png',
  'Our cats and all about them (Page 30) BHL18095116 (cropped).jpg',
  'TamraMaewSuphalak.jpg',
  'Tiam Siamese.JPG',
  'Internationale kattententoonstelling in Koopmansbeurs, de kampioen de pers Rebe, Bestanddeelnr 917-2418 (cropped).jpg',
  'Biased number of polydactylous toes in a Maine Coon population (no text).jpg',
  'Male polydactyl grey house cat - right front paw, circles.jpg',
  'Busok Juara.jpg',
  // too dark to show the cat, a detail that is not the cat, or a different breed in the frame
  'CymricCatPerched.jpg',
  'BlueDevonRex.jpg',
  'Domestic short hair.jpg',
  'European shorthair - Tampere cat shows.JPG',
  'Himalayan CAT.jpg',
  'Tamra Khao Manee cat 01 (cropped).jpg',
  'The only two Thai Lilac Points in the UK - Clairabelle Pixie Dust & Clairabelle Ninja Rococoa.jpg',
  'Busok Hitam.png',
  'Kimburu Sungura Sana of Moosegrove SOK n 22 (cropped).jpg',
  'SuphalakKitten.jpg',
  'SuphalakFemale.jpg',
  // a temple, in the article for the town the breed is named after
  'Entrance-phimai.jpg',
  // British Shorthairs inside the longhair's article
  'Mystica from British Empire Cattery.jpg',
  'Quadruple Grand Champion Feliland George the Great.jpg',
  'British Shorthair Smiling.jpg',
  'BRI Golden Garry v. Wahrberg (4488833650) (cropped).jpg',
  'British Shorthair, Classic Tabby.jpg',
  'Spiritland British Shorthair Silver Shaded (cropped).jpg',
  'Silver & white kittens (7687774432).jpg',
  'British Shorthair (4-28-2023) (cropped).jpg',
]);
/* The shorthair's own article may keep its shorthairs. */
const KEEP = { 'British Shorthair': ['Mystica from British Empire Cattery.jpg', 'British Shorthair Smiling.jpg'] };

/* Photographs chosen by looking through each breed's own category on Commons:
   large, sharp, and the cat clear of what is around it. Cat-show portraits
   and the pictures Commons has itself marked as good were looked at first.
   The first one in a list leads the breed's page; the rest follow it. */
const CHOSEN = {
  Abyssinian: [
    'Portrait of Okoge (Takashi Hososhima, 2011) (cropped 2025).jpg',
    'Abessinierkatze.jpg',
    'Poktori-2.JPG',
  ],
  Aegean: [
    'Aegean cat Marilyn 30-1-2021.jpg',
  ],
  'American Ringtail': [
    'Jupiter 300DPI.jpg',
    'Chunky Monkey American Ringtail Cat 3rd Generation.jpg',
  ],
  'American Shorthair': [
    'ASH Russeller’s Cleopatra of Solid Fold (4496949460).jpg',
    'American shorthair cat Portrait (cropped).jpg',
  ],
  'Arabian Mau': [
    'Arabian Mau Kitten.jpg',
    '3yoArabianMau.jpeg',
  ],
  'Asian Semi-longhair': [
    'IMGP3625 (52342978431).jpg',
  ],
  Balinese: [
    'Chocolate-point-balinese.jpg',
    'Balinese-cat.jpg',
    'Simba, a Balinese cat (50387844358).jpg',
  ],
  Bengal: [
    'BEN Bengalian kitten (4492540155).jpg',
    'Bengal - 19.jpg',
    'Blue bengal kitten taste of freedom - 0 (23829589948).jpg',
  ],
  Birman: [
    'Kucing Birman membuang pandangan bj.jpg',
    'Exposition FIFé Vitré 13.JPG',
  ],
  Bombay: [
    'EbonyCatz Joyous Jasmine.jpg',
    'Bombay Katzen of Blue Sinfonie.JPG',
  ],
  'British Longhair': [
    'British Longhair - Blue Bicolor.jpg',
    'Katze Britisch Langhaar – Creme.jpg',
    'BLH Bounty Amouge (15477503019).jpg',
  ],
  'British Shorthair': [
    'A Blue British Shorthair cat on August 1, 2022.jpg',
  ],
  Burmese: [
    'BurMau Vega Star, champagne burmese kitten.jpg',
  ],
  Burmilla: [
    'Burmilla kitten.jpg',
    'IMGP8012 (51190452195).jpg',
  ],
  Chartreux: [
    'CertosinoFemmina.JPG',
    'Kartäuser entdeckt einen Rivalen.JPG',
    'Kartäuser mit schlechter Laune.JPG',
  ],
  Chausie: [
    'Chausie IMG 5149.jpg',
    'Chausie IMG 5419.jpg',
  ],
  Cheetoh: [
    'CheetohCatInGrass.jpg',
  ],
  'Cornish Rex': [
    '20170604 kot wystawa Kraków 8006.jpg',
    'Gatos Cornish Rex 01.jpg',
    'Cornish Rex - Gatos.jpg',
  ],
  'Devon Rex': [
    'Devonrex cat.jpg',
    'DRX Ingenio\'s Impression (5274250171).jpg',
  ],
  Donskoy: [
    'DSX World Premior RU*Don Xuk\'s Login WOW (14037426296).jpg',
    'Sphynx-cat DSX a22.JPG',
    'Profil d\'un chat donskoy.jpg',
  ],
  'Egyptian Mau': [
    'RoyalNefertt Serket of AchetAton.jpg',
    '02010 058 Ägyptische Mau, Assuan.jpg',
    'MAU ICH Arietta Setesh of Egyptsila 2.jpg',
  ],
  'European Burmese': [
    'British burmese-Felicia 784.jpg',
    'Felicia 774 (4683656974).jpg',
    'Burmakatze-rot.jpg',
  ],
  'European Shorthair': [
    'Gatto europeo4.jpg',
    'Cat European shorthair.jpg',
  ],
  'Exotic Shorthair': [
    'Bissel 4.jpg',
    'Garfield (8717284786) (2013; cropped 2025).jpg',
    'P4301146 (8697971736).jpg',
  ],
  'German Rex': [
    'Elmo vom Hause Jung.jpg',
  ],
  'Havana Brown': [
    'Havana Brown Cat3.jpg',
    'Léonard le Très Haut.jpg',
    'Havana brown Cat1.jpg',
  ],
  Highlander: [
    'Highlander cat face (2014) Hugo by TAnthony.jpg',
    'Grand Champion Darkside Mirror Image of Midwestern.jpg',
  ],
  Himalayan: [
    'Bluepoint Himalayan Kitten Cirrus at 6 months by Asilverstein 2014mar14 IMG 2542b (cropped).jpg',
    'Himalayan Male Cat 5 years Old Lilac Point.jpg',
    'The Himalayan cat named Fur Bear.jpg',
  ],
  Kanaani: [
    'Kanaani cat Haifa full body profile Brooklyn 2025 (cropped).jpg',
    'Kanaani cat Haifa profile Brooklyn 2025 (cropped).jpg',
  ],
  'Khao Manee': [
    'Khaomanee cat.jpg',
    'Khao Manee "Leela".jpg',
  ],
  Korat: [
    'Korat Sisters.jpg',
    'Korat.jpg',
  ],
  'Kurilian Bobtail': [
    'KURILIAN BOBTAIL Femmina Jasmin (cropped).jpg',
    'KURILIAN BOBTAIL Maschio Veika.JPG',
    'Kurilian bobtail.JPG',
  ],
  LaPerm: [
    'Kururu-LaPermCat in Cat Cafe.jpg',
  ],
  'Maine Coon': [
    'Кот. Порода - Мейн-кун. Cat. Breed - Maine Coon.jpg',
    'Snow is Tasty (38077337005).jpg',
    'Maine Coon blanc.jpg',
  ],
  Manx: [
    'Manxcat.jpg',
    'Linus the Manx 1.jpg',
  ],
  Minuet: [
    'White gray long hair minuet.jpg',
  ],
  Munchkin: [
    'Munchkin cat 2.jpg',
    'MNS Rosa Sunny Fairies (11320077403).jpg',
  ],
  Nebelung: [
    'Palaya Azadeh.jpg',
    'Nebelung female cat.jpg',
    'Nebelung Cat on a hike.jpg',
  ],
  'Norwegian Forest Cat': [
    'George de Jolival - 3.jpg',
    'NL* Titran\'s Gunnarr male kitten 12 weeks old (32084602185).jpg',
    'Every Cat has a Silver Lining (25648628893).jpg',
  ],
  Ocicat: [
    'Ocicat 13.06.07 015.jpg',
    '*یک گربه اوسی کت، دیرگچین، ایران (عکاس مصطفی معراجی)* 06.jpg',
    'Upclose photo of a female ocicat\'s face.jpg',
  ],
  'Oriental Longhair': [
    'Oriental Longhair (Javanese, Mandarin), Red Classic Tabby.jpg',
    'JAV Вениамин Бали Ленд (11319060913).jpg',
  ],
  'Oriental Shorthair': [
    'Oriental shorthair, black spotted tabby.jpg',
    'OSH Batman Magic Sioccolata (4492764500).jpg',
  ],
  Persian: [
    'Super flyffy cat (5364339790).jpg',
    'Persian in Cat Cafe.jpg',
    'Nice red Persian cat (54331777955).jpg',
  ],
  'Pixie-bob': [
    'AnsonRoadLynxJenkinsPowerfulPixieBobMale.JPG',
    'AnsonRoadIceLynx3MonthOldPixieBobfemaleLongHair.JPG',
  ],
  Polydactyl: [
    'Polydactyl Cat, Saturday March 28 2026.jpg',
    'CALICO CAT-Miss Stevie (3617517139).jpg',
    'A white paw, Polydactyl cat.jpg',
  ],
  Raas: [
    'Kucing Raas Busok - Sumenep.jpg',
    'Busok cats.jpg',
  ],
  Ragamuffin: [
    'What are you up to? (7750736126).jpg',
    'Ramu (6873201112).jpg',
  ],
  Ragdoll: [
    'Monty (49063883192).jpg',
    'Monty half asleep (49981369966).jpg',
  ],
  'Russian Blue': [
    'Kotka rosyjska niebieska - 4 miesiące.jpg',
    'Jasmina.JPG',
  ],
  Savannah: [
    'Savka5.jpg',
    'OllieCat the Savannah (4814042734).jpg',
    'F2 Savannah Cat.jpg',
  ],
  'Scottish Fold': [
    'Scottish fold cat (13223591385).jpg',
    'SFL Deyma Barberry O.A. (4170828275).jpg',
  ],
  'Selkirk Rex': [
    'SRL (3094392097).jpg',
    'Junge Selkirk Rex.JPG',
  ],
  Siamese: [
    'Siamese Cat ACAS-SI-1.jpg',
    'Filhote de gato siamês.JPG',
    'Siamese cat, female.jpg',
  ],
  Siberian: [
    'Siberian black tabby blotched cat 01.jpg',
    'Siberian Forest Cat in Sweden.jpg',
  ],
  Singapura: [
    'Raw Singapura.jpg',
    'Singapura cat, crouching.JPG',
    'SIN Ch. Fagervoll Miiki T of RosenTal (4184817614).jpg',
  ],
  Snowshoe: [
    'Chizhik Cat.jpg',
    'Slinky fl.jpg',
  ],
  Sokoke: [
    'Sokoke dalili.jpg',
  ],
  Somali: [
    'Cat Somali.jpg',
    'Somali cat in Fifé Worldshow .jpg',
    'Ruddy Somali female.jpg',
  ],
  Sphynx: [
    'Chat Sphynx.jpg',
    'Cat Sphynx. Kittens. img 11.jpg',
    '1 adult cat Sphynx. img 047.jpg',
  ],
  Suphalak: [
    'Suphalak Female in Thailand named AumDaengManee.jpg',
  ],
  Tonkinese: [
    'Tonkinese Cat - Leo.jpg',
    'Gato tonkines.jpg',
  ],
  Toyger: [
    'Toyger male queenanne.JPG',
    'TGR Eeyaa American Idol (3098860706).jpg',
    'Olympus Queenannecats.JPG',
  ],
  'Turkish Angora': [
    'TUA Akkedi Vanessa (15662006542).jpg',
    'Daly du lys d\'Orient 4.jpg',
    'Young Angora white cat.jpg',
  ],
  'Turkish Van': [
    'Nike, turkish van.jpg',
    'TurkishVanRandomSpots.jpg',
  ],
  'York Chocolate': [
    'York Chocolate.jpg',
  ],
};

/* Where the cat's face is, set by eye, for the photographs the automatic
   guess got wrong. Percentages from the left and from the top. */
const FOCUS = {
  'KOR 1149.jpg': [28, 45],
  'Devonrex cat.jpg': [32, 38],
  'Female European shorthair in URK cat show Kirkkonummi 2008-03-02.JPG': [60, 22],
  'Himalayan-sharapova.jpg': [25, 38],
  'Khao Manee "Leela".jpg': [42, 45],
  'Gustav chocolate.jpg': [65, 17],
  'Valentino.jpg': [38, 35],
  'Two male Aegean cats.jpg': [22, 35],
  'American curl 2.jpg': [18, 25],
  'GC Yatfung\'s Brown Cobra.jpg': [70, 20],
  'Arabian Mau Kitten (cropped).jpg': [52, 22],
  'Tiffanie at cat show.jpg': [50, 30],
  'IMGP3621 (52342024792).jpg': [48, 30],
  'Kitten Alpha MMB 2021-08-22.jpg': [40, 40],
  'Young brown marbled wikipedia.jpg': [55, 18],
  'Brown and gold spotted wikipedia.jpg': [45, 30],
  'Chocolate-point-balinese.jpg': [72, 28],
  'Paintedcats Red Star standing.jpg': [60, 20],
  'Best Stalk.jpg': [22, 50],
  'Pépita Sacré de Birmanie.jpg': [50, 33],
  'Birman male.jpg': [50, 25],
  'Bombay Katze Ebene of Blue Sinfonie.JPG': [33, 45],
  'Bombay Katzen of Blue Sinfonie.JPG': [72, 30],
  'Gato pelo curto brasileiro.JPG': [42, 15],
  'Mystica from British Empire Cattery.jpg': [58, 25],
  'British Shorthair Smiling.jpg': [40, 40],
  'BUR LV Malsan Tiffani (4502325566) (cropped).jpg': [62, 48],
  'ChausieBTT.jpg': [78, 22],
  'Chocolate Tortie Pt 11636-140.jpg': [65, 33],
  'Red Pt 11401-591.jpg': [35, 22],
  'Rex staredown.jpg': [62, 42],
  'Smokytortoiseshellcornishrexportrait.png': [45, 42],
  'CyprusShorthair.jpg': [60, 38],
  'Cyprus Cat Yawning.jpg': [42, 32],
  'Devon Rex Cassini.jpeg': [45, 35],
  'Three stray cats in Japan street, August 2014.jpg': [48, 62],
  'Domestic cat felis catus.jpg': [35, 38],
  'DSX World Premior RU*Don Xuk\'s Login WOW (14037189016).jpg': [48, 33],
  'Cat named Pipi.jpg': [55, 30],
  'RoyalNefertt Serket of AchetAton.jpg': [60, 42],
  'Egyptian Mau Bronze.jpg': [30, 22],
  'European Shorthair EUR d 22.jpg': [58, 20],
  'European shorthair - URK cat show Vantaa.JPG': [55, 20],
  'Noidankattilan Bellatrix Exotic shorthair.JPG': [25, 38],
  'German rex harry (cropped).jpg': [68, 35],
  'German rex alana.JPG': [45, 25],
  'Havana kittens.jpg': [50, 28],
  'Highlander-7.jpg': [20, 33],
  'Highlander cat face (2014) Hugo by TAnthony.jpg': [55, 38],
  'Highlander cat profile (2010) Hugo by TAnthony.jpg': [22, 28],
  'Sonny Bunny.jpg': [40, 12],
  'Japanese bobtail curled.jpg': [52, 20],
  'Kanaani cat Haifa full body profile Brooklyn 2025 (cropped).jpg': [72, 38],
  'Kanaani cat Haifa profile Brooklyn 2025 (cropped).jpg': [62, 28],
  'Khaomanee cat.jpg': [58, 24],
  'Korat cat wikipedia.jpg': [58, 38],
  'KURILIAN BOBTAIL Maschio Veika 2011 (cropped).JPG': [22, 38],
  'Kurilian bobtail.JPG': [70, 40],
  '8-month-old male Lykoi.jpg': [68, 25],
  'MCO Nicolas Real Hero Backwoods (8637954832).jpg': [50, 45],
  'A Rumpy Manx Cat.jpg': [28, 35],
  'Rumpy Riser Manx Kitten.jpg': [25, 38],
  'White Gray Minuet Cat.png': [38, 50],
  'Ozar en Palaya Azadeh.JPG': [62, 42],
  'Palaya Azadeh.jpg': [48, 22],
  'Norwegian Forest Cat face profile.jpg': [60, 35],
  'Lazuli01 (cropped).jpg': [50, 24],
  'Solid black Javanese cat.jpg': [72, 40],
  'JAV Вениамин Бали Ленд (11319297486) (2013; cropped 2023).jpg': [45, 45],
  'Oriental longhair kitten.jpg': [62, 32],
  'Fatale de la légende d\'ali.jpg': [58, 18],
  'Orifame Aurinkuningas (Amedei) OSH b 22.JPG': [45, 24],
  'Persian in Cat Cafe.jpg': [52, 20],
  'Persian profile view moderate type.jpg': [55, 42],
  'Kita Peterbald.jpg': [45, 50],
  'Pantanal Pixie-Bob 2.jpg': [28, 28],
  'Polydactyl cat 7toes (cropped).jpg': [50, 50],
  'The multiple toes of a polydactyl kitten.jpg': [45, 15],
  '8 Toed Red Maine Coon Polydactyl Kitten.png': [62, 35],
  'Busok Tonduk.jpg': [25, 30],
  'Kucing Raas Busok - Sumenep.jpg': [22, 38],
  'Ragamuffin kitten-GRACIE.png': [60, 27],
  'Pansy cat.jpg': [62, 52],
  'A breed of cat with a distinct colorpoint coat and blue eyes..jpg': [72, 48],
  'Sergei, Tail Stripes.jpg': [68, 48],
  'Savannah Cat portrait.jpg': [40, 28],
  'Adult Scottish Fold (cropped).jpg': [58, 58],
  'Straight-eared Scottish Fold.jpg': [38, 25],
  'Serengetimalecat.jpg': [30, 30],
  'WedgeheadSealpointSiamese (cropped).JPG': [35, 40],
  'Tortie Pt IMG 2181.jpg': [68, 35],
  'Siberian cat tail (cropped).JPG': [30, 20],
  'SIB Ch. RU*Neva\'s Legend Kleopatra (4502477968).jpg': [45, 40],
  'Singapura Cats.jpg': [50, 30],
  'Yin and Yang.jpg': [48, 42],
  'Hattikatin Lumipyry.JPG': [28, 32],
  'Pair of Snowshoe Siamese Kittens.jpg': [52, 30],
  'Kimburu Sungvra Sana SOK n 22 (front).jpg': [62, 15],
  'Sokoke dalili.jpg': [35, 25],
  'Сомалийская кошка.jpg': [72, 30],
  'Cat Somali.jpg': [42, 30],
  'Cat Sphynx. Kittens. img 48.jpg': [55, 45],
  'Suphalak Female in Thailand named AumDaengManee.jpg': [50, 38],
  'SuphalakAyodia.jpg': [32, 45],
  'Тайский кот Луламей Тайская Легенда, Чемпион мира по системе WCF, окрас блю поинт 01 (cropped).jpg': [65, 48],
  'Тайская кошка Синка Тайна Таун, WCF, окрас сил поинт.jpg': [48, 40],
  'A classic seal point Siamese cat.jpg': [52, 42],
  'Tonkinese Cat - Leo.jpg': [48, 28],
  'Chaton tonkinois blue mink (chatterie de l\'Esprit d\'Edenvane).JPG': [58, 28],
  'TOB Velena-Kutc (15818956518) (cropped).jpg': [28, 25],
  'Turkish Angora in Ankara Zoo (AOÇ).JPG': [60, 38],
  'High Limit\'s Aida 7.jpg': [50, 38],
  'Turkish Van.jpg': [22, 55],
  'Ukrainian Levkoy cat.jpg': [50, 38],
  'Ukrainian Levkoy (3417708014).jpg': [50, 45],
  // among the chosen ones
  'Aegean cat Marilyn 30-1-2021.jpg': [50, 25],
  'Jupiter 300DPI.jpg': [75, 15],
  'Cornish Rex - Gatos.jpg': [85, 30],
  '02010 058 Ägyptische Mau, Assuan.jpg': [90, 45],
  'Elmo vom Hause Jung.jpg': [20, 50],
  'Manxcat.jpg': [15, 45],
  'Ocicat 13.06.07 015.jpg': [10, 30],
  'Super flyffy cat (5364339790).jpg': [70, 30],
  'Nice red Persian cat (54331777955).jpg': [90, 40],
  'AnsonRoadLynxJenkinsPowerfulPixieBobMale.JPG': [80, 40],
  'Slinky fl.jpg': [85, 30],
  'Olympus Queenannecats.JPG': [8, 35],
  'BurMau Vega Star, champagne burmese kitten.jpg': [85, 30],
};

/* Makers whose name Commons holds inside a longer note. */
const BY = { 'Bengal - 19.jpg': 'William Crochot' };

const FREE = /^(cc0|cc[ -]by|public domain|pd\b|attribution|fal\b|gfdl)/i;
const strip = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/* Commons records the author as free text. Keep the name; drop the web
   addresses, "User:" prefixes and upload notes around it. */
const author = (html) =>
  strip(html)
    .replace(/https?:\/\/\S+/g, '')
    .replace(/^The original uploader was (.+?) at .*$/i, '$1')
    .replace(/^Photo\s*\(c\)\s*\d{4}\s*/i, '')
    .replace(/^User:/i, '')
    .replace(/\s+or catza\.net$/i, '')
    // "Name from Town, Country", as photographs brought over from Flickr are signed
    .replace(/\s+from\s+[A-Z].*$/, '')
    .replace(/\s+at English Wikipedia$/i, '')
    .replace(/\s*\(talk\).*$/i, '')
    .replace(/^(Unknown author)\1$/i, '$1')
    .trim()
    .slice(0, 60) || 'Unknown author';

async function summary(title) {
  const res = await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}?redirect=true`);
  if (!res.ok) return null;
  const page = await res.json();
  if (page.type !== 'standard') return null;
  // it has to be an article about a cat, not a place or a people of the same name
  if (!/\bcats?\b|\bbreed\b|\bfeline\b/i.test(`${page.description ?? ''} ${page.extract ?? ''}`)) return null;
  return page;
}

/* A first guess at where the cat is, as percentages from the left and the top. */
async function focus(buffer) {
  try {
    const size = (await sharp(buffer).toBuffer({ resolveWithObject: true })).info;
    const crop = (await sharp(buffer).resize({ width: 320, height: 320, fit: 'cover', position: 'attention' }).toBuffer({ resolveWithObject: true })).info;
    const clamp = (value) => Math.min(85, Math.max(15, Math.round(value)));
    return {
      fx: Number.isFinite(crop.attentionX) ? clamp((crop.attentionX / size.width) * 100) : 50,
      fy: Number.isFinite(crop.attentionY) ? clamp((crop.attentionY / size.height) * 100) : 40,
    };
  } catch {
    return { fx: 50, fy: 40 };
  }
}

const store = path.join(root, 'public', 'commons');
mkdirSync(store, { recursive: true });
const stored = new Set();

/* Saves one photograph: fetched at a size Commons has ready, fitted inside
   edge pixels, and recorded with its maker and licence. */
async function keep(breed, title, info, edge) {
  const meta = info.extmetadata ?? {};
  const scaled = info.thumburl && info.thumbwidth < info.width;
  const file = await get((scaled ? info.thumburl : info.url).split('?')[0]);
  if (!file.ok) {
    console.log(`  could not fetch ${title} (${file.status})`);
    return null;
  }
  const picture = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  const name = title.replace(/^File:/, '');
  const saved = `${breed.id}-${createHash('sha1').update(name).digest('hex').slice(0, 6)}.jpg`;
  writeFileSync(path.join(store, saved), picture.data);
  stored.add(saved);

  const seen = FOCUS[name] ? { fx: FOCUS[name][0], fy: FOCUS[name][1] } : await focus(picture.data);
  return {
    id: `commons-${saved.replace(/\.jpg$/, '')}`,
    url: `/commons/${saved}`,
    w: picture.info.width,
    h: picture.info.height,
    ...seen,
    // how wide the original is: the largest one leads where a breed has no other photographs
    full: info.width,
    title: name,
    by: BY[name] ?? author(meta.Artist?.value),
    licence: strip(meta.LicenseShortName?.value),
    licenceUrl: meta.LicenseUrl?.value ?? null,
    page: info.descriptionurl,
  };
}

const infoOf = async (titles, width) => {
  const res = await get(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=${width}&titles=${encodeURIComponent(titles.join('|'))}`,
  );
  if (!res.ok) return new Map();
  const answer = (await res.json()).query ?? {};
  // Commons answers under its own spelling of a title: follow it back to the one that was asked for
  const asked = new Map((answer.normalized ?? []).map((entry) => [entry.to, entry.from]));
  return new Map(Object.values(answer.pages ?? {}).map((entry) => [asked.get(entry.title) ?? entry.title, entry.imageinfo?.[0]]));
};

/* The chosen photographs of a breed, in the order they were chosen, each
   saved at 1600 pixels on its longer side. */
async function chosen(breed) {
  const titles = (CHOSEN[breed.name] ?? []).map((name) => `File:${name}`);
  if (!titles.length) return [];
  const byTitle = await infoOf(titles, 1920);
  const photos = [];
  for (const title of titles) {
    const info = byTitle.get(title);
    if (!info || !/^image\/(jpeg|png)$/.test(info.mime) || !FREE.test(strip(info.extmetadata?.LicenseShortName?.value))) {
      console.log(`  chosen but not usable: ${title}`);
      continue;
    }
    const photo = await keep(breed, title, info, 1600);
    if (photo) photos.push(photo);
    await pause(150);
  }
  return photos;
}

/* Photographs from inside the article, in the order the article shows them.
   Editors chose them to illustrate the breed, which a search of Commons by
   name would not guarantee. A breed the first source already has photographs
   of takes two large ones; a breed with none takes up to three of what there
   is, down to a width a tile can still show sharply; a breed with chosen
   photographs takes one more at most. Each is saved at 1600 pixels on its
   longer side. */
const NOT_A_PORTRAIT = /map|logo|icon|flag|diagram|chart|range|distribution|stamp|coat.of.arms|painting|drawing|illustration|skull|skeleton|statue|book|poster|standard/i;
async function photographs(page, breed, hasOwn, already) {
  const list = await get(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(page.title.replace(/ /g, '_'))}`);
  if (!list.ok) return [];
  const kept = KEEP[breed.name] ?? [];
  const titles = ((await list.json()).items ?? [])
    .filter((item) => item.type === 'image' && item.showInGallery !== false && /\.(jpe?g|png)$/i.test(item.title) && !NOT_A_PORTRAIT.test(item.title))
    .map((item) => decodeURIComponent(item.title).replace(/_/g, ' '))
    .filter((title) => {
      const name = title.replace(/^File:/, '');
      return !already.has(name) && (kept.includes(name) || !SKIP.has(name));
    })
    .slice(0, 16);
  if (!titles.length) return [];

  const byTitle = await infoOf(titles, 1280);
  const least = hasOwn ? 1000 : 480;
  const most = already.size >= 2 ? 1 : hasOwn ? 2 : 3;
  const photos = [];
  for (const title of titles) {
    const info = byTitle.get(title);
    if (!info || !/^image\/(jpeg|png)$/.test(info.mime)) continue;
    if (!info.url.includes('/wikipedia/commons/')) continue;
    if (!FREE.test(strip(info.extmetadata?.LicenseShortName?.value))) continue;
    const shape = info.width / info.height;
    if (info.width < least || shape < 0.6 || shape > 2) continue;

    const photo = await keep(breed, title, info, 1600);
    if (!photo) continue;
    photos.push(photo);
    await pause(120);
    if (photos.length === most) break;
  }
  return hasOwn ? photos : photos.sort((a, b) => b.full - a.full);
}

const out = {};
const picked = {};
const seen = new Set();
for (const breed of source.breeds) {
  if ((!breed.origin && !breed.history) || seen.has(breed.name)) continue;
  seen.add(breed.name);

  const first = await chosen(breed);
  if (first.length) picked[breed.id] = first;
  const already = new Set(first.map((photo) => photo.title));

  const candidates = breed.name in TITLES ? [TITLES[breed.name]].filter(Boolean) : [`${breed.name} cat`, breed.name, `${breed.name} (cat)`];
  let page = null;
  for (const title of candidates) {
    page = await summary(title);
    await pause(120);
    if (page) break;
  }
  if (!page) {
    console.log(`  no article: ${breed.name}`);
    continue;
  }
  // an article that is really about something else (a list, a parent breed) cannot stand for the entry
  const about = page.title.toLowerCase();
  const name = breed.name.toLowerCase();
  const own = about === name || about === `${name} cat` || about === `${name} (cat)` || ALSO_KNOWN[breed.name] === page.title;
  if (!own) {
    console.log(`  article is about something else: ${breed.name} -> ${page.title}`);
    continue;
  }
  const photos = await photographs(page, breed, source.photos[breed.id]?.length > 0, already);
  await pause(150);
  out[breed.id] = {
    title: page.title,
    url: page.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    extract: page.extract ?? '',
    photos,
  };
}

// photographs kept by an earlier run and no longer chosen
for (const file of readdirSync(store)) if (!stored.has(file)) rmSync(path.join(store, file));

const fetched = new Date().toISOString().slice(0, 10);
writeFileSync(path.join(root, 'data', 'wikimedia.json'), `${JSON.stringify({ fetched, entries: out, chosen: picked }, null, 1)}\n`);
const entries = Object.values(out);
console.log(
  `wikimedia: ${entries.length} articles, ${entries.filter((entry) => entry.photos.length).length} with photographs from the article, ${Object.keys(picked).length} breeds with chosen photographs (${stored.size} saved in all), dated ${fetched}`,
);
