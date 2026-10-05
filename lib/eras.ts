/* When each breed began, read by hand from the history the source gives.

   Three kinds of answer, and nothing is guessed:
   - DATED: the first year or decade the history names as the start of the
     breed ("originated in 1981", "developed in the 1960s", "created in the
     early 2000s"). A range such as "1960s-70s" is filed under its first decade.
     A date of recognition by a registry is not a start and is not used.
   - OLD: the history calls the breed ancient, natural or centuries old and
     gives no founding date.
   - everything else has no date, and the timeline says so.

   The source's wording is kept in `label`. If a snapshot changes a history,
   this file has to be read against it again. */

export const DATED: Record<string, [year: number, label: string]> = {
  abys: [1860, '1860s'],
  abob: [1960, '1960s'],
  acur: [1981, '1981'],
  amer: [1998, '1998'],
  awir: [1966, '1966'],
  asia: [1980, '1980s'],
  amis: [1976, '1976'],
  bali: [1940, '1940s'],
  bamb: [2000, 'early 2000s'],
  beng: [1960, '1960s'],
  birm: [1900, 'early 1900s'],
  bomb: [1950, '1950s'],
  bure: [1930, '1930'],
  buri: [1981, '1981'],
  cspa: [1980, '1980s'],
  ctif: [1960, '1960s'],
  chau: [1960, '1960s'],
  chee: [2000, 'early 2000s'],
  csho: [1940, '1940s'],
  crex: [1950, '1950'],
  cymr: [1960, '1960s'],
  drex: [1960, '1960'],
  dons: [1987, '1987'],
  esho: [1950, '1950s'],
  germ: [1930, '1930'],
  hbro: [1950, '1950s'],
  high: [2004, '2004'],
  hima: [1930, '1930s'],
  lape: [1982, '1982'],
  lyko: [2011, '2011'],
  mins: [1998, '1998'],
  minu: [1990, '1990s'],
  munc: [1983, '1983'],
  nebe: [1980, '1980s'],
  ocic: [1964, '1964'],
  ojos: [1984, '1984'],
  orie: [1950, '1950s'],
  pete: [1994, '1994'],
  pixi: [1980, '1980s'],
  raga: [1990, '1990s'],
  ragd: [1960, '1960s'],
  sava: [1986, '1986'],
  sfol: [1961, '1961'],
  srex: [1987, '1987'],
  sere: [1990, '1990s'],
  skoo: [1990, '1990s'],
  snow: [1960, '1960s'],
  soma: [1960, '1960s'],
  sphy: [1966, '1966'],
  tonk: [1960, '1960s'],
  toyb: [1983, '1983'],
  toyg: [1980, '1980s'],
  ukra: [2000, '2000'],
  ycho: [1983, '1983'],
};

export const OLD = new Set([
  'aege',
  'asho',
  'aphr',
  'amau',
  'braz',
  'bsho',
  'char',
  'cypr',
  'lihu',
  'emau',
  'eshr',
  'jbob',
  'khao',
  'kora',
  'kuri',
  'mcoo',
  'manx',
  'norw',
  'pers',
  'raas',
  'rblu',
  'siam',
  'sibe',
  'soko',
  'suph',
  'thai',
  'tang',
  'tvan',
]);

export type Era = { kind: 'dated'; year: number; decade: number; label: string } | { kind: 'old' } | { kind: 'undated' };

export function eraOf(id: string): Era {
  const dated = DATED[id];
  if (dated) return { kind: 'dated', year: dated[0], decade: Math.floor(dated[0] / 10) * 10, label: dated[1] };
  return OLD.has(id) ? { kind: 'old' } : { kind: 'undated' };
}
