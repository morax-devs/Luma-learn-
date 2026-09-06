import { Link, useLocation, useParams } from 'react-router-dom'
import { LessonNavigation } from '../components/LessonNavigation'
import { LessonPlayer } from '../components/LessonPlayer'
import { LessonSidebar } from '../components/LessonSidebar'
import { QuizEntry } from '../components/QuizEntry'
import { Card, ErrorState, LoadingState, PageContainer } from '../components/ui'
import { useAsyncData } from '../hooks/useAsyncData'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { courseService } from '../services/courseService'
import { quizService } from '../services/quizService'

const lessonCopy = 'In this lesson, we will turn an abstract idea into a clear product decision. Take a moment to notice what the learner needs, what the system can do, and where a thoughtful design creates trust.'

export function LearningPage() {
  const { courseId } = useParams()
  const location = useLocation()
  const { data: course, loading: courseLoading, error: courseError, retry: retryCourse } = useAsyncData(() => courseService.getCourseById(courseId), [courseId])
  const { data: quizList } = useAsyncData(() => quizService.getQuizzes().catch(() => []), [])
  const activeCourse = course || { id: courseId, curriculum: [] }
  const progress = useCourseProgress(activeCourse)
  const requestedLesson = new URLSearchParams(location.search).get('lesson') || location.state?.lessonId
  const allLessons = activeCourse.curriculum.flatMap((module) => module.lessons)
  const lesson = allLessons.find((item) => item.id === requestedLesson) || progress.nextLesson || allLessons[0]
  const lessonIndex = lesson ? allLessons.findIndex((item) => item.id === lesson.id) : -1
  const currentModule = lesson && activeCourse.curriculum.find((module) => module.lessons.some((item) => item.id === lesson.id))
  const quiz = quizList?.find((item) => item.courseId === activeCourse.id)
  if (courseLoading) return <PageContainer><LoadingState /></PageContainer>
  if (courseError) return <PageContainer><ErrorState onRetry={retryCourse} /></PageContainer>
  if (!course) return <PageContainer><Card className="not-found"><h1>Course not found</h1><p className="page-lede">Choose a course from the catalogue to begin learning.</p><Link className="button button-primary" to="/courses">Back to catalogue</Link></Card></PageContainer>

  return <PageContainer className="learning-page"><div className="learning-topbar"><Link className="back-link" to={`/courses/${course.id}`}>← Back to course</Link><div><span className="eyebrow">NOW LEARNING</span><strong>{course.title}</strong></div><div className="learning-progress"><span>{progress.completedCount} of {allLessons.length} lessons</span><b>{progress.progress}%</b></div></div><div className="learning-layout"><article className="lesson-content"><div className="lesson-context"><p className="eyebrow coral">MODULE {String(activeCourse.curriculum.indexOf(currentModule) + 1).padStart(2, '0')} · {currentModule?.title}</p><span>{lesson.duration}</span></div><LessonPlayer course={course} lesson={lesson} isComplete={progress.isComplete(lesson.id)} /><h1>{lesson.title}</h1><p className="lesson-lede">{lessonCopy}</p><LessonNavigation previousLesson={allLessons[lessonIndex - 1]} nextLesson={allLessons[lessonIndex + 1]} courseId={course.id} currentLesson={lesson} isComplete={progress.isComplete} onComplete={progress.markLessonComplete} /><div className="lesson-body"><h2>Make the problem concrete</h2><p>Great products start with a specific moment in someone's day. Before thinking about features, describe that moment in plain language. What is the person trying to accomplish? What gets in their way? What would make the next step feel obvious?</p><blockquote>Useful is not a feature. It is the feeling of making progress.</blockquote><p>Keep this lens close as you move through the rest of the course. The strongest decisions are usually the ones that make a real constraint easier to navigate.</p></div>{quiz && <QuizEntry quiz={quiz} />}</article><LessonSidebar course={course} lesson={lesson} isComplete={progress.isComplete} /></div></PageContainer>
}
