import { Button } from '../ui'

export function QuizNavigation({ currentIndex, totalQuestions, canSubmit, onPrevious, onNext, onSubmit, warning }) {
  return <div className="quiz-navigation"><Button variant="secondary" onClick={onPrevious} className={currentIndex === 0 ? 'button-disabled' : ''} aria-disabled={currentIndex === 0}>← Previous</Button>{warning && <p className="quiz-warning" role="alert">{warning}</p>}{currentIndex < totalQuestions - 1 ? <Button onClick={onNext}>Next question <span>→</span></Button> : <Button onClick={onSubmit} className={!canSubmit ? 'submit-incomplete' : ''}>Submit quiz <span>✓</span></Button>}</div>
}
