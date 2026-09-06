import { mockApi } from './mockApi'
import { quizApi } from './api/quizApi'
import { authService } from './authService'
import { isApiMode } from './serviceConfig'

export const quizService = {
  getQuizzes: () => {
    if (isApiMode && !authService.isAuthenticated()) return Promise.resolve([])
    return isApiMode ? quizApi.getQuizzes() : mockApi.getQuizzes()
  },
  getQuizById: (quizId) => (isApiMode ? quizApi.getQuizById(quizId) : mockApi.getQuizById(quizId)),
  getQuizHistory: () => {
    if (isApiMode && !authService.isAuthenticated()) return Promise.resolve([])
    return isApiMode ? quizApi.getQuizHistory() : Promise.resolve([])
  },
  saveQuizResult: (quizId, result) => {
    if (isApiMode && !authService.isAuthenticated()) return Promise.resolve(result)
    return isApiMode ? quizApi.saveQuizResult(quizId, result) : Promise.resolve(result)
  },
}
