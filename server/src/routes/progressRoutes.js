import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { getCourseProgress, updateLessonProgress } from '../controllers/progressController.js'

const router = Router({ mergeParams: true })
router.get('/', requireAuth, asyncHandler(getCourseProgress))
router.post('/lessons/:lessonId', requireAuth, asyncHandler(updateLessonProgress))

export default router
