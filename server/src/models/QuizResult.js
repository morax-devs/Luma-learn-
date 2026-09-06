import mongoose from 'mongoose'

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  answers: { type: Map, of: String, default: {} },
  score: { type: Number, required: true, min: 0 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  passed: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const QuizResult = mongoose.model('QuizResult', quizResultSchema)
