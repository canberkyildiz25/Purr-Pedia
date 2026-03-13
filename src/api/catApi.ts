import axios from 'axios'
import type { Breed, CatImage } from '../types/cat'

const BASE_URL = 'https://api.thecatapi.com/v1'

// https://thecatapi.com adresinden ücretsiz key alabilirsiniz.
// .env dosyasına VITE_CAT_API_KEY=your_key şeklinde ekleyin.
const API_KEY = (import.meta as { env: Record<string, string> }).env['VITE_CAT_API_KEY'] ?? ''

const catApi = axios.create({
  baseURL: BASE_URL,
  headers: API_KEY ? { 'x-api-key': API_KEY } : {},
})

export async function fetchBreeds(): Promise<Breed[]> {
  const { data } = await catApi.get<Breed[]>('/breeds')
  return data
}

export async function fetchBreedById(breedId: string): Promise<Breed> {
  const { data } = await catApi.get<Breed>(`/breeds/${breedId}`)
  return data
}

export async function fetchBreedImages(breedId: string, limit = 8): Promise<CatImage[]> {
  const { data } = await catApi.get<CatImage[]>('/images/search', {
    params: {
      breed_ids: breedId,
      limit,
    },
  })
  return data
}

export async function searchBreeds(query: string): Promise<Breed[]> {
  const { data } = await catApi.get<Breed[]>('/breeds/search', {
    params: { q: query },
  })
  return data
}
