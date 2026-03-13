import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadBreeds } from '../store/breedsSlice'
import { setSearch, setFilter, setSort, setPage, clearFilters, PAGE_SIZE } from '../store/filtersSlice'
import { useT } from '../i18n/useT'
import type { Breed } from '../types/cat'
import BreedCard from '../components/BreedCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import SkeletonCard from '../components/SkeletonCard'
import HeroSlideshow from '../components/HeroSlideshow'

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (p: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 border border-orange-200 bg-white hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
              p === page
                ? 'bg-purr-500 text-white shadow-sm'
                : 'border border-orange-200 bg-white text-gray-600 hover:bg-orange-50'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 border border-orange-200 bg-white hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        →
      </button>
    </div>
  )
}

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { items: breeds, status, error } = useAppSelector((s) => s.breeds)
  const { search, filter, sort, page } = useAppSelector((s) => s.filters)
  const t = useT()

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
    else if (filter === 'indoor') result = result.filter((b) => b.indoor === 1)
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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const loading = status === 'loading' || status === 'idle'

  const handlePage = (p: number) => {
    dispatch(setPage(p))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero with slideshow background */}
      <div className="relative rounded-3xl overflow-hidden mb-10 min-h-[500px] sm:min-h-[580px] flex flex-col items-center justify-center text-center px-6 py-14 sm:py-16">
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
        <SearchBar value={search} onChange={(v) => dispatch(setSearch(v))} />
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
            : paginated.map((breed) => <BreedCard key={breed.id} breed={breed} />)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
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
