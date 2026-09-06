import { User } from '../models/User.js'

export async function getProfile(req, res) {
  const user = await User.findById(req.userId).lean()
  if (!user) return res.status(404).json({ success: false, message: 'Profile not found.' })

  const profile = {
    id: user._id.toString(),
    name: user.name,
    role: user.role,
    learningGoal: user.learningGoal,
    bio: user.bio,
  }

  res.json({ success: true, profile })
}

export async function updateProfile(req, res) {
  const updates = {}
  const { name, learningGoal, bio } = req.body

  if (typeof name === 'string') updates.name = name.trim()
  if (typeof learningGoal === 'string') updates.learningGoal = learningGoal.trim()
  if (typeof bio === 'string') updates.bio = bio.trim()

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: 'At least one profile field is required.' })
  }

  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true }).lean()
  if (!user) return res.status(404).json({ success: false, message: 'Profile not found.' })

  const profile = {
    id: user._id.toString(),
    name: user.name,
    role: user.role,
    learningGoal: user.learningGoal,
    bio: user.bio,
  }

  res.json({ success: true, profile })
}
