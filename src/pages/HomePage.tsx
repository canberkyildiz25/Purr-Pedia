import { useEffect, useMemo, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadBreeds } from '../store/breedsSlice'
import { setSearch, setFilter, setSort, clearFilters, PAGE_SIZE } from '../store/filtersSlice'
import { useT } from '../i18n/useT'
import type { Breed, FilterOption, SortOption } from '../types/cat'
import BreedCard from '../components/BreedCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import SkeletonCard from '../components/SkeletonCard'
import HeroSlideshow from '../components/HeroSlideshow'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { items: breeds, status, error } = useAppSelector((s) => s.breeds)
  const { search, filter, sort } = useAppSelector((s) => s.filters)
  const t = useT()
  const [searchParams, setSearchParams] = useSearchParams()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Sync URL → Redux on mount (once)
  useEffect(() => {
    const q = searchParams.get('q')
    const f = searchParams.get('filter') as FilterOption | null
    const s = searchParams.get('sort') as SortOption | null
    if (q) dispatch(setSearch(q))
    if (f) dispatch(setFilter(f))
    if (s) dispatch(setSort(s))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync Redux → URL
  useEffect(() => {
    const params: Record<string, string> = {}
    if (search) params.q = search
    if (filter !== 'all') params.filter = filter
    if (sort !== 'name_asc') params.sort = sort
    setSearchParams(params, { replace: true })
  }, [search, filter, sort, setSearchParams])

  useEffect(() => {
    if (status === 'idle') dispatch(loadBreeds())
  }, [status, dispatch])

  const filtered = useMemo(() => {
    let result: Breed[] = breeds

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.origin.toLowerCase().includes(q) ||
          b.temperament.toLowerCase().includes(q),
      )
    }

    if (filter === 'hypoallergenic') result = result.filter((b) => b.hypoallergenic === 1)
    else if (filter === 'lap') result = result.filter((b) => b.lap === 1)
    else if (filter === 'indoor') result = result.filter(
      (b) => b.indoor === 1 || (b.energy_level <= 3 && b.adaptability >= 3 && b.vocalisation <= 3)
    )
    else if (filter === 'rare') result = result.filter((b) => b.rare === 1)

    result = [...result].sort((a, b) => {
      if (sort === 'name_asc') return a.name.localeCompare(b.name)
      if (sort === 'name_desc') return b.name.localeCompare(a.name)
      if (sort === 'origin') return a.origin.localeCompare(b.origin)
      if (sort === 'intelligence') return b.intelligence - a.intelligence
      if (sort === 'affection') return b.affection_level - a.affection_level
      return 0
    })

    return result
  }, [breeds, search, filter, sort])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [search, filter, sort])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const loading = status === 'loading' || status === 'idle'

  const loadMore = useCallback(() => {
    if (hasMore) setVisibleCount((c) => c + PAGE_SIZE)
  }, [hasMore])

  const sentinelRef = useInfiniteScroll(loadMore)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero with slideshow background */}
      <div className="relative rounded-3xl overflow-hidden mb-10 min-h-[300px] sm:min-h-[340px] flex flex-col items-center justify-center text-center px-6 py-10">
        <HeroSlideshow />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm">
            <span className="text-3xl sm:text-4xl">🐾</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
            {t('hero_title')}{' '}
            <span className="text-orange-300">{t('hero_title_highlight')}</span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed drop-shadow">
            {t('hero_description')}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={search} onChange={(v) => dispatch(setSearch(v))} breeds={breeds} />
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterBar
          filter={filter}
          sort={sort}
          onFilterChange={(v) => dispatch(setFilter(v))}
          onSortChange={(v) => dispatch(setSort(v))}
          total={filtered.length}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😿</div>
          <p className="text-gray-600 text-lg">{t('error_load')}</p>
          <button onClick={() => dispatch(loadBreeds())} className="mt-4 btn-primary">
            {t('btn_retry')}
          </button>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
            : visible.map((breed) => <BreedCard key={breed.id} breed={breed} />)}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {!loading && !error && hasMore && (
        <div ref={sentinelRef} className="py-8 flex justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-purr-200 border-t-purr-500 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-600 text-lg">{t('no_results', { search })}</p>
          <button onClick={() => dispatch(clearFilters())} className="mt-4 btn-primary">
            {t('btn_clear_filters')}
          </button>
        </div>
      )}
    </div>
  )
}
