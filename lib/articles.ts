/* The articles: short pieces on living with a cat. Each one is a summary of
   what its sources say, and names them. A sentence with a number in it has
   that number from the source listed under the article; nothing here is a
   guess, and nothing here is advice about one particular cat. */

import covers from '@/data/covers.json';

export type Topic = 'Feeding' | 'Care' | 'Health' | 'Behaviour';

export const TOPICS: { key: Topic; say: string }[] = [
  { key: 'Feeding', say: 'What goes in the bowl, and how much water.' },
  { key: 'Care', say: 'The everyday things a cat cannot do for itself.' },
  { key: 'Health', say: 'What to watch for, and when to go to a vet.' },
  { key: 'Behaviour', say: 'What a cat is doing, and what it is telling you.' },
];

export interface ArticleSource {
  who: string;
  title: string;
  url: string;
}

/** The photograph at the head of an article: where it is, what it shows, and whose it is. */
export interface Cover {
  key: string;
  src: string;
  alt: string;
  /** The file's name on Wikimedia Commons, and its page there. */
  title: string;
  page: string;
  by: string;
  licence: string;
  licenceUrl: string | null;
}

export interface Article {
  slug: string;
  topic: Topic;
  title: string;
  /** One sentence under the title. */
  dek: string;
  minutes: number;
  cover: Cover;
  /** The article in a few lines, for a reader who will read nothing else. */
  short: string[];
  sections: { heading: string; text: string[] }[];
  sources: ArticleSource[];
  /** Where on the site the subject goes further. */
  more?: { label: string; href: string };
}

const CORNELL = 'Cornell Feline Health Center';
const cornell = (page: string) => `https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/${page}`;

export const COVER_SIZE = { width: covers.width, height: covers.height };

/** A cover by its key in data/covers.json, with the words that describe it. */
function cover(key: keyof typeof covers.covers, alt: string): Cover {
  return { key, src: `/articles/${key}.jpg`, alt, ...covers.covers[key] };
}

/** The month the sources were last read. */
export const CHECKED = 'October 2026';

