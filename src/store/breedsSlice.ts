import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchBreeds } from '../api/catApi'
import type { Breed } from '../types/cat'

interface BreedsState {
  items: Breed[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: BreedsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const loadBreeds = createAsyncThunk('breeds/loadBreeds', async () => {
  return await fetchBreeds()
})

const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBreeds.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadBreeds.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadBreeds.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      })
  },
})

export default breedsSlice.reducer
