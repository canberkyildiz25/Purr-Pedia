import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY = 'purr_favorites'

function loadFromStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

interface FavoritesState {
  ids: string[]
}

const initialState: FavoritesState = {
  ids: loadFromStorage(),
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((f) => f !== id)
      } else {
        state.ids.push(id)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids))
    },
    clearAllFavorites(state) {
      state.ids = []
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})

export const { toggleFavorite, clearAllFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
