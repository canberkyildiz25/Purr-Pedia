import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBreedById, fetchBreedImages } from '../api/catApi'
import { translateToTurkish } from '../api/translateApi'
import type { Breed, CatImage } from '../types/cat'
import StatBar from '../components/StatBar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleFavorite } from '../store/favoritesSlice'
import { toggleComparison, MAX_COMPARE } from '../store/comparisonSlice'
import { useT } from '../i18n/useT'
import { translateCountry } from '../i18n/countryNames'
import { translateTemperament } from '../i18n/temperamentMap'

const PLACEHOLDER = 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg'

function ScoreCircle({ value, max = 5, label }: { value: number; max?: number; label: string }) {
  const pct = (value / max) * 100
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#EDD382" strokeWidth="6" />
          <circle
            cx="32" cy="32" r={r} fill="none"
            stroke="#F4442E" strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-bold text-lg text-gray-900">
          {value}
        </span>
      </div>
      <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
    </div>
  )
}

export default function BreedDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const favoriteIds = useAppSelector((s) => s.favorites.ids)
  const comparisonIds = useAppSelector((s) => s.comparison.ids)
  const allBreeds = useAppSelector((s) => s.breeds.items)
  const lang = useAppSelector((s) => s.language.lang)
  const t = useT()

  const [breed, setBreed] = useState<Breed | null>(null)
  const [images, setImages] = useState<CatImage[]>([])
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setTranslatedDesc(null)
    Promise.all([fetchBreedById(id), fetchBreedImages(id, 10)]).then(([b, imgs]) => {
      setBreed(b)
      setImages(imgs)
      setSelectedImage(imgs[0]?.url ?? b.image?.url ?? PLACEHOLDER)
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    if (!breed || lang !== 'tr') { setTranslatedDesc(null); return }
    setTranslating(true)
    translateToTurkish(breed.description).then((result) => {
      setTranslatedDesc(result)
      setTranslating(false)
    })
  }, [breed, lang])

  const similarBreeds = useMemo(() => {
    if (!breed || allBreeds.length === 0) return []
    return allBreeds
      .filter((b) => b.id !== breed.id && b.country_code === breed.country_code)
      .slice(0, 4)
  }, [breed, allBreeds])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-orange-100 rounded-full w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-orange-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-orange-100 rounded-full w-48" />
            <div className="h-4 bg-orange-100 rounded-full w-32" />
            <div className="h-24 bg-orange-100 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!breed) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😿</div>
        <p className="text-gray-600 text-lg mb-4">{t('breed_not_found')}</p>
        <Link to="/" className="btn-primary">{t('btn_back_home')}</Link>
      </div>
    )
  }

  const fav = favoriteIds.includes(breed.id)
  const inComparison = comparisonIds.includes(breed.id)
  const comparisonFull = comparisonIds.length >= MAX_COMPARE && !inComparison
  const descriptionText = translatedDesc ?? breed.description

  // "Good for" computed indicators
  const goodFor = [
    {
      key: 'families',
      label: t('good_families'),
      icon: '👨‍👩‍👧',
      ok: breed.child_friendly >= 4,
    },
    {
      key: 'beginners',
      label: t('good_beginners'),
      icon: '🌱',
      ok: breed.health_issues <= 2 && breed.grooming <= 3 && breed.adaptability >= 3,
    },
    {
      key: 'apartments',
      label: t('good_apartments'),
      icon: '🏢',
      ok: breed.energy_level <= 3 && breed.vocalisation <= 3,
    },
    {
      key: 'other_pets',
      label: t('good_other_pets'),
      icon: '🐶',
      ok: breed.dog_friendly >= 3,
    },
  ]

  const ALL_TRAITS = [
    { label: t('trait_hypoallergenic'), active: breed.hypoallergenic === 1, icon: '🌿' },
    { label: t('trait_lap'), active: breed.lap === 1, icon: '🛋️' },
    { label: t('trait_indoor'), active: breed.indoor === 1, icon: '🏠' },
    { label: t('trait_rare'), active: breed.rare === 1, icon: '✨' },
    { label: t('trait_hairless'), active: breed.hairless === 1, icon: '🪮' },
    { label: t('trait_short_legs'), active: breed.short_legs === 1, icon: '🐾' },
    { label: t('trait_natural'), active: breed.natural === 1, icon: '🌲' },
    { label: t('trait_experimental'), active: breed.experimental === 1, icon: '🧪' },
    { label: t('trait_suppressed_tail'), active: breed.suppressed_tail === 1, icon: '🔀' },
  ].filter((tr) => tr.active)

  const STAT_GROUPS = [
    {
      title: t('group_personality'),
      stats: [
        { label: t('stat_adaptability'), value: breed.adaptability },
        { label: t('stat_affection'), value: breed.affection_level },
        { label: t('stat_child_friendly'), value: breed.child_friendly },
        { label: t('stat_dog_friendly'), value: breed.dog_friendly },
        { label: t('stat_stranger_friendly'), value: breed.stranger_friendly },
        { label: t('stat_social_needs'), value: breed.social_needs },
      ],
    },
    {
      title: t('group_care'),
      stats: [
        { label: t('stat_energy'), value: breed.energy_level },
        { label: t('stat_shedding'), value: breed.shedding_level },
        { label: t('stat_grooming'), value: breed.grooming },
        { label: t('stat_health'), value: breed.health_issues },
        { label: t('stat_intelligence'), value: breed.intelligence },
        { label: t('stat_vocalisation'), value: breed.vocalisation },
      ],
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purr-600 mb-6 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        {t('back_to_all')}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {breed.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>📍 {translateCountry(breed.origin, lang)}</span>
            <span className="text-gray-300">·</span>
            <span>⏳ {breed.life_span} {t('years')}</span>
            <span className="text-gray-300">·</span>
            <span>⚖️ {breed.weight.metric} kg ({breed.weight.imperial} lbs)</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { if (!comparisonFull) dispatch(toggleComparison(breed.id)) }}
            title={comparisonFull ? t('compare_full') : inComparison ? t('compare_btn_active') : t('compare_btn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors text-sm font-medium shadow-sm ${
              inComparison
                ? 'bg-purr-500 text-white border-purr-500'
                : comparisonFull
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-orange-200 bg-white hover:bg-orange-50'
            }`}
          >
            ⚖️ {inComparison ? t('compare_btn_active') : t('compare_btn')}
          </button>
          <button
            onClick={() => dispatch(toggleFavorite(breed.id))}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-white hover:bg-orange-50 transition-colors text-sm font-medium shadow-sm"
          >
            <span className="text-lg">{fav ? '❤️' : '🤍'}</span>
            {fav ? t('btn_favorite_remove') : t('btn_favorite_add')}
          </button>
        </div>
      </div>

      {/* Quick stats circles */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm px-6 py-5 mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('section_quick_stats')}</p>
        <div className="flex justify-around flex-wrap gap-4">
          <ScoreCircle value={breed.affection_level} label={t('stat_affection')} />
          <ScoreCircle value={breed.energy_level} label={t('stat_energy')} />
          <ScoreCircle value={breed.intelligence} label={t('stat_intelligence')} />
          <ScoreCircle value={breed.adaptability} label={t('stat_adaptability')} />
          <ScoreCircle value={breed.social_needs} label={t('stat_social_needs')} />
          <ScoreCircle value={breed.child_friendly} label={t('stat_child_friendly')} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Images — smaller */}
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden bg-orange-50 shadow-sm" style={{ aspectRatio: '1/1' }}>
            <img
              src={selectedImage}
              alt={breed.name}
              className="w-full h-full object-cover object-top"
              onError={(e) => { ;(e.target as HTMLImageElement).src = PLACEHOLDER }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img.url
                      ? 'border-purr-500 scale-105'
                      : 'border-transparent hover:border-purr-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { ;(e.target as HTMLImageElement).src = PLACEHOLDER }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel — traits + temperament only */}
        <div className="space-y-6">
          {/* Traits */}
          {ALL_TRAITS.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('section_traits')}</h2>
              <div className="flex flex-wrap gap-2">
                {ALL_TRAITS.map((tr) => (
                  <span key={tr.label} className="badge bg-orange-50 text-purr-700 border border-orange-200 text-sm px-3 py-1">
                    {tr.icon} {tr.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Temperament */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('section_temperament')}</h2>
            <div className="flex flex-wrap gap-1.5">
              {translateTemperament(breed.temperament, lang).split(',').map((trait) => (
                <span key={trait.trim()} className="badge bg-purr-100 text-purr-800 text-xs px-2.5 py-1">
                  {trait.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('section_about')}</h2>
            {translating ? (
              <p className="text-gray-400 text-sm italic">{t('translating')}</p>
            ) : (
              <p className="text-gray-700 leading-relaxed text-sm">{descriptionText}</p>
            )}
          </div>

          {/* Good for */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('section_good_for')}</h2>
            <div className="grid grid-cols-2 gap-2">
              {goodFor.map(({ key, label, icon, ok }) => (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border ${
                    ok
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <span>{ok ? icon : '—'}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {STAT_GROUPS.map((group) => (
          <div key={group.title} className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
            <h2 className="font-display font-bold text-gray-800 mb-4">{group.title}</h2>
            <div className="space-y-3">
              {group.stats.map((s) => (
                <StatBar key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Similar breeds */}
      {similarBreeds.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
            {t('section_similar')} — {translateCountry(breed.origin, lang)}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarBreeds.map((b) => (
              <Link
                key={b.id}
                to={`/breed/${b.id}`}
                className="group rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-square bg-orange-50 overflow-hidden">
                  <img
                    src={b.image?.url ?? PLACEHOLDER}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { ;(e.target as HTMLImageElement).src = PLACEHOLDER }}
                  />
                </div>
                <div className="p-3 bg-white">
                  <p className="font-semibold text-sm text-gray-900 truncate">{b.name}</p>
                  <p className="text-xs text-gray-400">{translateCountry(b.origin, lang)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
