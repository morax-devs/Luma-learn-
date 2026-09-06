import { Lesson } from '../models/Lesson.js'
import { Course } from '../models/Course.js'

export async function getLessonById(req, res) {
  const lesson = await Lesson.findById(req.params.id).lean()
  if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' })
  res.json({ success: true, lesson })
}

export async function getLessonsByCourseId(req, res) {
  const course = await Course.findById(req.params.courseId).lean()
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  const lessons = (course.curriculum || []).flatMap((module) => module.lessons || [])
  res.json({ success: true, lessons })
}
