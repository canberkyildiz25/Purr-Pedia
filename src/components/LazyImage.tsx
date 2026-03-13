import { useState } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  onError?: React.ReactEventHandler<HTMLImageElement>
}

export default function LazyImage({ src, alt, className, style, onError }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease', ...style }}
      onLoad={() => setLoaded(true)}
      onError={(e) => { setLoaded(true); onError?.(e) }}
    />
  )
}
