import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { getQuizHistory, saveQuizResult } from '../controllers/quizResultController.js'

const router = Router()
router.get('/results/history', requireAuth, asyncHandler(getQuizHistory))
router.post('/:quizId/results', requireAuth, asyncHandler(saveQuizResult))

export default router
