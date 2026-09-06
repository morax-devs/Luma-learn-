import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from './ui'

export function CourseCurriculum({ course }) {
  const [openModules, setOpenModules] = useState([course.curriculum[0]?.id])
  const toggleModule = (moduleId) => setOpenModules((current) => current.includes(moduleId) ? current.filter((id) => id !== moduleId) : [...current, moduleId])

  return (
    <div className="curriculum-list">
      {course.curriculum.map((module, index) => {
        const isOpen = openModules.includes(module.id)
        return <Card className="module-card" key={module.id}>
          <button className="module-toggle" onClick={() => toggleModule(module.id)} aria-expanded={isOpen} aria-controls={`module-${module.id}`}>
            <span className="module-number">0{index + 1}</span><span className="module-summary"><strong>{module.title}</strong><small>{module.lessons.length} lessons <i>·</i> {module.duration}</small></span><span className="module-completion"><b>{module.completion}%</b><small>complete</small></span><span className={`chevron ${isOpen ? 'is-open' : ''}`}>⌄</span>
          </button>
          {isOpen && <div className="lesson-list" id={`module-${module.id}`}>{module.lessons.map((lesson) => <Link className="lesson-item" to={`/learn/${course.id}?lesson=${lesson.id}`} state={{ courseId: course.id, lessonId: lesson.id }} key={lesson.id}><span className={`lesson-icon ${lesson.completed ? 'completed' : ''}`}>{lesson.completed ? '✓' : '▶'}</span><span><strong>{lesson.title}</strong><small>{lesson.duration}</small></span><span className="lesson-arrow">→</span></Link>)}</div>}
        </Card>
      })}
    </div>
  )
}
