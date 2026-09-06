export function QuizHeader({ quiz, course, currentIndex, totalQuestions }) {
  return <header className="quiz-header"><div><p className="eyebrow coral">KNOWLEDGE CHECK · {course.category}</p><h1>{quiz.title}</h1><p>{quiz.description}</p></div><div className="quiz-counter"><strong>{currentIndex + 1}</strong><span>of {totalQuestions}<br />questions</span></div></header>
}
