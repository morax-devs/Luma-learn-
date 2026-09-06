import { Link, useParams } from 'react-router-dom'
import { CourseCurriculum } from '../components/CourseCurriculum'
import { Button, Card, PageContainer, ProgressBar } from '../components/ui'
import { ErrorState, LoadingState } from '../components/ui'
import { useAsyncData } from '../hooks/useAsyncData'
import { useEnrollment } from '../hooks/useEnrollment'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { courseService } from '../services/courseService'

export function CourseDetailsPage() {
  const { courseId } = useParams()
  const { data: course, loading, error, retry } = useAsyncData(() => courseService.getCourseById(courseId), [courseId])
  const activeCourse = course || { id: courseId, curriculum: [] }
  const courseProgress = useCourseProgress(activeCourse)
  const enrollment = useEnrollment(courseId)
  if (loading) return <PageContainer><LoadingState /></PageContainer>
  if (error) return <PageContainer><ErrorState onRetry={retry} /></PageContainer>
  if (!course) return <PageContainer><Card className="not-found"><h1>Course not found</h1><p className="page-lede">That course may have moved, but there is plenty more to explore.</p><Button to="/courses">Back to catalogue</Button></Card></PageContainer>
  const firstLesson = course.curriculum[0]?.lessons[0]
  const targetLessonId = courseProgress.nextLesson?.id || firstLesson?.id || ''

  return <PageContainer className="course-details-page"><Link className="back-link" to="/courses">← Back to catalogue</Link><section className={`course-hero art-${course.thumbnail.toLowerCase()}`}><div className="course-hero-art"><span>{course.thumbnail}</span><i>{course.category}</i></div><div className="course-hero-copy"><p className="eyebrow">{course.level} <span>·</span> {course.duration}</p><h1>{course.title}</h1><p>{course.description}</p><div className="course-hero-meta"><span>With <strong>{course.instructor}</strong></span><span>★ <strong>{course.rating}</strong></span><span><strong>{course.numberOfStudents.toLocaleString()}</strong> students</span></div>{courseProgress.completedCount ? <div className="enrolled-action"><ProgressBar value={courseProgress.progress} label="Overall progress" /><Button to={`/learn/${course.id}?lesson=${targetLessonId}`} state={{ courseId: course.id, lessonId: targetLessonId }}>Continue learning <span>→</span></Button></div> : <Button to={`/learn/${course.id}?lesson=${targetLessonId}`} state={{ courseId: course.id, lessonId: targetLessonId }} onClick={enrollment.enroll}>{enrollment.enrolled ? 'Start learning' : 'Enroll now'} <span>→</span></Button>}</div></section><div className="details-layout"><div><div className="section-heading details-heading"><div><p className="eyebrow">THE CURRICULUM</p><h2>Learn by doing</h2></div><span>{course.curriculum.length} modules · {course.lessons} lessons</span></div><CourseCurriculum course={course} /></div><aside className="course-aside"><Card><p className="eyebrow">AT A GLANCE</p><div className="aside-stat"><span>Course level</span><strong>{course.level}</strong></div><div className="aside-stat"><span>Estimated time</span><strong>{course.duration}</strong></div><div className="aside-stat"><span>Certificate</span><strong>Included</strong></div><div className="aside-stat"><span>Access</span><strong>Lifetime</strong></div></Card><Card className="instructor-card"><div className="instructor-avatar">{course.instructor.split(' ').map((name) => name[0]).join('').slice(0, 2)}</div><p className="eyebrow">YOUR INSTRUCTOR</p><h3>{course.instructor}</h3><p>Practitioner, teacher, and believer in learning through real work.</p></Card></aside></div></PageContainer>
}
