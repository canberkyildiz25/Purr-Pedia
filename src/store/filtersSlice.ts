import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { FilterOption, SortOption } from '../types/cat'

export const PAGE_SIZE = 16

interface FiltersState {
  search: string
  filter: FilterOption
  sort: SortOption
  page: number
  modalBreedId: string | null
}

const initialState: FiltersState = {
  search: '',
  filter: 'all',
  sort: 'name_asc',
  page: 1,
  modalBreedId: null,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
      state.page = 1
    },
    setFilter(state, action: PayloadAction<FilterOption>) {
      state.filter = action.payload
      state.page = 1
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    clearFilters(state) {
      state.search = ''
      state.filter = 'all'
      state.page = 1
    },
    openModal(state, action: PayloadAction<string>) {
      state.modalBreedId = action.payload
    },
    closeModal(state) {
      state.modalBreedId = null
    },
  },
})

export const { setSearch, setFilter, setSort, setPage, clearFilters, openModal, closeModal } =
  filtersSlice.actions
export default filtersSlice.reducer
