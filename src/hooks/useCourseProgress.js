import { useEffect, useState } from 'react'
import { progressService, PROGRESS_EVENT } from '../services/progressService'

export const readProgressStore = () => progressService.getProgressStore()
export { PROGRESS_EVENT }

export function useCourseProgress(course) {
  const [completedIds, setCompletedIds] = useState(() => {
    if (typeof window === 'undefined') return progressService.getCourseProgress(course).completedIds
    return progressService.getCourseProgress(course).completedIds
  })
  const allLessons = course.curriculum.flatMap((module) => module.lessons)
  const completedCount = allLessons.filter((lesson) => completedIds.includes(lesson.id)).length
  const progress = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0
  const nextLesson = allLessons.find((lesson) => !completedIds.includes(lesson.id)) || allLessons[allLessons.length - 1]

  useEffect(() => {
    const syncProgress = () => setCompletedIds(progressService.getCourseProgress(course).completedIds)
    window.addEventListener('storage', syncProgress)
    window.addEventListener(PROGRESS_EVENT, syncProgress)
    return () => {
      window.removeEventListener('storage', syncProgress)
      window.removeEventListener(PROGRESS_EVENT, syncProgress)
    }
  }, [course])

  const markLessonComplete = (lessonId) => {
    const nextCompletedIds = completedIds.includes(lessonId) ? completedIds : [...completedIds, lessonId]
    setCompletedIds(nextCompletedIds)
    progressService.updateLessonProgress(course.id, nextCompletedIds)
  }

  return { completedIds, completedCount, progress, nextLesson, isComplete: (lessonId) => completedIds.includes(lessonId), markLessonComplete }
}
