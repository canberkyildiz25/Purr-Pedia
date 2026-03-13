import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Breed } from '../types/cat'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleFavorite } from '../store/favoritesSlice'
import { toggleComparison, MAX_COMPARE } from '../store/comparisonSlice'
import { useT } from '../i18n/useT'
import { translateCountry } from '../i18n/countryNames'
import { translateTemperament } from '../i18n/temperamentMap'
import { translateToTurkish } from '../api/translateApi'
import LazyImage from './LazyImage'

interface BreedCardProps {
  breed: Breed
}

const PLACEHOLDER = 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg'

export default function BreedCard({ breed }: BreedCardProps) {
  const dispatch = useAppDispatch()
  const fav = useAppSelector((s) => s.favorites.ids.includes(breed.id))
  const comparisonIds = useAppSelector((s) => s.comparison.ids)
  const inComparison = comparisonIds.includes(breed.id)
  const comparisonFull = comparisonIds.length >= MAX_COMPARE && !inComparison
  const lang = useAppSelector((s) => s.language.lang)
  const imageUrl = breed.image?.url ?? PLACEHOLDER
  const t = useT()

  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null)

  useEffect(() => {
    if (lang !== 'tr') { setTranslatedDesc(null); return }
    translateToTurkish(breed.description.slice(0, 200)).then(setTranslatedDesc)
  }, [breed.description, lang])

  const displayDesc = translatedDesc ?? breed.description
  const displayOrigin = translateCountry(breed.origin, lang)

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-orange-100 cursor-pointer aspect-[4/3]">

      {/* Full-bleed image */}
      <LazyImage
        src={imageUrl}
        alt={breed.name}
        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105"
        style={{ transition: 'opacity 0.5s ease, transform 500ms cubic-bezier(0.4,0,0.2,1)' }}
        onError={(e) => { ;(e.target as HTMLImageElement).src = PLACEHOLDER }}
      />

      {/* Gradient overlay — always visible at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top action buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        {/* Compare button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            if (!comparisonFull) dispatch(toggleComparison(breed.id))
          }}
          title={comparisonFull ? t('compare_full') : inComparison ? t('compare_btn_active') : t('compare_btn')}
          className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all text-xs font-bold ${
            inComparison
              ? 'bg-purr-500 text-white scale-110'
              : comparisonFull
              ? 'bg-black/20 text-white/40 cursor-not-allowed'
              : 'bg-black/30 text-white hover:bg-purr-500 hover:scale-110'
          }`}
          aria-label={t('compare_btn')}
        >
          ⚖️
        </button>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            dispatch(toggleFavorite(breed.id))
          }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:scale-110 transition-transform"
          aria-label={fav ? 'Favorilerden çıkar' : 'Add to favorites'}
        >
          <span className="text-lg">{fav ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* Rare badge */}
      {breed.rare === 1 && (
        <span className="absolute top-3 left-3 z-10 badge bg-amber-400/90 text-amber-900 text-xs">
          {t('badge_rare')}
        </span>
      )}

      {/* Content overlaid at bottom */}
      <Link to={`/breed/${breed.id}`} className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 className="font-display font-extrabold text-white text-xl leading-tight drop-shadow mb-1">
          {breed.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-white/70 text-sm">{displayOrigin}</span>
          {breed.hypoallergenic === 1 && (
            <span className="badge bg-green-500/80 text-white text-xs">{t('badge_hypoallergenic')}</span>
          )}
        </div>

        <p className="text-white/75 text-sm line-clamp-2 mb-3 leading-relaxed">{displayDesc}</p>

        <div className="flex flex-wrap gap-1">
          {breed.temperament.split(',').slice(0, 3).map((trait) => (
            <span
              key={trait.trim()}
              className="badge bg-white/20 backdrop-blur-sm text-white border border-white/30 text-xs"
            >
              {translateTemperament(trait.trim(), lang)}
            </span>
          ))}
        </div>
      </Link>
    </div>
  )
}
