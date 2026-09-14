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
  async getInstructorCourses() {
    const res = await httpClient.get('/courses/instructor/mine')
    return (res.courses || []).map(normalizeCourse)
  },
  async createCourse(data) {
    const res = await httpClient.post('/courses', data)
    return normalizeCourse(res.course)
  },
  async updateCourse(courseId, data) {
    const res = await httpClient.patch(`/courses/${courseId}`, data)
    return normalizeCourse(res.course)
  },
  async getCourseQuiz(courseId) {
    const res = await httpClient.get(`/courses/${courseId}/quiz`)
    return res.quiz
  },
  async saveCourseQuiz(courseId, quizData) {
    const res = await httpClient.put(`/courses/${courseId}/quiz`, quizData)
    return res.quiz
  },
  async addModule(courseId, data) {
    return httpClient.post(`/courses/${courseId}/modules`, data)
  },
  async updateModule(courseId, moduleId, data) {
    return httpClient.patch(`/courses/${courseId}/modules/${moduleId}`, data)
  },
  async deleteModule(courseId, moduleId) {
    return httpClient.delete(`/courses/${courseId}/modules/${moduleId}`)
  },
  async addLesson(courseId, moduleId, data) {
    return httpClient.post(`/courses/${courseId}/modules/${moduleId}/lessons`, data)
  },
  async updateLesson(courseId, moduleId, lessonId, data) {
    return httpClient.patch(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data)
  },
  async deleteLesson(courseId, moduleId, lessonId) {
    return httpClient.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
  },
  async getCategories() { return ['All courses', 'AI & ML', 'Development', 'Data Science', 'Product Design'] },
  async getLevels() { return ['All levels', 'Beginner', 'Intermediate', 'Advanced', 'PhD'] },
}
