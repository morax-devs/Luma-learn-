import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth, requireInstructor } from '../middleware/authMiddleware.js'
import {
  addLesson,
  addModule,
  createCourse,
  deleteLesson,
  deleteModule,
  enrollInCourse,
  getCourseById,
  getCourseQuiz,
  getCourses,
  getInstructorCourses,
  saveCourseQuiz,
  updateCourse,
  updateLesson,
  updateModule,
} from '../controllers/courseController.js'

const router = Router()
router.get('/', asyncHandler(getCourses))
router.get('/instructor/mine', requireAuth, requireInstructor, asyncHandler(getInstructorCourses))
router.post('/', requireAuth, requireInstructor, asyncHandler(createCourse))
router.get('/:id', asyncHandler(getCourseById))
router.patch('/:id', requireAuth, requireInstructor, asyncHandler(updateCourse))
router.post('/:id/enroll', requireAuth, asyncHandler(enrollInCourse))

// Curriculum management routes
router.post('/:id/modules', requireAuth, requireInstructor, asyncHandler(addModule))
router.patch('/:id/modules/:moduleId', requireAuth, requireInstructor, asyncHandler(updateModule))
router.delete('/:id/modules/:moduleId', requireAuth, requireInstructor, asyncHandler(deleteModule))
router.post('/:id/modules/:moduleId/lessons', requireAuth, requireInstructor, asyncHandler(addLesson))
router.patch('/:id/modules/:moduleId/lessons/:lessonId', requireAuth, requireInstructor, asyncHandler(updateLesson))
router.delete('/:id/modules/:moduleId/lessons/:lessonId', requireAuth, requireInstructor, asyncHandler(deleteLesson))

// Quiz management routes
router.get('/:id/quiz', requireAuth, requireInstructor, asyncHandler(getCourseQuiz))
router.put('/:id/quiz', requireAuth, requireInstructor, asyncHandler(saveCourseQuiz))

export default router
