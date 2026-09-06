import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { Enrollment } from '../models/Enrollment.js'
import { Progress } from '../models/Progress.js'
import { QuizResult } from '../models/QuizResult.js'

function createAuthToken(userId) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is required for authentication.')
  return jwt.sign({ userId }, secret, { expiresIn: '8h' })
}

function buildUserResponse(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    learningGoal: user.learningGoal,
    bio: user.bio,
  }
}

export async function registerUser(req, res) {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existingUser = await User.findOne({ email: normalizedEmail })
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'A user with that email already exists.' })
  }

  const user = new User({ name: name.trim(), email: normalizedEmail, password })
  await user.save()

  const token = createAuthToken(user._id)
  res.status(201).json({ success: true, user: buildUserResponse(user), token })
}

export async function loginUser(req, res) {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' })
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' })
  }

  const isValid = await user.comparePassword(password)
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' })
  }

  const token = createAuthToken(user._id)
  res.json({ success: true, user: buildUserResponse(user), token })
}

export function getCurrentUser(req, res) {
  res.json({ success: true, user: buildUserResponse(req.user) })
}

export function logoutUser(req, res) {
  res.json({ success: true })
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body || {}
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required.' })
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' })
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ success: false, message: 'New password cannot be the same as your current password.' })
  }

  const user = await User.findById(req.userId).select('+password')
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' })
  }

  const isValid = await user.comparePassword(currentPassword)
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect.' })
  }

  user.password = newPassword
  await user.save()

  res.json({ success: true, message: 'Password updated successfully.' })
}

export async function changeEmail(req, res) {
  const { newEmail, currentPassword } = req.body || {}
  if (!newEmail || !currentPassword) {
    return res.status(400).json({ success: false, message: 'New email and current password are required.' })
  }

  const normalizedEmail = String(newEmail).toLowerCase().trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' })
  }

  const user = await User.findById(req.userId).select('+password')
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' })
  }

  const isValid = await user.comparePassword(currentPassword)
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect.' })
  }

  if (normalizedEmail === user.email) {
    return res.status(400).json({ success: false, message: 'New email cannot be the same as your current email.' })
  }

  const existingUser = await User.findOne({ email: normalizedEmail })
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'A user with that email already exists.' })
  }

  user.email = normalizedEmail
  await user.save()

  res.json({ success: true, message: 'Email updated successfully.', user: buildUserResponse(user) })
}

export async function deleteAccount(req, res) {
  const { password } = req.body || {}
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required to confirm account deletion.' })
  }

  const user = await User.findById(req.userId).select('+password')
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' })
  }

  const isValid = await user.comparePassword(password)
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Incorrect password. Account was not deleted.' })
  }

  await Promise.all([
    User.findByIdAndDelete(req.userId),
    Enrollment.deleteMany({ user: req.userId }),
    Progress.deleteMany({ user: req.userId }),
    QuizResult.deleteMany({ user: req.userId }),
  ])

  res.json({ success: true, message: 'Account deleted successfully.' })
}

