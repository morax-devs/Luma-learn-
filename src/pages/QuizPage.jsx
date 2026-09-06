import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { AnswerReview } from '../components/quiz/AnswerReview'
import { QuestionCard } from '../components/quiz/QuestionCard'
import { QuizHeader } from '../components/quiz/QuizHeader'
import { QuizNavigation } from '../components/quiz/QuizNavigation'
import { QuizProgress } from '../components/quiz/QuizProgress'
import { QuizResult } from '../components/quiz/QuizResult'
import { Button, Card, ErrorState, LoadingState, PageContainer } from '../components/ui'
import { useAsyncData } from '../hooks/useAsyncData'
import { courseService } from '../services/courseService'
import { quizService } from '../services/quizService'
import { getLatestQuizResult, saveQuizResult } from '../utils/quizStorage'

export function QuizPage() {
  const { quizId } = useParams()
  const { data, loading, error, retry } = useAsyncData(async () => {
    const quiz = await quizService.getQuizById(quizId)
    return { quiz, course: quiz ? await courseService.getCourseById(quiz.courseId) : null }
  }, [quizId])
  const quiz = data?.quiz
  const course = data?.course
  const activeQuiz = quiz || { id: quizId, questions: [] }
  const [answers, setAnswers] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [view, setView] = useState(() => getLatestQuizResult(activeQuiz.id) ? 'result' : 'active')
  const [result, setResult] = useState(() => getLatestQuizResult(activeQuiz.id))
  const [warning, setWarning] = useState('')
  if (loading) return <PageContainer><LoadingState /></PageContainer>
  if (error) return <PageContainer><ErrorState onRetry={retry} /></PageContainer>
  if (!quiz || !course) return <PageContainer><Card className="not-found"><h1>Quiz not found</h1><Button to="/courses">Back to catalogue</Button></Card></PageContainer>
  const question = quiz.questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const selectAnswer = (answer) => { setAnswers((current) => ({ ...current, [question.id]: answer })); setWarning('') }
  const submitQuiz = () => {
    if (answeredCount < quiz.questions.length) { setWarning(`Answer all ${quiz.questions.length} questions before submitting. ${quiz.questions.length - answeredCount} remaining.`); return }
    const score = quiz.questions.reduce((total, item) => total + (answers[item.id] === item.correctAnswer ? 1 : 0), 0)
    const nextResult = { quizId: quiz.id, courseId: course.id, answers, score, percentage: Math.round((score / quiz.questions.length) * 100), passed: Math.round((score / quiz.questions.length) * 100) >= quiz.passingScore, submittedAt: Date.now() }
    saveQuizResult(quiz.id, nextResult)
    setResult(nextResult)
    setView('result')
    setWarning('')
  }
  const retakeQuiz = () => { setAnswers({}); setCurrentIndex(0); setResult(null); setView('active'); setWarning('') }

  return <PageContainer className="quiz-page"><Link className="back-link" to={`/learn/${course.id}`}>← Back to learning</Link>{view === 'result' && result ? <QuizResult quiz={quiz} result={result} onReview={() => setView('review')} onRetake={retakeQuiz} courseId={course.id} /> : view === 'review' && result ? <AnswerReview quiz={quiz} result={result} onBack={() => setView('result')} /> : <><QuizHeader quiz={quiz} course={course} currentIndex={currentIndex} totalQuestions={quiz.questions.length} /><Card className="quiz-workspace"><QuizProgress questions={quiz.questions} answers={answers} currentIndex={currentIndex} onSelect={(index) => { setCurrentIndex(index); setWarning('') }} /><QuestionCard question={question} questionNumber={currentIndex + 1} selectedAnswer={answers[question.id]} onSelect={selectAnswer} /><QuizNavigation currentIndex={currentIndex} totalQuestions={quiz.questions.length} canSubmit={answeredCount === quiz.questions.length} onPrevious={() => { setCurrentIndex((index) => Math.max(0, index - 1)); setWarning('') }} onNext={() => { setCurrentIndex((index) => Math.min(quiz.questions.length - 1, index + 1)); setWarning('') }} onSubmit={submitQuiz} warning={warning} /></Card></>}</PageContainer>
}
