import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, default: '' },
}, { _id: true })

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  passingScore: { type: Number, default: 70, min: 0, max: 100 },
  questions: [questionSchema],
}, { timestamps: true })

export const Quiz = mongoose.model('Quiz', quizSchema)
