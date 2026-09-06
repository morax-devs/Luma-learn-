import { Course } from '../models/Course.js'
import { Progress } from '../models/Progress.js'

export async function getCourseProgress(req, res) {
  const course = await Course.findById(req.params.courseId).lean()
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  const lessons = (course.curriculum || []).flatMap((module) => module.lessons || [])
  const progress = await Progress.findOne({ user: req.userId, course: course._id }).lean()
  const completedLessonIds = progress ? progress.completedLessons.map(String) : []
  const percentage = lessons.length ? Math.round((completedLessonIds.length / lessons.length) * 100) : 0

  res.json({ success: true, progress: { completedLessonIds, percentage } })
}

export async function updateLessonProgress(req, res) {
  const { courseId, lessonId } = req.params
  const { completed } = req.body

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Completed flag must be a boolean.' })
  }

  const course = await Course.findById(courseId).lean()
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  const lessons = (course.curriculum || []).flatMap((module) => module.lessons || [])
  const lessonExists = lessons.some((lesson) => lesson.id === lessonId)
  if (!lessonExists) {
    return res.status(404).json({ success: false, message: 'Lesson not found in course.' })
  }

  const progress = await Progress.findOne({ user: req.userId, course: course._id })

  if (!progress) {
    const completedLessons = completed ? [lessonId] : []
    const percentage = lessons.length ? Math.round((completedLessons.length / lessons.length) * 100) : 0
    const newProgress = await Progress.create({ user: req.userId, course: course._id, completedLessons, percentage })
    return res.json({ success: true, progress: { completedLessonIds: completedLessons, percentage: newProgress.percentage } })
  }

  const completedLessons = new Set(progress.completedLessons.map(String))
  if (completed) completedLessons.add(lessonId)
  else completedLessons.delete(lessonId)

  const updated = await Progress.findByIdAndUpdate(progress._id, {
    completedLessons: [...completedLessons],
    percentage: lessons.length ? Math.round((completedLessons.size / lessons.length) * 100) : 0,
  }, { new: true, runValidators: true }).lean()

  res.json({ success: true, progress: { completedLessonIds: updated.completedLessons.map(String), percentage: updated.percentage } })
}
