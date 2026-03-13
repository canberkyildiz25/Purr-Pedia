import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { detectLanguage } from './store/languageSlice'
import { purgeBadCache } from './api/translateApi'

// Run once on load — evicts any MyMemory warning messages stored in cache
purgeBadCache()

const HomePage = lazy(() => import('./pages/HomePage'))
const BreedDetailPage = lazy(() => import('./pages/BreedDetailPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))

function PageLoader() {
  const lang = useAppSelector((s) => s.language.lang)
  return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-purr-200 border-t-purr-500 animate-spin" />
        <p className="text-sm text-gray-400 font-medium">
          {lang === 'tr' ? 'Yükleniyor...' : 'Loading...'}
        </p>
      </div>
    </div>
  )
}

function AppRoutes() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(detectLanguage())
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/breed/:id" element={<BreedDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
