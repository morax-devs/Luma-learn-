import { AnswerOption } from './AnswerOption'

export function QuestionCard({ question, questionNumber, selectedAnswer, onSelect, disabled }) {
  return <section className="question-card"><div className="question-label">QUESTION {String(questionNumber).padStart(2, '0')}</div><h2>{question.question}</h2><div className="answer-list">{question.options.map((option, index) => <AnswerOption option={option} index={index} selected={selectedAnswer === option} onSelect={onSelect} disabled={disabled} key={option} />)}</div></section>
}
