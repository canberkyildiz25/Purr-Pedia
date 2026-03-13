import { Link, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setLanguage } from '../store/languageSlice'
import { useT } from '../i18n/useT'

export default function Navbar() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const lang = useAppSelector((s) => s.language.lang)
  const t = useT()

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl">🐱</span>
            <span className="font-display text-2xl font-extrabold text-purr-600 tracking-tight group-hover:text-purr-500 transition-colors">
              Purr<span className="text-gray-400 font-light">Pedia</span>
            </span>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link
              to="/"
              className={`px-2 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-purr-100 text-purr-700'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-purr-600'
              }`}
            >
              <span className="hidden sm:inline">{t('nav_all_breeds')}</span>
              <span className="sm:hidden">🏠</span>
            </Link>
            <Link
              to="/favorites"
              className={`px-2 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                location.pathname === '/favorites'
                  ? 'bg-purr-100 text-purr-700'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-purr-600'
              }`}
            >
              <span className="hidden sm:inline">{t('nav_favorites')} ❤️</span>
              <span className="sm:hidden">❤️</span>
            </Link>

            <button
              onClick={() => dispatch(setLanguage(lang === 'tr' ? 'en' : 'tr'))}
              className="ml-1 sm:ml-2 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-orange-200 bg-white hover:bg-orange-50 transition-colors text-xs font-semibold text-gray-600"
              title={lang === 'tr' ? 'Switch to English' : "Türkçe'ye geç"}
            >
              <span className="text-base">{lang === 'tr' ? '🇬🇧' : '🇹🇷'}</span>
              <span className="hidden sm:inline">{lang === 'tr' ? 'EN' : 'TR'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
