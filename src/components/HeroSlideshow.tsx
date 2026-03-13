import { useEffect, useState, useMemo } from 'react'
import { useAppSelector } from '../store/hooks'

export default function HeroSlideshow() {
  const breeds = useAppSelector((s) => s.breeds.items)
  const [current, setCurrent] = useState(0)

  const slides = useMemo(
    () =>
      breeds
        .filter((b) => b.image?.url)
        .slice(0, 8)
        .map((b) => b.image!.url),
    [breeds],
  )

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.length === 0 ? (
        // Fallback gradient when images haven't loaded yet
        <div className="absolute inset-0 bg-gradient-to-br from-purr-800 via-purr-600 to-orange-400" />
      ) : (
        slides.map((url, i) => (
          <div
            key={url}
            className="absolute inset-0"
            style={{
              opacity: i === current ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center 30%',
                transform: i === current ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 6s ease-out',
              }}
            />
          </div>
        ))
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Overlay: dark top → transparent middle → light bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-orange-50" />
    </div>
  )
}
