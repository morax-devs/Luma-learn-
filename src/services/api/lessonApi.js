import { httpClient } from './httpClient'

export const lessonApi = {
  getLessons: async (courseId) => (await httpClient.get(`/courses/${courseId}/lessons`)).lessons,
}
