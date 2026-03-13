import { useRef, useCallback } from 'react'

export function useInfiniteScroll(onLoadMore: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!node) return
      observerRef.current = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) onLoadMore() },
        { rootMargin: '300px' },
      )
      observerRef.current.observe(node)
    },
    [onLoadMore],
  )

  return sentinelRef
}