export const ARTICLES: Article[] = [
  {
    slug: 'what-to-feed-a-cat',
    topic: 'Feeding',
    title: 'What to feed a cat',
    dek: 'Meat, a label that says complete, and fewer treats than you think.',
    minutes: 3,
    cover: cover('feeding', 'A black and white cat crouched behind a plate of dry food, looking at the camera'),
    short: [
      'Buy food whose label says it is complete and balanced for your cat’s stage of life.',
      'Keep treats under 10 to 15 percent of the day’s calories.',
      'No raw meat, and no saucer of milk.',
      'You should be able to feel the ribs. If you cannot, talk to a vet before you cut the food.',
    ],
    sections: [
      {
        heading: 'A cat is built to eat meat',
        text: [
          'Cats are obligate carnivores: they rely on nutrients that are found only in animal products. The diet they are built for is high in protein, moderate in fat and very low in carbohydrate.',
          'A diet like that is hard to get right from a recipe at home. The Cornell Feline Health Center’s general recommendation is to buy a nutritionally balanced commercial food.',
        ],
      },
      {
        heading: 'What the label should say',
        text: [
          'Two things. That the food is complete and balanced, and which stage of life it is balanced for: a kitten, an adult, or a pregnant or nursing cat need different things. In the United States the wording refers to AAFCO, the body that sets the standard.',
          'A cat on a complete food does not need supplements, and should not be given any without a vet’s say-so.',
        ],
      },
      {
        heading: 'Dry, wet, or both',
        text: [
          'The difference is mostly water. Dry food is between 6 and 10 percent water, semi-moist food about 35 percent, and canned food at least 75 percent.',
          'Any of them can be a complete diet. What changes is how much the cat then has to drink, which is its own subject.',
        ],
      },
      {
        heading: 'What to leave out',
        text: [
          'Raw meat is not recommended, because of the diseases it can carry. Canned fish made for people can cause neurological disorders in cats. Milk is not generally recommended either: many cats are lactose-intolerant.',
          'Treats are fine as treats. A good rule of thumb is to keep them under 10 to 15 percent of the day’s calories.',
        ],
      },
      {
        heading: 'How much is too much',
        text: [
          'Obesity is the most frequently seen nutritional disorder in pet cats. A cat is generally called obese at 20 percent or more above its normal weight, and about half the cats seen at veterinary clinics are overweight.',
          'A cat at a healthy weight has a waist you can see from above and ribs you can feel easily under a thin layer of fat. If yours has neither, ask a vet to set the amount and the pace. Do not put a cat on a crash diet.',
        ],
      },
    ],
    sources: [
      { who: CORNELL, title: 'Feeding your cat', url: cornell('feeding-your-cat') },
      { who: CORNELL, title: 'Obesity', url: cornell('obesity') },
    ],
    more: { label: 'Every breed’s weight on one scale', href: '/sizes/' },
  },
  {
    slug: 'getting-a-cat-to-drink',
    topic: 'Feeding',
    title: 'Getting a cat to drink enough',
    dek: 'About a cup a day for a ten-pound cat, counting what is in the food.',
    minutes: 2,
    cover: cover('drinking', 'A calico cat drinking from a puddle, its reflection in the water'),
    short: [
      'Fresh water, always, somewhere easy to reach.',
      'Wet food counts: it can be up to 80 percent water.',
      'Try a fountain, or a second bowl in another room.',
      'Sunken eyes, tacky gums or skin that stays lifted mean a vet, today.',
    ],
    sections: [
      {
        heading: 'How much',
        text: [
          'A cat needs about 4 ounces of water for every five pounds of lean body weight each day. For an average ten-pound cat (4.5 kg) that is about one cup, roughly 240 ml.',
          'Not all of it comes from the bowl. Wet food can be up to 80 percent water, so a cat on wet food drinks less, and a cat on dry food has to make up most of the amount by drinking.',
        ],
      },
      {
        heading: 'Ways to help',
        text: [
          'Keep fresh water where the cat can reach it easily, at all times. Some cats prefer a fountain to a bowl; preferences differ, so it is worth trying.',
          'Feeding wet food, or adding water to meals, raises the total without the cat noticing. A little liquid from a tin of tuna, or low-sodium chicken broth, can make plain water more interesting.',
          'In a house with more than one cat, check that one of them is not keeping the others from the bowl.',
        ],
      },
      {
        heading: 'How a cat drinks',
        text: [
          'It does not scoop. The tip of the tongue touches the surface and is pulled straight up, a column of water follows it, and the jaw closes before the column falls. A house cat does this about four times a second and takes about a tenth of a millilitre each time.',
        ],
      },
      {
        heading: 'When it is not enough',
        text: [
          'The signs of dehydration are lethargy, weakness, a poor appetite and dry or tacky gums. In a severe case the eyes look sunken. Vets also lift the skin over the shoulders: in a dehydrated cat it is slow to fall back.',
          'Kidney disease, diabetes, an overactive thyroid, vomiting and diarrhoea all make a cat lose more water than usual. If you suspect dehydration, call a vet. It is treated with fluids, under the skin or into a vein.',
        ],
      },
    ],
    sources: [
      { who: CORNELL, title: 'Hydration', url: cornell('hydration') },
      { who: 'Reis, Jung, Aristoff & Stocker, Science, 2010', title: 'How cats lap: water uptake by Felis catus', url: 'https://doi.org/10.1126/science.1195421' },
    ],
    more: { label: 'Watch it slowed down, in the guide', href: '/guide/#lapping' },
  },
  {
    slug: 'the-litter-tray',
    topic: 'Care',
    title: 'The litter tray, done properly',
    dek: 'One more tray than you have cats, and a scoop every day.',
    minutes: 2,
    cover: cover('litter', 'A long-haired tabby cat standing in an open litter tray on a wooden floor'),
    short: [
      'As many trays as cats, plus one.',
      'Quiet, private, away from the food, and in more than one place.',
      'Unscented litter, one to two inches deep, scooped daily.',
      'A cat that stops using the tray goes to a vet first.',
    ],
    sections: [
      {
        heading: 'How many, and where',
        text: [
          'Provide as many trays as there are cats in the house, plus one. Put them in quiet, private places, apart from where the cats eat, and in more than one part of the house, so that a tray can always be reached.',
        ],
      },
      {
        heading: 'Which tray',
        text: [
          'A bigger cat needs a bigger tray. Kittens and old cats need low sides they can step over.',
          'Most cats prefer a tray without a cover: they can see all the way round, and the smell does not build up inside.',
        ],
      },
      {
        heading: 'What goes in it',
        text: ['Most cats prefer unscented litter with a fine texture, about one to two inches (2.5 to 5 cm) deep.'],
      },
      {
        heading: 'Keeping it clean',
        text: [
          'With clumping litter, take out the clumps and the solids every day. As often as it takes to keep the tray dry and clean, empty it, scrub it with a gentle detergent, dry it and refill it. Replace a tray that smells or has cracked.',
        ],
      },
      {
        heading: 'When a cat stops using it',
        text: [
          'Go to a vet before anything else. Several medical conditions make it hard or painful for a cat to pass urine or stool, and they have to be ruled out by an examination and tests.',
          'Clean any soiled spot with a product that takes the smell away completely, and avoid anything with ammonia or vinegar in it.',
        ],
      },
    ],
    sources: [{ who: CORNELL, title: 'Feline behavior problems: house soiling', url: cornell('feline-behavior-problems-house-soiling') }],
    more: { label: 'The five things a cat needs from a home', href: '/care/' },
  },
  {
    slug: 'grooming',
    topic: 'Care',
    title: 'Grooming: what a cat does for itself',
    dek: 'A tongue covered in hollow spines, and about an hour a day.',
    minutes: 2,
    cover: cover('grooming', 'A white cat curled in its bed, licking a front paw with its eyes closed'),
    short: [
      'A cat spends about 4 percent of the day licking itself clean.',
      'The tongue’s spines are hollow and carry saliva down to the skin.',
      'The claws stay sheathed until the cat decides to use them.',
    ],
    sections: [
      {
        heading: 'How much of the day',
        text: [
          'Cats that were filmed around the clock slept or rested for about half of it, and spent about 4 percent of the whole day grooming with the tongue. That is close to an hour, or 8 percent of the time they were awake and moving.',
        ],
      },
      {
        heading: 'How the tongue does it',
        text: [
          'A cat’s tongue is covered in small backward-facing spines called papillae. They are not solid: each one has a hollow at the tip, shaped like a scoop. The hollow picks up saliva from the mouth and releases it deep in the fur, close to the skin, which is how a cat gets itself wet enough to clean with a tongue.',
        ],
      },
      {
        heading: 'Claws',
        text: [
          'At rest the claws sit sheathed in the skin and fur around the toes, which keeps them sharp. A cat puts them out when it chooses to: to climb, to hunt, to fight, and to knead.',
          'Kneading is thought to be left over from nursing, when a newborn presses at its mother to bring milk. Some cats keep it up for life.',
        ],
      },
    ],
    sources: [
      { who: 'Eckstein & Hart, Applied Animal Behaviour Science, 2000', title: 'The organization and control of grooming in cats', url: 'https://doi.org/10.1016/S0168-1591(00)00094-0' },
      { who: 'Noel & Hu, PNAS, 2018', title: 'Cats use hollow papillae to wick saliva into fur', url: 'https://doi.org/10.1073/pnas.1809544115' },
      { who: 'Wikipedia', title: 'Cat: claws', url: 'https://en.wikipedia.org/wiki/Cat#Claws' },
    ],
    more: { label: 'See it filmed, in the guide', href: '/guide/#grooming' },
  },
  {
    slug: 'what-poisons-a-cat',
    topic: 'Health',
    title: 'What in the house can poison a cat',
    dek: 'A short list. Lilies are at the top of it.',
    minutes: 2,
    cover: cover('poisons', 'An Abyssinian cat sitting among hyacinths in flower'),
    short: [
      'Lilies: every part, the pollen and the vase water included.',
      'Paracetamol (acetaminophen) kills cats. Never give it.',
      'Onions, garlic and chives damage red blood cells.',
      'If a cat has eaten any of these, ring a vet at once. Do not wait for signs.',
    ],
    sections: [
      {
        heading: 'Lilies',
        text: [
          'True lilies (Lilium) and daylilies (Hemerocallis). The entire plant is toxic to cats: the stem, the leaves, the flowers, the pollen, and even the water in the vase. A cat can be poisoned by licking a few grains of pollen off its coat.',
          'The kidneys fail within 24 to 72 hours. Speed decides the outcome: if treatment is delayed by 18 hours or more, the damage to the kidneys is generally permanent.',
        ],
      },
      {
        heading: 'Painkillers',
        text: [
          'Paracetamol, sold as acetaminophen in North America, is fatal to cats. They lack some of the liver enzymes needed to break it down.',
          'Other human painkillers are not a safe substitute. Cats are especially sensitive to the side effects of the whole anti-inflammatory family, and none should be given unless a vet has prescribed it.',
        ],
      },
      {
        heading: 'From the kitchen',
        text: [
          'Onions, garlic and chives irritate the gut and can damage red blood cells. Cats are more easily harmed by them than dogs are.',
          'Chocolate, coffee and anything else with caffeine carry a family of stimulants that cause vomiting, an abnormal heart rhythm, tremors and seizures in pets.',
          'Milk is not a poison, but grown animals make little of the enzyme that digests it, and it upsets the stomach.',
        ],
      },
    ],
    sources: [
      { who: 'US Food and Drug Administration', title: 'Lovely lilies and curious cats: a dangerous combination', url: 'https://www.fda.gov/animal-veterinary/animal-health-literacy/lovely-lilies-and-curious-cats-dangerous-combination' },
      { who: 'US Food and Drug Administration', title: 'Get the facts about pain relievers for pets', url: 'https://www.fda.gov/animal-veterinary/animal-health-literacy/get-facts-about-pain-relievers-pets' },
      { who: 'ASPCA Poison Control', title: 'People foods to avoid feeding your pets', url: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets' },
    ],
  },
  {
    slug: 'how-often-to-the-vet',
    topic: 'Health',
    title: 'How often a cat should see a vet',
    dek: 'Once a year at least. Twice, once it is past ten.',
    minutes: 2,
    cover: cover('vet', 'A vet looking into the eye of a tabby kitten with an ophthalmoscope'),
    short: [
      'Every cat: an examination at least once a year.',
      'Past ten years old: at least every six months.',
      'What the vet looks for changes with the cat’s stage of life.',
    ],
    sections: [
      {
        heading: 'Four stages of life',
        text: [
          'The guidelines that American cat vets work to divide a cat’s life in four: kitten, from birth to one year; young adult, from one to six; mature adult, from seven to ten; and senior, past ten.',
        ],
      },
      {
        heading: 'How often',
        text: ['A minimum of one examination a year for every cat, and at least one every six months for seniors.'],
      },
      {
        heading: 'What changes from stage to stage',
        text: [
          'For a kitten the emphasis is on getting it used to people, handling and the world. For a young adult it is on not letting it get fat. For mature and senior cats it is on catching the slow diseases of age early, and on watching the weight in both directions: loss matters as much as gain.',
        ],
      },
    ],
    sources: [{ who: 'Quimby and others, Journal of Feline Medicine and Surgery, 2021', title: '2021 AAHA/AAFP feline life stage guidelines', url: 'https://doi.org/10.1177/1098612X21993657' }],
    more: { label: 'How long each breed is said to live', href: '/sizes/' },
  },
  {
    slug: 'teeth',
    topic: 'Health',
    title: 'Teeth: the trouble most cats have',
    dek: 'Between half and nine in ten cats over four have some form of it.',
    minutes: 2,
    cover: cover('teeth', 'A tabby and white cat yawning in profile, its teeth showing'),
    short: [
      'Between 50 and 90 percent of cats older than four have dental disease.',
      'Bad breath, drooling and a tilted head while chewing are signs.',
      'Brushing is the best prevention, and most cats can be taught to accept it.',
    ],
    sections: [
      {
        heading: 'How common',
        text: [
          'Studies put it at between 50 and 90 percent of cats older than four. The three most common forms are gingivitis, periodontitis and tooth resorption, and the first two are largely preventable or treatable.',
        ],
      },
      {
        heading: 'How it starts',
        text: [
          'With plaque, the film that forms on teeth. Left alone, plaque takes up minerals from the saliva and from the gum itself and hardens into tartar, and the gum along it becomes inflamed.',
          'Tooth resorption is different: the tooth breaks down from the inside. It affects between 30 and 70 percent of cats and is the most common reason a cat loses a tooth.',
        ],
      },
      {
        heading: 'What you might notice',
        text: ['Bad breath. Drooling. A cat that is reluctant to eat, tilts its head as it chews, starts to prefer soft food, or becomes irritable.'],
      },
      {
        heading: 'What helps',
        text: [
          'The best way to prevent gingivitis is to remove plaque regularly by brushing the teeth. It has to be introduced slowly, over about four weeks, and most cats can eventually be trained to accept it.',
        ],
      },
    ],
    sources: [{ who: CORNELL, title: 'Feline dental disease', url: cornell('feline-dental-disease') }],
  },
  {
    slug: 'play-is-hunting-practice',
    topic: 'Behaviour',
    title: 'Play is hunting practice',
    dek: 'Stalk, chase, pounce, catch. A cat needs to do all four.',
    minutes: 2,
    cover: cover('play', 'A tabby and white cat standing on its hind legs, biting a toy mouse it holds in its paws'),
    short: [
      'Play that works like hunting is one of the five things a cat needs from a home.',
      'Use toys that move, and let the cat catch them.',
      'Make some of the food something to find or work for.',
    ],
    sections: [
      {
        heading: 'One of five needs',
        text: [
          'When the two main associations of cat vets wrote down what a cat needs from the place it lives, the chance to play and to act out hunting was one of five things on the list, beside a safe place and a home that smells familiar.',
        ],
      },
      {
        heading: 'What that looks like',
        text: [
          'A hunt has an order to it: finding, stalking, chasing, pouncing, catching. Good play gives a cat the whole sequence, which means toys that move, and an ending in which the cat gets hold of the thing it was after.',
        ],
      },
      {
        heading: 'Food as a puzzle',
        text: [
          'Food can be part of it. A food puzzle is anything the cat has to work at to get its meal out. In the cases vets have written up, cats given puzzles lost weight, grew less aggressive and less fearful, and stopped pestering for attention.',
          'Cats take to them readily. In one shelter study, 23 of 27 cats used a puzzle, and fights between cats that shared a room did not increase.',
        ],
      },
    ],
    sources: [
      { who: 'Ellis and others, Journal of Feline Medicine and Surgery, 2013', title: 'AAFP and ISFM feline environmental needs guidelines', url: 'https://doi.org/10.1177/1098612X13477537' },
      { who: 'Dantas, Delgado, Johnson & Buffington, Journal of Feline Medicine and Surgery, 2016', title: 'Food puzzles for cats: feeding for physical and emotional wellbeing', url: 'https://doi.org/10.1177/1098612X16643753' },
    ],
    more: { label: 'All five needs', href: '/care/' },
  },
  {
    slug: 'reading-a-cat',
    topic: 'Behaviour',
    title: 'Reading a cat',
    dek: 'Four signals that have been tested, and what each one means.',
    minutes: 3,
    cover: cover('reading', 'Two cats walking side by side, one with its tail straight up'),
    short: [
      'Tail straight up: a friendly approach.',
      'A slow blink is an invitation, and you can return it.',
      'The purr a cat uses to ask for food is not its ordinary purr.',
      'Your cat knows its name. Whether it comes is another matter.',
    ],
    sections: [
      {
        heading: 'The tail, straight up',
        text: [
          'A cat raises its tail as it walks up to a cat or a person it means well towards. In a colony of cats living free, the tail went up most often from lower-ranking cats to higher-ranking ones: it is a greeting, and a polite one.',
        ],
      },
      {
        heading: 'The slow blink',
        text: [
          'Narrowing the eyes slowly is a signal between cats and people that works in both directions. Cats narrowed their own eyes more at owners who slow-blinked at them, and were readier to walk up to a stranger who did it than to one who kept a blank face.',
        ],
      },
      {
        heading: 'The purr that asks',
        text: [
          'The purr a cat uses when it wants feeding has a high cry folded inside it. People who heard recordings rated those purrs as more urgent and less pleasant than ordinary ones, whether or not they had ever kept a cat.',
        ],
      },
      {
        heading: 'Its name',
        text: [
          'Cats can tell their own name from other words of the same length, even when a stranger says it. In the experiments they answered with a turn of the ears or the head far more often than by moving towards the voice.',
        ],
      },
    ],
    sources: [
      { who: 'Cafazzo & Natoli, Behavioural Processes, 2009', title: 'The social function of tail up in the domestic cat', url: 'https://doi.org/10.1016/j.beproc.2008.09.008' },
      { who: 'Humphrey and others, Scientific Reports, 2020', title: 'The role of cat eye narrowing movements in cat-human communication', url: 'https://doi.org/10.1038/s41598-020-73426-0' },
      { who: 'McComb, Taylor, Wilson & Charlton, Current Biology, 2009', title: 'The cry embedded within the purr', url: 'https://doi.org/10.1016/j.cub.2009.05.033' },
      { who: 'Saito, Shinozuka, Ito & Hasegawa, Scientific Reports, 2019', title: 'Domestic cats (Felis catus) discriminate their names from other words', url: 'https://doi.org/10.1038/s41598-019-40616-4' },
    ],
    more: { label: 'The guide: what every cat has in common', href: '/guide/' },
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((article) => article.slug === slug);

export const articlesIn = (topic: Topic) => ARTICLES.filter((article) => article.topic === topic);
