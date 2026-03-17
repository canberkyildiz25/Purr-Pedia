import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadBreeds } from '../store/breedsSlice'
import { clearAllFavorites } from '../store/favoritesSlice'
import { useT } from '../i18n/useT'
import BreedCard from '../components/BreedCard'

type FavSort = 'name' | 'affection' | 'energy'

export default function FavoritesPage() {
  const dispatch = useAppDispatch()
  const { items: allBreeds, status } = useAppSelector((s) => s.breeds)
  const favoriteIds = useAppSelector((s) => s.favorites.ids)
  const t = useT()
  const [sort, setSort] = useState<FavSort>('name')

  useEffect(() => {
    if (status === 'idle') dispatch(loadBreeds())
  }, [status, dispatch])

  const loading = status === 'loading' || status === 'idle'

  const favoriteBreeds = useMemo(() => {
    const result = allBreeds.filter((b) => favoriteIds.includes(b.id))
    return [...result].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'affection') return b.affection_level - a.affection_level
      if (sort === 'energy') return b.energy_level - a.energy_level
      return 0
    })
  }, [allBreeds, favoriteIds, sort])

  const stats = useMemo(() => {
    if (favoriteBreeds.length === 0) return null
    const avgEnergy =
      Math.round((favoriteBreeds.reduce((s, b) => s + b.energy_level, 0) / favoriteBreeds.length) * 10) / 10
    const avgAffection =
      Math.round((favoriteBreeds.reduce((s, b) => s + b.affection_level, 0) / favoriteBreeds.length) * 10) / 10
    const originCounts: Record<string, number> = {}
    favoriteBreeds.forEach((b) => {
      originCounts[b.origin] = (originCounts[b.origin] ?? 0) + 1
    })
    const topOrigin = Object.entries(originCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-'
    return { avgEnergy, avgAffection, topOrigin }
  }, [favoriteBreeds])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl animate-bounce">🐱</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            {t('my_favorites')} ❤️
          </h1>
          <p className="text-gray-500">{t('breeds_saved').replace('{count}', String(favoriteBreeds.length))}</p>
        </div>
        {favoriteBreeds.length > 0 && (
          <button
            onClick={() => dispatch(clearAllFavorites())}
            className="text-sm text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-xl transition-all"
          >
            {t('btn_remove_all_favorites')}
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: t('fav_stats_avg_energy'), value: `${stats.avgEnergy} / 5` },
            { label: t('fav_stats_avg_affection'), value: `${stats.avgAffection} / 5` },
            { label: t('fav_stats_top_origin'), value: stats.topOrigin },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-lg font-bold text-purr-600 truncate">{value}</p>
            </div>
          ))}
        </div>
      )}

      {favoriteBreeds.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🤍</div>
          <h2 className="font-display text-xl font-semibold text-gray-700 mb-2">{t('no_favorites_title')}</h2>
          <p className="text-gray-400 mb-6">{t('no_favorites_desc')}</p>
          <Link to="/" className="btn-primary">{t('btn_browse_breeds')}</Link>
        </div>
      ) : (
        <>
          {/* Sort */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-500">{t('fav_sort_label')}</span>
            {(['name', 'affection', 'energy'] as FavSort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  sort === s
                    ? 'bg-purr-500 text-white shadow-sm'
                    : 'bg-white border border-orange-200 text-gray-600 hover:bg-orange-50'
                }`}
              >
                {s === 'name' ? t('fav_sort_name') : s === 'affection' ? t('fav_sort_affection') : t('fav_sort_energy')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteBreeds.map((breed) => (
              <BreedCard key={breed.id} breed={breed} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
