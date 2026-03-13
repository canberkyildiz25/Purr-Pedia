const CACHE_PREFIX = 'purr_trans_'

// Lingva public instances (tried in order until one works)
const LINGVA_INSTANCES = [
  'https://translate.plausibility.cloud',
  'https://lingva.garudalinux.org',
  'https://translate.projectsegfau.lt',
]

// MyMemory strings that indicate a failed/rate-limited response
const BAD_PREFIXES = ['MYMEMORY WARNING', 'QUERY LENGTH', 'PLEASE SELECT']

function cacheKey(text: string): string {
  return CACHE_PREFIX + btoa(encodeURIComponent(text.slice(0, 80))).slice(0, 40)
}

function isValid(original: string, translated: string): boolean {
  if (!translated || translated === original) return false
  if (BAD_PREFIXES.some((p) => translated.toUpperCase().startsWith(p))) return false
  return true
}

async function tryLingva(text: string): Promise<string | null> {
  for (const base of LINGVA_INSTANCES) {
    try {
      const res = await fetch(`${base}/api/v1/en/tr/${encodeURIComponent(text)}`)
      if (!res.ok) continue
      const data = await res.json()
      const translated: string = data.translation ?? ''
      if (isValid(text, translated)) return translated
    } catch {
      // try next instance
    }
  }
  return null
}

async function tryMyMemory(text: string): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|tr`
    const res = await fetch(url)
    const data = await res.json()
    const translated: string = data.responseData?.translatedText ?? ''
    return isValid(text, translated) ? translated : null
  } catch {
    return null
  }
}

/** Remove any previously cached entries that contain warning messages */
export function purgeBadCache(): void {
  const toDelete: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k?.startsWith(CACHE_PREFIX)) continue
    const val = localStorage.getItem(k) ?? ''
    if (BAD_PREFIXES.some((p) => val.toUpperCase().includes(p))) toDelete.push(k)
  }
  toDelete.forEach((k) => localStorage.removeItem(k))
}

export async function translateToTurkish(text: string): Promise<string> {
  if (!text.trim()) return text

  const key = cacheKey(text)
  const cached = localStorage.getItem(key)
  // Re-validate cached value in case it was stored before the bad-prefix check existed
  if (cached && isValid(text, cached)) return cached
  if (cached) localStorage.removeItem(key) // evict bad entry

  const result = (await tryLingva(text)) ?? (await tryMyMemory(text))

  if (result) {
    localStorage.setItem(key, result)
    return result
  }

  return text
}
