import { Quiz } from '../models/Quiz.js'
import { QuizResult } from '../models/QuizResult.js'

export async function getQuizHistory(req, res) {
  const results = await QuizResult.find({ user: req.userId })
    .populate({ path: 'quiz', select: 'course' })
    .sort({ submittedAt: -1 })
    .lean()

  const mapped = results.map((item) => {
    const quiz = item.quiz || {}
    const answers = item.answers instanceof Map ? Object.fromEntries(item.answers) : item.answers || {}
    return {
      quizId: quiz._id?.toString() || item.quiz?.toString() || '',
      courseId: quiz.course?.toString() || null,
      answers,
      score: item.score,
      percentage: item.percentage,
      passed: item.passed,
      submittedAt: item.submittedAt,
    }
  })

  res.json({ success: true, results: mapped })
}

export async function saveQuizResult(req, res) {
  const quizId = req.params.quizId
  const { answers, score, percentage, passed } = req.body || {}

  if (!answers || typeof score !== 'number' || typeof percentage !== 'number' || typeof passed !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Quiz result body is invalid.' })
  }

  const quiz = await Quiz.findById(quizId).lean()
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' })

  const result = await QuizResult.create({ user: req.userId, quiz: quiz._id, answers, score, percentage, passed })
  const resultAnswers = result.answers instanceof Map ? Object.fromEntries(result.answers) : result.answers || {}
  res.status(201).json({ success: true, result: {
    quizId: result.quiz.toString(),
    courseId: quiz.course.toString(),
    answers: resultAnswers,
    score: result.score,
    percentage: result.percentage,
    passed: result.passed,
    submittedAt: result.submittedAt,
  } })
}
