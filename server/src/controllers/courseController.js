import mongoose from 'mongoose'
import { Course } from '../models/Course.js'
import { Enrollment } from '../models/Enrollment.js'
import { Quiz } from '../models/Quiz.js'

function normalizeCourse(course) {
  if (!course) return null
  return {
    ...course,
    id: course.id || (course._id ? course._id.toString() : undefined),
  }
}

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

export async function getInstructorCourses(req, res) {
  const courses = await Course.find({ instructorId: req.userId }).sort({ createdAt: -1 }).lean()
  res.json({ success: true, courses: courses.map(normalizeCourse) })
}

export async function createCourse(req, res) {
  const { title, description, category, level, duration, thumbnail, curriculum } = req.body || {}
  if (!title || !description || !category || !level) {
    return res.status(400).json({ success: false, message: 'Title, description, category, and level are required.' })
  }

  const initialCurriculum = Array.isArray(curriculum) ? curriculum : []
  const modulesCount = initialCurriculum.length
  const lessonsCount = initialCurriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)

  const course = new Course({
    title: title.trim(),
    description: description.trim(),
    instructor: req.user.name || 'Instructor',
    instructorId: req.userId,
    category: category.trim(),
    level: level.trim(),
    duration: duration?.trim() || 'Self-paced',
    thumbnail: thumbnail?.trim() || 'AI',
    curriculum: initialCurriculum,
    modules: modulesCount,
    lessons: lessonsCount,
  })

  await course.save()
  res.status(201).json({ success: true, course: normalizeCourse(course.toObject()) })
}

export async function updateCourse(req, res) {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  if (course.instructorId && course.instructorId.toString() !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not authorized to edit this course.' })
  }

  const { title, description, category, level, duration, thumbnail, curriculum } = req.body || {}
  if (title !== undefined) course.title = title.trim()
  if (description !== undefined) course.description = description.trim()
  if (category !== undefined) course.category = category.trim()
  if (level !== undefined) course.level = level.trim()
  if (duration !== undefined) course.duration = duration.trim()
  if (thumbnail !== undefined) course.thumbnail = thumbnail.trim()

  if (Array.isArray(curriculum)) {
    course.curriculum = curriculum
    course.modules = curriculum.length
    course.lessons = curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  }

  await course.save()
  res.json({ success: true, course: normalizeCourse(course.toObject()) })
}

export async function addModule(req, res) {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  if (course.instructorId && course.instructorId.toString() !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not authorized to edit this course.' })
  }

  const { title } = req.body || {}
  if (!title) return res.status(400).json({ success: false, message: 'Module title is required.' })

  const newModule = {
    id: `mod-${Date.now()}`,
    title: title.trim(),
    duration: '',
    completion: 0,
    lessons: [],
  }

  course.curriculum.push(newModule)
  course.modules = course.curriculum.length
  await course.save()

  res.status(201).json({ success: true, module: newModule, course: normalizeCourse(course.toObject()) })
}

export async function updateModule(req, res) {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  if (course.instructorId && course.instructorId.toString() !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not authorized to edit this course.' })
  }

  const mod = course.curriculum.find((m) => m.id === req.params.moduleId)
  if (!mod) return res.status(404).json({ success: false, message: 'Module not found' })

  const { title } = req.body || {}
  if (title) mod.title = title.trim()

  await course.save()
  res.json({ success: true, module: mod, course: normalizeCourse(course.toObject()) })
}

export async function deleteModule(req, res) {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  if (course.instructorId && course.instructorId.toString() !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not authorized to edit this course.' })
  }

  course.curriculum = course.curriculum.filter((m) => m.id !== req.params.moduleId)
  course.modules = course.curriculum.length
  course.lessons = course.curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  await course.save()

  res.json({ success: true, course: normalizeCourse(course.toObject()) })
}

export async function addLesson(req, res) {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  if (course.instructorId && course.instructorId.toString() !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not authorized to edit this course.' })
  }

  const mod = course.curriculum.find((m) => m.id === req.params.moduleId)
  if (!mod) return res.status(404).json({ success: false, message: 'Module not found' })

  const { title, duration, content, videoUrl } = req.body || {}
  if (!title) return res.status(400).json({ success: false, message: 'Lesson title is required.' })

  const newLesson = {
    id: `les-${Date.now()}`,
    title: title.trim(),
    duration: duration?.trim() || '10 min',
    completed: false,
    content: content || '',
    videoUrl: videoUrl?.trim() || '',
  }

  mod.lessons.push(newLesson)
  course.lessons = course.curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  await course.save()

  res.status(201).json({ success: true, lesson: newLesson, course: normalizeCourse(course.toObject()) })
}

export async function updateLesson(req, res) {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  if (course.instructorId && course.instructorId.toString() !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not authorized to edit this course.' })
  }

  const mod = course.curriculum.find((m) => m.id === req.params.moduleId)
  if (!mod) return res.status(404).json({ success: false, message: 'Module not found' })

  const lesson = mod.lessons.find((l) => l.id === req.params.lessonId)
  if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' })

  const { title, duration, content, videoUrl } = req.body || {}
  if (title !== undefined) lesson.title = title.trim()
  if (duration !== undefined) lesson.duration = duration.trim()
  if (content !== undefined) lesson.content = content
  if (videoUrl !== undefined) lesson.videoUrl = videoUrl.trim()

  await course.save()
  res.json({ success: true, lesson, course: normalizeCourse(course.toObject()) })
}

export async function deleteLesson(req, res) {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  if (course.instructorId && course.instructorId.toString() !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not authorized to edit this course.' })
  }

  const mod = course.curriculum.find((m) => m.id === req.params.moduleId)
  if (!mod) return res.status(404).json({ success: false, message: 'Module not found' })

  mod.lessons = mod.lessons.filter((l) => l.id !== req.params.lessonId)
  course.lessons = course.curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  await course.save()

  res.json({ success: true, course: normalizeCourse(course.toObject()) })
}

export async function getCourseQuiz(req, res) {
  const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id)
  if (!isObjectId) return res.json({ success: true, quiz: null })

  const quiz = await Quiz.findOne({ course: req.params.id }).lean()
  res.json({ success: true, quiz: quiz ? { ...quiz, id: quiz._id.toString() } : null })
}

export async function saveCourseQuiz(req, res) {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' })

  if (course.instructorId && course.instructorId.toString() !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not authorized to edit this course.' })
  }

  const { title, description, passingScore, questions } = req.body || {}
  if (!title) return res.status(400).json({ success: false, message: 'Quiz title is required.' })

  const normalizedQuestions = Array.isArray(questions) ? questions.map((q) => ({
    question: q.question?.trim() || '',
    options: Array.isArray(q.options) ? q.options.map((opt) => String(opt).trim()) : [],
    correctAnswer: q.correctAnswer?.trim() || '',
    explanation: q.explanation?.trim() || '',
  })) : []

  const quiz = await Quiz.findOneAndUpdate(
    { course: req.params.id },
    {
      course: req.params.id,
      title: title.trim(),
      description: description?.trim() || '',
      passingScore: typeof passingScore === 'number' ? passingScore : 70,
      questions: normalizedQuestions,
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean()

  res.json({ success: true, quiz: { ...quiz, id: quiz._id.toString() } })
}
