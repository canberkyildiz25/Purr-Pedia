import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Lang } from '../i18n/translations'

const STORAGE_KEY = 'purr_lang'

export const detectLanguage = createAsyncThunk('language/detect', async (): Promise<Lang> => {
  // 1. Respect saved user preference
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'tr' || saved === 'en') return saved

  // 2. IP-based detection
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch('https://ipapi.co/country/', { signal: controller.signal })
    clearTimeout(timeout)
    const country = (await res.text()).trim()
    return country === 'TR' ? 'tr' : 'en'
  } catch {
    // 3. Fallback: browser language
    return navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en'
  }
})

interface LanguageState {
  lang: Lang
  ready: boolean
}

const languageSlice = createSlice({
  name: 'language',
  initialState: { lang: 'en' as Lang, ready: false } as LanguageState,
  reducers: {
    setLanguage(state, action: PayloadAction<Lang>) {
      state.lang = action.payload
      state.ready = true
      localStorage.setItem(STORAGE_KEY, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(detectLanguage.fulfilled, (state, action) => {
      state.lang = action.payload
      state.ready = true
    })
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
