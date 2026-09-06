import { storage } from './storage'

const STORAGE_KEY = 'luma-quiz-results'
export const QUIZ_RESULTS_EVENT = 'luma-quiz-results-updated'

const readStore = () => storage.get(STORAGE_KEY, {})

export function getQuizResults() {
  return readStore()
}

export function getLatestQuizResult(quizId) {
  return readStore()[quizId]?.[0] || null
}

export function saveQuizResult(quizId, result) {
  const store = readStore()
  store[quizId] = [result, ...(store[quizId] || [])].slice(0, 10)
  storage.set(STORAGE_KEY, store)
  window.dispatchEvent(new CustomEvent(QUIZ_RESULTS_EVENT))
}

export function getQuizHistory() {
  return Object.values(readStore()).flat().sort((first, second) => second.submittedAt - first.submittedAt)
}
