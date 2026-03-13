import { useState, useEffect, useCallback } from 'react'
import { fetchBreedImages } from '../api/catApi'
import { translateToTurkish } from '../api/translateApi'
import { translateTemperament } from '../i18n/temperamentMap'
import type { Breed, CatImage } from '../types/cat'
import StatBar from './StatBar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleFavorite } from '../store/favoritesSlice'
import { closeModal } from '../store/filtersSlice'
import { useT } from '../i18n/useT'
import { translateCountry } from '../i18n/countryNames'

const PLACEHOLDER = 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg'

export default function BreedModal() {
  const dispatch = useAppDispatch()
  const breedId = useAppSelector((s) => s.filters.modalBreedId)
  const breed: Breed | null = useAppSelector(
    (s) => s.breeds.items.find((b) => b.id === breedId) ?? null,
  )
  const favoriteIds = useAppSelector((s) => s.favorites.ids)
  const lang = useAppSelector((s) => s.language.lang)
  const t = useT()

  const [images, setImages] = useState<CatImage[]>([])
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [imagesLoading, setImagesLoading] = useState(false)
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)

  const handleClose = useCallback(() => dispatch(closeModal()), [dispatch])

  useEffect(() => {
    if (!breedId) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [breedId, handleClose])

  useEffect(() => {
    document.body.style.overflow = breedId ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [breedId])

  useEffect(() => {
    if (!breedId || !breed) {
      setImages([])
      setTranslatedDesc(null)
      return
    }
    setImagesLoading(true)
    setSelectedImage(breed.image?.url ?? PLACEHOLDER)
    fetchBreedImages(breedId, 8).then((imgs) => {
      setImages(imgs)
      if (imgs[0]?.url) setSelectedImage(imgs[0].url)
      setImagesLoading(false)
    })
  }, [breedId, breed])

  useEffect(() => {
    if (!breed || lang !== 'tr') { setTranslatedDesc(null); return }
    setTranslating(true)
    translateToTurkish(breed.description).then((result) => {
      setTranslatedDesc(result)
      setTranslating(false)
    })
  }, [breed, lang])

  if (!breedId) return null

  const fav = breed ? favoriteIds.includes(breed.id) : false
  const descriptionText = translatedDesc ?? breed?.description ?? ''

  const STAT_GROUPS = breed ? [
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
  ] : []

  const TRAITS = breed ? [
    { label: t('trait_hypoallergenic'), active: breed.hypoallergenic === 1, icon: '🌿' },
    { label: t('trait_lap'), active: breed.lap === 1, icon: '🛋️' },
    { label: t('trait_indoor'), active: breed.indoor === 1, icon: '🏠' },
    { label: t('trait_rare'), active: breed.rare === 1, icon: '✨' },
    { label: t('trait_hairless'), active: breed.hairless === 1, icon: '🪮' },
    { label: t('trait_short_legs'), active: breed.short_legs === 1, icon: '🐾' },
  ] : []

  const activeTraits = TRAITS.filter((tr) => tr.active)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-3xl max-h-[95dvh] rounded-3xl shadow-2xl bg-white overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#fdba74 transparent' }}
      >
        {/* Close button — absolute over image */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors text-xl"
          aria-label="Close"
        >
          ×
        </button>

        {!breed ? (
          <div className="p-8 animate-pulse space-y-4">
            <div className="h-72 bg-orange-100 rounded-2xl w-full" />
            <div className="h-6 bg-orange-100 rounded-full w-48" />
            <div className="h-4 bg-orange-100 rounded-full w-32" />
            <div className="h-20 bg-orange-100 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Hero image — full width, fixed height */}
            <div className="relative w-full h-60 sm:h-72 shrink-0 bg-orange-50">
              <img
                src={selectedImage}
                alt={breed.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => { ;(e.target as HTMLImageElement).src = PLACEHOLDER }}
              />
              {/* Gradient overlay for header text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Breed name + meta over image */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow">
                  {breed.name}
                </h2>
                <p className="text-white/80 text-sm mt-0.5">
                  📍 {translateCountry(breed.origin, lang)}
                  <span className="mx-2 text-white/40">·</span>
                  ⏳ {breed.life_span} {t('years')}
                  <span className="mx-2 text-white/40">·</span>
                  ⚖️ {breed.weight.metric} kg
                </p>
              </div>
            </div>

            {/* Thumbnail strip */}
            {!imagesLoading && images.length > 1 && (
              <div className="flex gap-2 px-5 py-3 overflow-x-auto shrink-0 border-b border-orange-100 bg-orange-50/50">
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

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">

              {/* Favorite + traits row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {activeTraits.map((tr) => (
                    <span key={tr.label} className="badge bg-orange-50 text-purr-700 border border-orange-200 text-sm px-3 py-1">
                      {tr.icon} {tr.label}
                    </span>
                  ))}
                  {activeTraits.length === 0 && <span className="text-gray-400 text-sm">—</span>}
                </div>
                <button
                  onClick={() => dispatch(toggleFavorite(breed.id))}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-white hover:bg-orange-50 transition-colors text-sm font-medium shadow-sm"
                >
                  <span className="text-lg">{fav ? '❤️' : '🤍'}</span>
                  <span className="hidden sm:inline">{fav ? t('btn_favorite_remove') : t('btn_favorite_add')}</span>
                </button>
              </div>

              {/* About */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('section_about')}</h3>
                {translating ? (
                  <p className="text-gray-400 text-sm italic">{t('translating')}</p>
                ) : (
                  <p className="text-gray-700 leading-relaxed text-sm">{descriptionText}</p>
                )}
              </div>

              {/* Temperament */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('section_temperament')}</h3>
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

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STAT_GROUPS.map((group) => (
                  <div key={group.title} className="bg-gray-50 rounded-2xl border border-orange-100 p-4">
                    <h3 className="font-display font-bold text-gray-800 mb-3 text-sm">{group.title}</h3>
                    <div className="space-y-3">
                      {group.stats.map((s) => (
                        <StatBar key={s.label} label={s.label} value={s.value} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
