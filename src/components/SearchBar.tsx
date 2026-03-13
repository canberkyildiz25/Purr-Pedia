import { useState, useRef, useEffect } from 'react'
import { useT } from '../i18n/useT'
import type { Breed } from '../types/cat'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  breeds?: Breed[]
}

export default function SearchBar({ value, onChange, breeds = [] }: SearchBarProps) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestions =
    value.trim().length > 1
      ? breeds.filter((b) => b.name.toLowerCase().includes(value.toLowerCase())).slice(0, 6)
      : []

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={t('search_placeholder')}
        className="w-full pl-12 pr-4 py-3.5 bg-white border border-orange-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purr-400 focus:border-transparent shadow-sm transition-all"
      />
      {value && (
        <button
          onClick={() => { onChange(''); setOpen(false) }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg transition-colors"
        >
          ✕
        </button>
      )}

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((breed) => (
            <button
              key={breed.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(breed.name); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-orange-50 transition-colors"
            >
              {breed.image?.url && (
                <img
                  src={breed.image.url}
                  alt=""
                  className="w-9 h-9 rounded-xl object-cover shrink-0"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{breed.name}</p>
                <p className="text-xs text-gray-400">{breed.origin}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
