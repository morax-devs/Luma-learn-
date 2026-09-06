import { useEffect, useState } from 'react'
import { PROGRESS_EVENT, readProgressStore } from './useCourseProgress'
import { useQuizResults } from './useQuizResults'

function getCompletedIds(course, store) {
  return store[course.id] || course.curriculum.flatMap((module) => module.lessons).filter((lesson) => lesson.completed).map((lesson) => lesson.id)
}

export function useLearningStats(courses = []) {
  const [progressStore, setProgressStore] = useState(() => readProgressStore())
  const { history } = useQuizResults()
  useEffect(() => {
    const syncProgress = () => setProgressStore(readProgressStore())
    window.addEventListener('storage', syncProgress)
    window.addEventListener(PROGRESS_EVENT, syncProgress)
    return () => { window.removeEventListener('storage', syncProgress); window.removeEventListener(PROGRESS_EVENT, syncProgress) }
  }, [])
  const lessonsCompleted = courses.reduce((total, course) => total + getCompletedIds(course, progressStore).length, 0)
  const coursesCompleted = courses.filter((course) => getCompletedIds(course, progressStore).length === course.curriculum.flatMap((module) => module.lessons).length).length
  const averageQuizScore = history.length ? Math.round(history.reduce((total, result) => total + result.percentage, 0) / history.length) : 0
  return { lessonsCompleted, coursesCompleted, quizzesCompleted: history.length, averageQuizScore, history }
}
