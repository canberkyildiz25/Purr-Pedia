import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBreedById, fetchBreedImages } from '../api/catApi'
import { translateToTurkish } from '../api/translateApi'
import type { Breed, CatImage } from '../types/cat'
import StatBar from '../components/StatBar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleFavorite } from '../store/favoritesSlice'
import { useT } from '../i18n/useT'
import { translateCountry } from '../i18n/countryNames'
import { translateTemperament } from '../i18n/temperamentMap'

const PLACEHOLDER = 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg'

export default function BreedDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const favoriteIds = useAppSelector((s) => s.favorites.ids)
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
    Promise.all([fetchBreedById(id), fetchBreedImages(id, 8)]).then(([b, imgs]) => {
      setBreed(b)
      setImages(imgs)
      setSelectedImage(imgs[0]?.url ?? b.image?.url ?? PLACEHOLDER)
      setLoading(false)
    })
  }, [id])

  // Translate description when breed loads and language is Turkish
  useEffect(() => {
    if (!breed || lang !== 'tr') {
      setTranslatedDesc(null)
      return
    }
    setTranslating(true)
    translateToTurkish(breed.description).then((result) => {
      setTranslatedDesc(result)
      setTranslating(false)
    })
  }, [breed, lang])

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
  const descriptionText = translatedDesc ?? breed.description

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

  const TRAITS = [
    { label: t('trait_hypoallergenic'), active: breed.hypoallergenic === 1, icon: '🌿' },
    { label: t('trait_lap'), active: breed.lap === 1, icon: '🛋️' },
    { label: t('trait_indoor'), active: breed.indoor === 1, icon: '🏠' },
    { label: t('trait_rare'), active: breed.rare === 1, icon: '✨' },
    { label: t('trait_hairless'), active: breed.hairless === 1, icon: '🪮' },
    { label: t('trait_short_legs'), active: breed.short_legs === 1, icon: '🐾' },
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
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">{breed.name}</h1>
          <p className="text-gray-500 text-lg">
            📍 {translateCountry(breed.origin, lang)}
            <span className="mx-2 text-gray-300">·</span>
            ⏳ {breed.life_span} {t('years')}
            <span className="mx-2 text-gray-300">·</span>
            ⚖️ {breed.weight.metric} kg
          </p>
        </div>
        <button
          onClick={() => dispatch(toggleFavorite(breed.id))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-white hover:bg-orange-50 transition-colors text-sm font-medium shadow-sm"
        >
          <span className="text-lg">{fav ? '❤️' : '🤍'}</span>
          {fav ? t('btn_favorite_remove') : t('btn_favorite_add')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden bg-orange-50 shadow-sm" style={{ aspectRatio: '4/3' }}>
            <img
              src={selectedImage}
              alt={breed.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = PLACEHOLDER
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img.url
                      ? 'border-purr-500 scale-105'
                      : 'border-transparent hover:border-purr-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = PLACEHOLDER
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Traits */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('section_traits')}</h2>
            <div className="flex flex-wrap gap-2">
              {TRAITS.filter((tr) => tr.active).map((tr) => (
                <span key={tr.label} className="badge bg-orange-50 text-purr-700 border border-orange-200 text-sm px-3 py-1">
                  {tr.icon} {tr.label}
                </span>
              ))}
              {TRAITS.filter((tr) => tr.active).length === 0 && (
                <span className="text-gray-400 text-sm">—</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('section_about')}</h2>
            {translating ? (
              <p className="text-gray-400 text-sm italic">{t('translating')}</p>
            ) : (
              <p className="text-gray-700 leading-relaxed">{descriptionText}</p>
            )}
          </div>

          {/* Temperament */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('section_temperament')}</h2>
            <div className="flex flex-wrap gap-1.5">
              {translateTemperament(breed.temperament, lang).split(',').map((trait) => (
                <span key={trait.trim()} className="badge bg-purr-50 text-purr-700 border border-purr-200 text-sm px-3 py-1">
                  {trait.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Wikipedia */}
          {breed.wikipedia_url && (
            <a
              href={breed.wikipedia_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-purr-600 hover:text-purr-700 font-medium transition-colors"
            >
              📖 {t('wikipedia_link')} →
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
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
    </div>
  )
}
