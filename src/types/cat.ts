export interface Weight {
  imperial: string
  metric: string
}

export interface Breed {
  id: string
  name: string
  origin: string
  description: string
  temperament: string
  life_span: string
  weight: Weight
  adaptability: number
  affection_level: number
  child_friendly: number
  dog_friendly: number
  energy_level: number
  grooming: number
  health_issues: number
  intelligence: number
  shedding_level: number
  social_needs: number
  stranger_friendly: number
  vocalisation: number
  indoor: number
  lap: number
  wikipedia_url?: string
  reference_image_id?: string
  image?: CatImage
  country_code?: string
  hypoallergenic: number
  rare: number
  experimental: number
  natural: number
  suppressed_tail: number
  short_legs: number
  hairless: number
}

export interface CatImage {
  id: string
  url: string
  width: number
  height: number
  breeds?: Breed[]
}

export type SortOption = 'name_asc' | 'name_desc' | 'origin' | 'intelligence' | 'affection'
export type FilterOption = 'all' | 'hypoallergenic' | 'lap' | 'indoor' | 'rare'
