import { categories, courses, quizzes } from '../data/courses'

export const mockApi = {
  async getCourses() { return courses },
  async getCourseById(courseId) { return courses.find((course) => course.id === courseId) || null },
  async getCategories() { return categories },
  async getLevels() { return ['All levels', 'Beginner', 'Intermediate', 'Advanced'] },
  async getLessons(courseId) { const course = courses.find((item) => item.id === courseId); return course?.curriculum.flatMap((module) => module.lessons) || [] },
  async getQuizzes() { return quizzes },
  async getQuizById(quizId) { return quizzes.find((quiz) => quiz.id === quizId) || null },
  async getProfile() { return { name: '', role: 'Learner', learningGoal: '', bio: '', streak: 0, weeklyGoal: 0 } },
}
