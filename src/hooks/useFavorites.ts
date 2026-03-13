import { useState, useCallback } from 'react'

const STORAGE_KEY = 'purr_favorites'

function loadFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

let globalFavorites: string[] = loadFavorites()
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((fn) => fn())
}

export function useFavorites() {
  const [, setTick] = useState(0)

  const rerender = useCallback(() => setTick((t) => t + 1), [])

  useState(() => {
    listeners.add(rerender)
    return () => {
      listeners.delete(rerender)
    }
  })

  const isFavorite = (id: string) => globalFavorites.includes(id)

  const toggleFavorite = (id: string) => {
    if (globalFavorites.includes(id)) {
      globalFavorites = globalFavorites.filter((f) => f !== id)
    } else {
      globalFavorites = [...globalFavorites, id]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalFavorites))
    notify()
  }

  return { favorites: globalFavorites, isFavorite, toggleFavorite }
}
