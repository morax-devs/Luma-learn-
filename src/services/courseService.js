import { mockApi } from './mockApi'
import { courseApi } from './api/courseApi'
import { isApiMode } from './serviceConfig'

export const courseService = {
  getCourses: () => (isApiMode ? courseApi.getCourses() : mockApi.getCourses()),
  getCourseById: (courseId) => (isApiMode ? courseApi.getCourseById(courseId) : mockApi.getCourseById(courseId)),
  getCategories: () => (isApiMode ? courseApi.getCategories() : mockApi.getCategories()),
  getLevels: () => (isApiMode ? courseApi.getLevels() : mockApi.getLevels()),
  enroll: (courseId) => (isApiMode ? courseApi.enroll(courseId) : Promise.resolve(courseId)),
}
