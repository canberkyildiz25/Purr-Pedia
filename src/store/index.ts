import { configureStore } from '@reduxjs/toolkit'
import breedsReducer from './breedsSlice'
import favoritesReducer from './favoritesSlice'
import filtersReducer from './filtersSlice'
import languageReducer from './languageSlice'
import comparisonReducer from './comparisonSlice'

export const store = configureStore({
  reducer: {
    breeds: breedsReducer,
    favorites: favoritesReducer,
    filters: filtersReducer,
    language: languageReducer,
    comparison: comparisonReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
