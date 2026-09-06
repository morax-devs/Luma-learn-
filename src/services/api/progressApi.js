import { httpClient } from './httpClient'

export const progressApi = {
  getCourseProgress: async (courseId) => (await httpClient.get(`/courses/${courseId}/progress`)).progress,
  updateLessonProgress: async (courseId, lessonId, completed = true) => (await httpClient.post(`/courses/${courseId}/progress/lessons/${lessonId}`, { completed })).progress,
}
