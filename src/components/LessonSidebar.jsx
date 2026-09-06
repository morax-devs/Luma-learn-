import { Link } from 'react-router-dom'

export function LessonSidebar({ course, lesson, isComplete }) {
  return <aside className="learning-aside"><div className="lesson-aside-head"><p className="eyebrow">COURSE PROGRESS</p><strong>{course.title}</strong></div>{course.curriculum.map((module, moduleIndex) => <div className="mini-module" key={module.id}><small>0{moduleIndex + 1} · {module.title}</small>{module.lessons.map((item) => <Link className={item.id === lesson.id ? 'mini-lesson current' : 'mini-lesson'} to={`/learn/${course.id}?lesson=${item.id}`} key={item.id}><span>{isComplete(item.id) ? '✓' : '○'}</span>{item.title}</Link>)}</div>)}</aside>
}
