import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { enrollInCourse, getCourseById, getCourses } from '../controllers/courseController.js'

const router = Router()
router.get('/', asyncHandler(getCourses))
router.get('/:id', asyncHandler(getCourseById))
router.post('/:id/enroll', requireAuth, asyncHandler(enrollInCourse))

export default router
