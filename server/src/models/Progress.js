import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  completedLessons: [{ type: String, required: true }],
  percentage: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true })

progressSchema.index({ user: 1, course: 1 }, { unique: true })

export const Progress = mongoose.model('Progress', progressSchema)
