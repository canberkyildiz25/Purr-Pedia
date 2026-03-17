import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearComparison } from '../store/comparisonSlice'
import { useT } from '../i18n/useT'

export default function ComparisonBar() {
  const ids = useAppSelector((s) => s.comparison.ids)
  const allBreeds = useAppSelector((s) => s.breeds.items)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const t = useT()

  if (ids.length === 0) return null

  const breeds = ids
    .map((id) => allBreeds.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-white border border-orange-200 rounded-2xl shadow-2xl px-4 py-3 max-w-[calc(100vw-2rem)]">
        <div className="flex items-center gap-2 flex-wrap">
          {breeds.map((b, i) => (
            <div key={b.id} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-gray-300 text-xs font-bold">{t('compare_vs')}</span>}
              {b.image?.url && (
                <img
                  src={b.image.url}
                  alt={b.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-purr-200 shrink-0"
                />
              )}
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{b.name}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-1 shrink-0">
          <button
            onClick={() => navigate('/compare')}
            className="btn-primary text-sm py-1.5 px-4 whitespace-nowrap"
          >
            {t('compare_now')}
          </button>
          <button
            onClick={() => dispatch(clearComparison())}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5 whitespace-nowrap"
          >
            {t('compare_clear')}
          </button>
        </div>
      </div>
    </div>
  )
}
