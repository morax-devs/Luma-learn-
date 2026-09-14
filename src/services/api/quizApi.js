import { httpClient } from './httpClient'

function normalizeQuiz(quiz) {
  if (!quiz) return null
  return {
    ...quiz,
    id: quiz.id || (quiz._id ? quiz._id.toString() : undefined),
  }
}

export const quizApi = {
  getQuizzes: async () => {
    const res = await httpClient.get('/quizzes')
    return (res.quizzes || []).map(normalizeQuiz)
  },
  getQuizById: async (quizId) => {
    const res = await httpClient.get(`/quizzes/${quizId}`)
    return normalizeQuiz(res.quiz)
  },
  getQuizHistory: async () => (await httpClient.get('/quizzes/results/history')).results,
  saveQuizResult: async (quizId, result) => (await httpClient.post(`/quizzes/${quizId}/results`, result)).result,
}

