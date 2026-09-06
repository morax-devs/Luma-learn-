import { httpClient } from './httpClient'

export const quizApi = {
  getQuizzes: async () => (await httpClient.get('/quizzes')).quizzes,
  getQuizById: async (quizId) => (await httpClient.get(`/quizzes/${quizId}`)).quiz,
  getQuizHistory: async () => (await httpClient.get('/quizzes/results/history')).results,
  saveQuizResult: async (quizId, result) => (await httpClient.post(`/quizzes/${quizId}/results`, result)).result,
}
