import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { getQuizById, getQuizzes } from '../controllers/quizController.js'

const router = Router()
router.get('/', asyncHandler(getQuizzes))
router.get('/:id', asyncHandler(getQuizById))

export default router
