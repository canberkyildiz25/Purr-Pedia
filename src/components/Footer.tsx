import { useT } from '../i18n/useT'

export default function Footer() {
  const t = useT()

  return (
    <footer className="bg-white border-t border-orange-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐱</span>
            <span className="font-display font-extrabold text-purr-600 text-lg">PurrPedia</span>
            <span className="text-gray-400 text-sm ml-1">{t('footer_subtitle')}</span>
          </div>
          <p className="text-gray-400 text-sm text-center">
            {t('footer_data_prefix')}{' '}
            <a
              href="https://thecatapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purr-500 hover:text-purr-600 font-medium transition-colors"
            >
              TheCatAPI
            </a>
            {t('footer_data_suffix') ? ` ${t('footer_data_suffix')}` : ''}
          </p>
        </div>
      </div>
    </footer>
  )
}
