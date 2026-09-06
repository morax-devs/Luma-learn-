import { mockApi } from './mockApi'
import { lessonApi } from './api/lessonApi'
import { isApiMode } from './serviceConfig'

export const lessonService = {
  getLessons: (courseId) => (isApiMode ? lessonApi.getLessons(courseId) : mockApi.getLessons(courseId)),
}
