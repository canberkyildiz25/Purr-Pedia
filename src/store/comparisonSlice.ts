import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const MAX_COMPARE = 3

interface ComparisonState {
  ids: string[]
}

const initialState: ComparisonState = { ids: [] }

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    toggleComparison(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id)
      } else if (state.ids.length < MAX_COMPARE) {
        state.ids.push(id)
      }
    },
    clearComparison(state) {
      state.ids = []
    },
  },
})

export const { toggleComparison, clearComparison } = comparisonSlice.actions
export default comparisonSlice.reducer
