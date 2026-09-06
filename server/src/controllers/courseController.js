import mongoose from 'mongoose'
import { Course } from '../models/Course.js'
import { Enrollment } from '../models/Enrollment.js'

export async function getCourses(req, res) {
  const courses = await Course.find().sort({ createdAt: -1 }).lean()
  const normalizedCourses = courses.map((course) => ({
    ...course,
    id: course.id || course._id.toString(),
  }))
  res.json({ success: true, courses: normalizedCourses })
}

export async function getCourseById(req, res) {
  const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id)
  const course = isObjectId
    ? await Course.findById(req.params.id).lean()
    : await Course.findOne({ id: req.params.id }).lean()

  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })
  res.json({ success: true, course: { ...course, id: course.id || course._id.toString() } })
}

export async function enrollInCourse(req, res) {
  const userId = req.userId
  const courseId = req.params.id
  const course = await Course.findById(courseId).lean()
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  const enrollment = await Enrollment.findOneAndUpdate(
    { user: userId, course: courseId },
    { user: userId, course: courseId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean()

  res.json({ success: true, enrollment: { courseId: enrollment.course.toString(), enrolledAt: enrollment.enrolledAt } })
}
