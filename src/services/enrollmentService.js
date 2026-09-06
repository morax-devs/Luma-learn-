import { storage } from '../utils/storage'
import { courseApi } from './api/courseApi'
import { isApiMode } from './serviceConfig'

const ENROLLMENT_KEY = 'luma-enrollments'
export const ENROLLMENT_EVENT = 'luma-enrollments-updated'

export const enrollmentService = {
  getEnrollments() { return storage.get(ENROLLMENT_KEY, []) },
  isEnrolled(courseId) { return this.getEnrollments().includes(courseId) },
  enroll(courseId) {
    const enrollments = this.getEnrollments()
    if (!enrollments.includes(courseId)) storage.set(ENROLLMENT_KEY, [...enrollments, courseId])
    window.dispatchEvent(new CustomEvent(ENROLLMENT_EVENT))
    return isApiMode ? courseApi.enroll(courseId) : true
  },
}
