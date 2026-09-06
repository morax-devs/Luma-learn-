import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import {
  changeEmail,
  changePassword,
  deleteAccount,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authController.js'

const router = Router()
router.post('/register', asyncHandler(registerUser))
router.post('/login', asyncHandler(loginUser))
router.post('/logout', asyncHandler(logoutUser))
router.get('/me', requireAuth, asyncHandler(getCurrentUser))
router.post('/change-password', requireAuth, asyncHandler(changePassword))
router.post('/change-email', requireAuth, asyncHandler(changeEmail))
router.delete('/account', requireAuth, asyncHandler(deleteAccount))

export default router
