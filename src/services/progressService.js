import { storage } from '../utils/storage'
import { progressApi } from './api/progressApi'
import { authService } from './authService'

const PROGRESS_KEY = 'luma-learning-progress'
export const PROGRESS_EVENT = 'luma-progress-updated'

function getInitialCompletedIds() {
  return []
}

export const progressService = {
  getProgressStore() { return storage.get(PROGRESS_KEY, {}) },
  getCourseProgress(course) {
    const courseId = course?.id || course?._id
    const completedIds = (courseId ? this.getProgressStore()[courseId] : []) || getInitialCompletedIds()
    const lessons = course?.curriculum?.flatMap((module) => module.lessons) || []
    const completedCount = lessons.filter((lesson) => completedIds.includes(lesson.id)).length
    return { completedIds, completedCount, progress: lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0 }
  },
  updateLessonProgress(courseId, completedIds) {
    const store = this.getProgressStore()
    storage.set(PROGRESS_KEY, { ...store, [courseId]: completedIds })
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT))
  },
  getCourseProgressFromApi: (courseId) => {
    if (!authService.isAuthenticated()) return Promise.resolve({ completedIds: [], progress: 0 })
    return progressApi.getCourseProgress(courseId)
  },
  updateLessonProgressFromApi: (courseId, lessonId, completed = true) => {
    if (!authService.isAuthenticated()) return Promise.resolve()
    return progressApi.updateLessonProgress(courseId, lessonId, completed)
  },
}
