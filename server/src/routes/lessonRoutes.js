import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { getLessonById, getLessonsByCourseId } from '../controllers/lessonController.js'

const router = Router()
router.get('/courses/:courseId/lessons', asyncHandler(getLessonsByCourseId))
router.get('/lessons/:id', asyncHandler(getLessonById))

export default router
