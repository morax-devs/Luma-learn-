import { useEffect, useState } from 'react'
import { getQuizHistory, getQuizResults, QUIZ_RESULTS_EVENT } from '../utils/quizStorage'

export function useQuizResults() {
  const [results, setResults] = useState(() => getQuizResults())
  useEffect(() => {
    const syncResults = () => setResults(getQuizResults())
    window.addEventListener('storage', syncResults)
    window.addEventListener(QUIZ_RESULTS_EVENT, syncResults)
    return () => {
      window.removeEventListener('storage', syncResults)
      window.removeEventListener(QUIZ_RESULTS_EVENT, syncResults)
    }
  }, [])
  return { results, history: getQuizHistory() }
}
