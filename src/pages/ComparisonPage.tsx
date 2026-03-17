import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearComparison } from '../store/comparisonSlice'
import { useT } from '../i18n/useT'
import StatBar from '../components/StatBar'
import type { Breed } from '../types/cat'

const STATS: { key: keyof Breed; labelKey: string }[] = [
  { key: 'adaptability', labelKey: 'stat_adaptability' },
  { key: 'affection_level', labelKey: 'stat_affection' },
  { key: 'child_friendly', labelKey: 'stat_child_friendly' },
  { key: 'dog_friendly', labelKey: 'stat_dog_friendly' },
  { key: 'energy_level', labelKey: 'stat_energy' },
  { key: 'intelligence', labelKey: 'stat_intelligence' },
  { key: 'social_needs', labelKey: 'stat_social_needs' },
  { key: 'stranger_friendly', labelKey: 'stat_stranger_friendly' },
  { key: 'vocalisation', labelKey: 'stat_vocalisation' },
  { key: 'grooming', labelKey: 'stat_grooming' },
  { key: 'health_issues', labelKey: 'stat_health' },
  { key: 'shedding_level', labelKey: 'stat_shedding' },
]

export default function ComparisonPage() {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.comparison.ids)
  const allBreeds = useAppSelector((s) => s.breeds.items)
  const t = useT()

  const breeds = ids
    .map((id) => allBreeds.find((b) => b.id === id))
    .filter((b): b is Breed => Boolean(b))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-1">{t('compare_title')}</h1>
          <p className="text-gray-500">{breeds.length} {t('breeds_count').replace('{count}', String(breeds.length))}</p>
        </div>
        {breeds.length > 0 && (
          <button
            onClick={() => dispatch(clearComparison())}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-xl transition-all"
          >
            {t('compare_clear')}
          </button>
        )}
      </div>

      {breeds.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="font-display text-xl font-semibold text-gray-700 mb-2">{t('compare_empty')}</h2>
          <p className="text-gray-400 mb-6">{t('compare_hint')}</p>
          <Link to="/" className="btn-primary">{t('btn_browse_breeds')}</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-44 pb-4" />
                {breeds.map((breed) => (
                  <th key={breed.id} className="min-w-[200px] pb-4 px-3">
                    <Link to={`/breed/${breed.id}`} className="block rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-[4/3] relative bg-gray-100">
                        {breed.image?.url && (
                          <img
                            src={breed.image.url}
                            alt={breed.name}
                            className="w-full h-full object-cover object-top"
                          />
                        )}
                      </div>
                      <div className="p-3 bg-white text-left">
                        <p className="font-display font-bold text-gray-900 text-base">{breed.name}</p>
                        <p className="text-xs text-gray-400">{breed.origin}</p>
                      </div>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATS.map(({ key, labelKey }, idx) => (
                <tr key={key} className={idx % 2 === 0 ? 'bg-orange-50/30' : ''}>
                  <td className="py-3 pr-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {t(labelKey as Parameters<typeof t>[0])}
                  </td>
                  {breeds.map((breed) => {
                    const val = (breed[key] as number) ?? 0
                    return (
                      <td key={breed.id} className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <StatBar label="" value={val} max={5} />
                          </div>
                          <span className="text-xs font-semibold text-gray-500 w-4 text-right">{val}</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
