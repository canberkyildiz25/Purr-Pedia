import { useT } from '../i18n/useT'
import type { FilterOption, SortOption } from '../types/cat'

interface FilterBarProps {
  filter: FilterOption
  sort: SortOption
  onFilterChange: (f: FilterOption) => void
  onSortChange: (s: SortOption) => void
  total: number
}

export default function FilterBar({ filter, sort, onFilterChange, onSortChange, total }: FilterBarProps) {
  const t = useT()

  const FILTERS: { value: FilterOption; label: string }[] = [
    { value: 'all', label: t('filter_all') },
    { value: 'hypoallergenic', label: t('filter_hypoallergenic') },
    { value: 'lap', label: t('filter_lap') },
    { value: 'indoor', label: t('filter_indoor') },
    { value: 'rare', label: t('filter_rare') },
  ]

  const SORTS: { value: SortOption; label: string }[] = [
    { value: 'name_asc', label: t('sort_name_asc') },
    { value: 'name_desc', label: t('sort_name_desc') },
    { value: 'origin', label: t('sort_origin') },
    { value: 'intelligence', label: t('sort_intelligence') },
    { value: 'affection', label: t('sort_affection') },
  ]

  return (
    <div className="flex items-center justify-end gap-3">
      <span className="text-sm text-gray-500">{t('breeds_count', { count: String(total) })}</span>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="text-sm bg-white border border-orange-200 rounded-xl px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purr-300 cursor-pointer"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  )
}
