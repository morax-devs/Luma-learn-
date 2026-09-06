import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { getProfile, updateProfile } from '../controllers/profileController.js'

const router = Router()
router.get('/', requireAuth, asyncHandler(getProfile))
router.patch('/', requireAuth, asyncHandler(updateProfile))

export default router
