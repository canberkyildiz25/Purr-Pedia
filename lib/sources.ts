import films from '@/data/films.json';

/* What the guide and the care page say, and where each statement comes from.
   Every paper was looked up by its DOI, and every number on those two pages
   is the paper's number. */

export interface Source {
  who: string;
  year: number;
  title: string;
  where: string;
  url: string;
}

export const SOURCES = {
  origin: { who: 'Driscoll and others', year: 2007, title: 'The Near Eastern origin of cat domestication', where: 'Science 317', url: 'https://doi.org/10.1126/science.1139518' },
  cyprus: { who: 'Vigne, Guilaine, Debue, Haye & Gérard', year: 2004, title: 'Early taming of the cat in Cyprus', where: 'Science 304', url: 'https://doi.org/10.1126/science.1095335' },
  dispersal: { who: 'Ottoni and others', year: 2017, title: 'The palaeogenetics of cat dispersal in the ancient world', where: 'Nature Ecology & Evolution 1', url: 'https://doi.org/10.1038/s41559-017-0139' },
  lapping: { who: 'Reis, Jung, Aristoff & Stocker', year: 2010, title: 'How cats lap: water uptake by Felis catus', where: 'Science 330', url: 'https://doi.org/10.1126/science.1195421' },
  papillae: { who: 'Noel & Hu', year: 2018, title: 'Cats use hollow papillae to wick saliva into fur', where: 'PNAS 115', url: 'https://doi.org/10.1073/pnas.1809544115' },
  grooming: { who: 'Eckstein & Hart', year: 2000, title: 'The organization and control of grooming in cats', where: 'Applied Animal Behaviour Science 68', url: 'https://doi.org/10.1016/S0168-1591(00)00094-0' },
  catnip: { who: 'Bol and others', year: 2017, title: 'Responsiveness of cats to silver vine, Tatarian honeysuckle, valerian and catnip', where: 'BMC Veterinary Research 13', url: 'https://doi.org/10.1186/s12917-017-0987-6' },
  iridoids: {
    who: 'Uenoyama and others',
    year: 2021,
    title: 'The characteristic response of domestic cats to plant iridoids allows them to gain chemical defense against mosquitoes',
    where: 'Science Advances 7',
    url: 'https://doi.org/10.1126/sciadv.abd9135',
  },
  tail: { who: 'Cafazzo & Natoli', year: 2009, title: 'The social function of tail up in the domestic cat', where: 'Behavioural Processes 80', url: 'https://doi.org/10.1016/j.beproc.2008.09.008' },
  falling: { who: 'Marey', year: 1894, title: 'Photographs of a tumbling cat', where: 'Nature 51', url: 'https://doi.org/10.1038/051080a0' },
  hearing: { who: 'Heffner & Heffner', year: 1985, title: 'Hearing range of the domestic cat', where: 'Hearing Research 19', url: 'https://doi.org/10.1016/0378-5955(85)90100-5' },
  pupils: { who: 'Banks, Sprague, Schmoll, Parnell & Love', year: 2015, title: 'Why do animal eyes have pupils of different shapes?', where: 'Science Advances 1', url: 'https://doi.org/10.1126/sciadv.1500391' },
  sweet: { who: 'Li and others', year: 2005, title: 'Pseudogenization of a sweet-receptor gene accounts for cats’ indifference toward sugar', where: 'PLoS Genetics 1', url: 'https://doi.org/10.1371/journal.pgen.0010003' },
  blink: { who: 'Humphrey, Proops, Forman, Spooner & McComb', year: 2020, title: 'The role of cat eye narrowing movements in cat-human communication', where: 'Scientific Reports 10', url: 'https://doi.org/10.1038/s41598-020-73426-0' },
  names: { who: 'Saito, Shinozuka, Ito & Hasegawa', year: 2019, title: 'Domestic cats (Felis catus) discriminate their names from other words', where: 'Scientific Reports 9', url: 'https://doi.org/10.1038/s41598-019-40616-4' },
  purr: { who: 'McComb, Taylor, Wilson & Charlton', year: 2009, title: 'The cry embedded within the purr', where: 'Current Biology 19', url: 'https://doi.org/10.1016/j.cub.2009.05.033' },
  needs: { who: 'Ellis and others', year: 2013, title: 'AAFP and ISFM feline environmental needs guidelines', where: 'Journal of Feline Medicine and Surgery 15', url: 'https://doi.org/10.1177/1098612X13477537' },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;

/** "Reis, Jung, Aristoff & Stocker, 2010" */
export const short = (key: SourceKey) => `${SOURCES[key].who}, ${SOURCES[key].year}`;

/* The pages the care notes rest on. These are public guidance, not papers. */
export const GUIDANCE = {
  lilies: { who: 'US Food and Drug Administration', title: 'Lovely lilies and curious cats: a dangerous combination', url: 'https://www.fda.gov/animal-veterinary/animal-health-literacy/lovely-lilies-and-curious-cats-dangerous-combination' },
  painkillers: { who: 'US Food and Drug Administration', title: 'Get the facts about pain relievers for pets', url: 'https://www.fda.gov/animal-veterinary/animal-health-literacy/get-facts-about-pain-relievers-pets' },
  foods: { who: 'ASPCA Poison Control', title: 'People foods to avoid feeding your pets', url: 'https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets' },
  feeding: {
    who: 'Cornell Feline Health Center',
    title: 'Feeding your cat',
    url: 'https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feeding-your-cat',
  },
};

export interface Film {
  key: string;
  seconds: number;
  title: string;
  by: string;
  licence: string;
  licenceUrl: string | null;
  page: string;
}
export const FILMS: Film[] = films.films;

/** Films from free stock: which clip, whose it is, and where it is used. */
export const STOCK: { key: string; use: string; from: string; by: string | null; page: string }[] = films.stock;
export const STOCK_LICENCES: Record<string, string> = { Mixkit: 'https://mixkit.co/license/#videoFree', Pexels: 'https://www.pexels.com/license/' };
export const filmByKey = (key: string) => FILMS.find((film) => film.key === key) as Film;
export const FILMS_FETCHED: string = films.fetched;
