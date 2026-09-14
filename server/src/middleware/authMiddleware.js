import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token is required.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not configured.')

    const payload = jwt.verify(token, secret)
    if (!payload?.userId) throw new Error('Invalid token payload.')

    const user = await User.findById(payload.userId)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid authorization token.' })
    }

    req.userId = user._id.toString()
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authorization token.', details: error.message })
  }
}

export function requireInstructor(req, res, next) {
  if (!req.user || (req.user.role !== 'instructor' && req.user.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Access denied. Instructor role required.' })
  }
  next()
}

