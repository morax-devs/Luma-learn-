import { Link } from 'react-router-dom'
import { Card } from './ui'

export function QuizEntry({ quiz }) {
  return <Card className="quiz-entry"><span className="quiz-icon">?</span><div><p className="eyebrow">KNOWLEDGE CHECK</p><h3>{quiz.title}</h3><p>{quiz.questions.length} questions · {quiz.duration}</p></div><Link to={`/quiz/${quiz.id}`} className="quiz-link">Take quiz <span>→</span></Link></Card>
}
