import { Quiz } from '../models/Quiz.js'

export async function getQuizzes(req, res) {
  const quizzes = await Quiz.find().lean()
  res.json({ success: true, quizzes })
}

export async function getQuizById(req, res) {
  const quiz = await Quiz.findById(req.params.id).lean()
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' })
  res.json({ success: true, quiz })
}
