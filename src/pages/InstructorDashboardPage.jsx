import { Link } from 'react-router-dom'
import { Button, Card, EmptyState, ErrorState, LoadingState, PageContainer } from '../components/ui'
import { useAsyncData } from '../hooks/useAsyncData'
import { courseService } from '../services/courseService'

export function InstructorDashboardPage() {
  const { data, loading, error, retry } = useAsyncData(courseService.getInstructorCourses, [])

  if (loading) return <PageContainer><LoadingState /></PageContainer>
  if (error) return <PageContainer><ErrorState onRetry={retry} /></PageContainer>

  const courses = Array.isArray(data) ? data : []
  const totalModules = courses.reduce((acc, c) => acc + (c.modules || c.curriculum?.length || 0), 0)
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessons || 0), 0)
  const totalStudents = courses.reduce((acc, c) => acc + (c.numberOfStudents || 0), 0)

  return (
    <PageContainer className="instructor-page">
      <div className="instructor-header">
        <div>
          <p className="eyebrow coral">INSTRUCTOR STUDIO</p>
          <h1>Course Management</h1>
          <p className="page-lede">Design curriculum, write lesson material, and create quizzes for your learners.</p>
        </div>
        <div className="instructor-actions">
          <Button to="/instructor/courses/new" variant="primary">
            <span>+</span> Create new course
          </Button>
        </div>
      </div>

      <section className="instructor-metrics">
        <Card>
          <strong>{courses.length}</strong>
          <span>Published courses</span>
        </Card>
        <Card>
          <strong>{totalModules}</strong>
          <span>Curriculum modules</span>
        </Card>
        <Card>
          <strong>{totalLessons}</strong>
          <span>Total lessons</span>
        </Card>
        <Card>
          <strong>{totalStudents}</strong>
          <span>Enrolled students</span>
        </Card>
      </section>

      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h2>Your Courses</h2>
        </div>
        <span>{courses.length} {courses.length === 1 ? 'course' : 'courses'} authored</span>
      </div>

      {courses.length ? (
        <div className="instructor-course-grid">
          {courses.map((course) => (
            <Card key={course.id} className="instructor-course-card">
              <div className="instructor-card-top">
                <span className="instructor-course-badge">{course.thumbnail || 'AI'}</span>
                <div className="instructor-card-meta">
                  <span className="course-chip">{course.category}</span>
                  <span className="course-chip level-chip">{course.level}</span>
                </div>
              </div>

              <h3>{course.title}</h3>
              <p className="instructor-card-desc">{course.description}</p>

              <div className="instructor-card-stats">
                <span><strong>{course.modules || course.curriculum?.length || 0}</strong> modules</span>
                <span>·</span>
                <span><strong>{course.lessons || 0}</strong> lessons</span>
                <span>·</span>
                <span><strong>{course.numberOfStudents || 0}</strong> students</span>
              </div>

              <div className="instructor-card-actions">
                <Button to={`/instructor/courses/${course.id}/edit`} variant="secondary" className="compact-btn">
                  Edit course ✎
                </Button>
                <Link to={`/courses/${course.id}`} className="button button-secondary compact-btn">
                  Public page ↗
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses created yet"
          description="Start sharing your expertise by authoring your first course with rich text lessons, video guides, and comprehension quizzes."
          action={
            <Button to="/instructor/courses/new" variant="primary">
              Create your first course <span>+</span>
            </Button>
          }
        />
      )}
    </PageContainer>
  )
}
