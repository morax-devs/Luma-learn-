import { Link } from 'react-router-dom'
import { Card, ProgressBar } from './ui'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { useEnrollment } from '../hooks/useEnrollment'

export function CourseCard({ course, progress }) {
  const courseId = course.id || course._id
  const courseProgress = useCourseProgress(course)
  const enrollment = useEnrollment(courseId)
  const hasProgress = progress || courseProgress.completedCount > 0
  const progressValue = progress ? courseProgress.progress : courseProgress.progress
  const thumbnail = course.thumbnail ? course.thumbnail.toLowerCase() : 'ai'
  return (
    <Card className="course-card">
      <div className={`course-art art-${thumbnail}`}><span>{course.thumbnail || 'C'}</span><i>{course.category}</i></div>
      <div className="course-card-body">
        <div className="eyebrow">{course.level} <span>·</span> {course.duration}</div>
        <h3><Link to={`/courses/${courseId}`}>{course.title}</Link></h3>
        <p>{course.description}</p>
        <div className="course-meta"><span>{course.instructor}</span><span>★ {course.rating}</span></div>
        {hasProgress ? <ProgressBar value={progressValue} label={`${courseProgress.completedCount} lessons complete`} /> : <div className="course-foot"><span>{course.modules} modules</span><span>{course.numberOfStudents?.toLocaleString() || 0} learners</span></div>}
        <Link className="course-action" to={`/courses/${courseId}`}>{hasProgress ? 'Continue learning' : enrollment.enrolled ? 'Start learning' : 'Enroll now'} <span>→</span></Link>
      </div>
    </Card>
  )
}
