import { useAppSelector } from '../store/hooks'
import { translations, type TranslationKey } from './translations'

export function useT() {
  const lang = useAppSelector((s) => s.language.lang)

  return (key: TranslationKey, vars?: Record<string, string>): string => {
    let str: string = translations[lang][key] as string
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, v)
      }
    }
    return str
  }
}
