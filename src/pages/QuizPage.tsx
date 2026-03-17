import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { useT } from '../i18n/useT'
import BreedCard from '../components/BreedCard'
import type { Breed } from '../types/cat'

interface Answers {
  energy: 'low' | 'medium' | 'high' | null
  hypoallergenic: boolean | null
  indoor: boolean | null
  childFriendly: boolean | null
}

const EMPTY: Answers = { energy: null, hypoallergenic: null, indoor: null, childFriendly: null }

export default function QuizPage() {
  const t = useT()
  const allBreeds = useAppSelector((s) => s.breeds.items)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [done, setDone] = useState(false)

  const questions = [
    {
      key: 'energy' as const,
      question: t('quiz_q1'),
      options: [
        { label: t('quiz_q1_low'), value: 'low' as const },
        { label: t('quiz_q1_medium'), value: 'medium' as const },
        { label: t('quiz_q1_high'), value: 'high' as const },
      ],
    },
    {
      key: 'hypoallergenic' as const,
      question: t('quiz_q2'),
      options: [
        { label: t('quiz_q2_yes'), value: true },
        { label: t('quiz_q2_no'), value: false },
      ],
    },
    {
      key: 'indoor' as const,
      question: t('quiz_q3'),
      options: [
        { label: t('quiz_q3_indoor'), value: true },
        { label: t('quiz_q3_outdoor'), value: false },
        { label: t('quiz_q3_both'), value: null },
      ],
    },
    {
      key: 'childFriendly' as const,
      question: t('quiz_q4'),
      options: [
        { label: t('quiz_q4_yes'), value: true },
        { label: t('quiz_q4_no'), value: false },
      ],
    },
  ]

  const handleSelect = (value: unknown) => {
    const key = questions[step].key
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  const results = useMemo((): Breed[] => {
    if (!done) return []
    return allBreeds
      .map((breed) => {
        let score = 0
        if (answers.energy === 'low' && breed.energy_level <= 2) score += 2
        if (answers.energy === 'medium' && breed.energy_level === 3) score += 2
        if (answers.energy === 'high' && breed.energy_level >= 4) score += 2
        if (answers.hypoallergenic === true && breed.hypoallergenic === 1) score += 3
        if (answers.hypoallergenic === true && breed.hypoallergenic !== 1) score -= 2
        if (answers.indoor === true && breed.indoor === 1) score += 1
        if (answers.indoor === false && breed.indoor === 0) score += 1
        if (answers.indoor === null) score += 1
        if (answers.childFriendly === true && breed.child_friendly >= 4) score += 2
        if (answers.childFriendly === true && breed.child_friendly <= 2) score -= 1
        return { breed, score }
      })
      .filter((x) => x.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.breed)
  }, [done, allBreeds, answers])

  const restart = () => {
    setAnswers(EMPTY)
    setStep(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-2">{t('quiz_results')}</h1>
          <p className="text-gray-500">{t('quiz_results_subtitle')}</p>
        </div>
        {results.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg mb-4">Uygun ırk bulunamadı.</p>
            <button onClick={restart} className="btn-primary">{t('quiz_restart')}</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {results.map((breed) => (
                <BreedCard key={breed.id} breed={breed} />
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={restart} className="btn-secondary">{t('quiz_restart')}</button>
              <Link to="/" className="btn-primary">{t('quiz_see_all')}</Link>
            </div>
          </>
        )}
      </div>
    )
  }

  const q = questions[step]
  const stepLabel = t('quiz_step')
    .replace('{current}', String(step + 1))
    .replace('{total}', String(questions.length))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🐱</div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-2">{t('quiz_title')}</h1>
        <p className="text-gray-500">{t('quiz_subtitle')}</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-10">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-purr-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-8">
        <p className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wider">{stepLabel}</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mb-6">{q.question}</h2>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt.value)}
              className="text-left px-5 py-4 rounded-2xl border-2 border-orange-100 hover:border-purr-400 hover:bg-purr-50 transition-all text-gray-800 font-medium"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
