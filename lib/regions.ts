/* The atlas is filed by place. A place is a country or territory as the source
   names it; places are gathered into six regions, and a region is also a
   colour (see globals.css). */

export type RegionKey = 'americas' | 'isles' | 'europe' | 'westasia' | 'east' | 'everywhere';

export interface Region {
  key: RegionKey;
  name: string;
}

export const REGIONS: Region[] = [
  { key: 'americas', name: 'The Americas' },
  { key: 'isles', name: 'The British Isles' },
  { key: 'europe', name: 'Europe & Russia' },
  { key: 'westasia', name: 'West Asia & Africa' },
  { key: 'east', name: 'East Asia & the Pacific' },
  { key: 'everywhere', name: 'No single place' },
];

export const regionByKey = (key: RegionKey) => REGIONS.find((region) => region.key === key) as Region;

export interface Place {
  slug: string;
  name: string;
  region: RegionKey;
  /** Where the place's mark sits on the map. */
  lon: number;
  lat: number;
}

/* Keyed by the word the source uses in its "origin" field. */
export const PLACES: Record<string, Place> = {
  'United States': { slug: 'united-states', name: 'United States', region: 'americas', lon: -98, lat: 39 },
  Canada: { slug: 'canada', name: 'Canada', region: 'americas', lon: -96, lat: 57 },
  Brazil: { slug: 'brazil', name: 'Brazil', region: 'americas', lon: -52, lat: -10 },

  'United Kingdom': { slug: 'united-kingdom', name: 'United Kingdom', region: 'isles', lon: -1.5, lat: 52.6 },
  Scotland: { slug: 'scotland', name: 'Scotland', region: 'isles', lon: -4, lat: 57 },
  'Isle of Man': { slug: 'isle-of-man', name: 'Isle of Man', region: 'isles', lon: -4.6, lat: 54.2 },

  France: { slug: 'france', name: 'France', region: 'europe', lon: 2.5, lat: 46.6 },
  Germany: { slug: 'germany', name: 'Germany', region: 'europe', lon: 10.4, lat: 51.1 },
  Norway: { slug: 'norway', name: 'Norway', region: 'europe', lon: 8.5, lat: 61 },
  Sweden: { slug: 'sweden', name: 'Sweden', region: 'europe', lon: 15.5, lat: 62.5 },
  Italy: { slug: 'italy', name: 'Italy', region: 'europe', lon: 12.5, lat: 42.8 },
  Greece: { slug: 'greece', name: 'Greece', region: 'europe', lon: 22.5, lat: 39 },
  Ukraine: { slug: 'ukraine', name: 'Ukraine', region: 'europe', lon: 31.5, lat: 49 },
  Russia: { slug: 'russia', name: 'Russia', region: 'europe', lon: 48, lat: 57 },

  Turkey: { slug: 'turkey', name: 'Türkiye', region: 'westasia', lon: 35, lat: 39 },
  Cyprus: { slug: 'cyprus', name: 'Cyprus', region: 'westasia', lon: 33.2, lat: 35 },
  Israel: { slug: 'israel', name: 'Israel', region: 'westasia', lon: 35, lat: 31.4 },
  'United Arab Emirates': { slug: 'united-arab-emirates', name: 'United Arab Emirates', region: 'westasia', lon: 54.3, lat: 24 },
  'Iran (Persia)': { slug: 'iran', name: 'Iran', region: 'westasia', lon: 53.5, lat: 32.5 },
  Egypt: { slug: 'egypt', name: 'Egypt', region: 'westasia', lon: 30, lat: 27 },
  Kenya: { slug: 'kenya', name: 'Kenya', region: 'westasia', lon: 38, lat: 0.3 },

  Thailand: { slug: 'thailand', name: 'Thailand', region: 'east', lon: 101, lat: 15.5 },
  'Myanmar (Burma)': { slug: 'myanmar', name: 'Myanmar', region: 'east', lon: 96, lat: 21.5 },
  China: { slug: 'china', name: 'China', region: 'east', lon: 104, lat: 35 },
  Japan: { slug: 'japan', name: 'Japan', region: 'east', lon: 138, lat: 36.5 },
  Singapore: { slug: 'singapore', name: 'Singapore', region: 'east', lon: 103.8, lat: 1.35 },
  Indonesia: { slug: 'indonesia', name: 'Indonesia', region: 'east', lon: 114.5, lat: -7.1 },
  Australia: { slug: 'australia', name: 'Australia', region: 'east', lon: 134, lat: -25 },
};
