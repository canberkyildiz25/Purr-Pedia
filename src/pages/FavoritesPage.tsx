import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadBreeds } from '../store/breedsSlice'
import { useT } from '../i18n/useT'
import BreedCard from '../components/BreedCard'

export default function FavoritesPage() {
  const dispatch = useAppDispatch()
  const { items: allBreeds, status } = useAppSelector((s) => s.breeds)
  const favoriteIds = useAppSelector((s) => s.favorites.ids)
  const t = useT()

  useEffect(() => {
    if (status === 'idle') dispatch(loadBreeds())
  }, [status, dispatch])

  const loading = status === 'loading' || status === 'idle'
  const favoriteBreeds = allBreeds.filter((b) => favoriteIds.includes(b.id))

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl animate-bounce">🐱</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          {t('my_favorites')} ❤️
        </h1>
        <p className="text-gray-500">{t('breeds_saved', { count: String(favoriteBreeds.length) })}</p>
      </div>

      {favoriteBreeds.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🤍</div>
          <h2 className="font-display text-xl font-semibold text-gray-700 mb-2">{t('no_favorites_title')}</h2>
          <p className="text-gray-400 mb-6">{t('no_favorites_desc')}</p>
          <Link to="/" className="btn-primary">{t('btn_browse_breeds')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteBreeds.map((breed) => (
            <BreedCard key={breed.id} breed={breed} />
          ))}
        </div>
      )}
    </div>
  )
}
