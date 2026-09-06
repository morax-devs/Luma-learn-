import { httpClient } from './httpClient'

function normalizeCourse(course) {
  if (!course) return null
  return {
    ...course,
    id: course.id || (course._id ? course._id.toString() : undefined),
  }
}

export const courseApi = {
  async getCourses() {
    const res = await httpClient.get('/courses')
    return (res.courses || []).map(normalizeCourse)
  },
  async getCourseById(courseId) {
    const res = await httpClient.get(`/courses/${courseId}`)
    return normalizeCourse(res.course)
  },
  async enroll(courseId) { return (await httpClient.post(`/courses/${courseId}/enroll`)).enrollment },
  async getCategories() { return ['All courses', 'AI & ML', 'Development', 'Data Science', 'Product Design'] },
  async getLevels() { return ['All levels', 'Beginner', 'Intermediate', 'Advanced'] },
}
