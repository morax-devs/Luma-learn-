import { Link } from 'react-router-dom'
import { Button, Card, EmptyState, ErrorState, LoadingState, PageContainer, ProgressBar } from '../components/ui'
import { CourseCard } from '../components/CourseCard'
import { useAsyncData } from '../hooks/useAsyncData'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { useQuizResults } from '../hooks/useQuizResults'
import { courseService } from '../services/courseService'
import { profileService } from '../services/profileService'
import { quizService } from '../services/quizService'
import { authService } from '../services/authService'

export function HomePage() {
  const isAuthenticated = authService.isAuthenticated()
  const { data, loading, error, retry } = useAsyncData(
    () => {
      if (isAuthenticated) {
        return Promise.all([
          courseService.getCourses(),
          profileService.getProfile(),
          quizService.getQuizzes().catch(() => []),
        ])
      }
      return Promise.all([
        courseService.getCourses(),
        Promise.resolve({ name: '', role: 'Guest', streak: 0, weeklyGoal: 0 }),
        Promise.resolve([]),
      ])
    },
    [isAuthenticated]
  )

  const [courseList = [], profile = {}, quizList = []] = data || []
  const featuredCourse = courseList[0] || { id: 'empty', curriculum: [] }
  const featuredCourseId = featuredCourse.id || featuredCourse._id
  const featuredProgress = useCourseProgress(featuredCourse)
  const { history: quizHistory } = useQuizResults()
  const latestQuiz = quizHistory[0]
  const latestQuizData = quizList.find((quiz) => quiz.id === latestQuiz?.quizId)
  const nextLesson = featuredProgress.nextLesson
  const completedLessons = featuredCourse.curriculum?.flatMap((module) => module.lessons).filter((lesson) => featuredProgress.completedIds.includes(lesson.id)).slice(-3) || []

  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
  const userName = profile.name && profile.name !== 'Learner' ? profile.name.split(' ')[0] : ''
  const greeting = isAuthenticated && userName ? `Welcome back, ${userName}.` : 'Welcome to Luma Learn.'
  const streakDays = profile.streak || 0
  const weeklyGoalPct = profile.weeklyGoal || 0
  const continueLink = nextLesson ? `/learn/${featuredCourseId}?lesson=${nextLesson.id}` : `/courses/${featuredCourseId}`

  if (loading) return <PageContainer><LoadingState /></PageContainer>
  if (error) return <PageContainer><ErrorState onRetry={retry} /></PageContainer>
  if (!courseList.length) {
    return (
      <PageContainer>
        <EmptyState
          title={isAuthenticated ? 'No courses yet' : 'Start learning something new'}
          description="Your learning space is empty right now."
          action={<Button to="/courses" variant="primary">Explore catalogue <span>↗</span></Button>}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="welcome-row">
        <div>
          <p className="eyebrow coral">{formattedDate}</p>
          <h1>{greeting}</h1>
          <p className="page-lede">
            {isAuthenticated
              ? 'Make a little progress today. It adds up.'
              : 'Explore courses, build practical skills, and track your learning progress.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button to="/courses" variant="secondary">Explore catalogue <span>↗</span></Button>
          {!isAuthenticated && <Button to="/login">Sign in to start <span>→</span></Button>}
        </div>
      </div>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow mint">{isAuthenticated ? 'CONTINUE YOUR PATH' : 'FEATURED COURSE'}</p>
          <h2>Build things that<br /><em>matter.</em></h2>
          <p>Keep shaping your product thinking with practical lessons from people who have done the work.</p>
          {isAuthenticated ? (
            <Button to={continueLink} state={nextLesson ? { courseId: featuredCourseId, lessonId: nextLesson.id } : undefined}>
              Continue learning <span>→</span>
            </Button>
          ) : (
            <Button to={`/courses/${featuredCourseId}`}>
              Explore course <span>→</span>
            </Button>
          )}
        </div>
        <div className="hero-figure">
          <div className="figure-grid" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-code"><span>01</span><b>AI</b><small>PRODUCT<br />BUILDER</small></div>
          <div className="hero-status">
            {isAuthenticated ? (
              <><strong>{featuredProgress.progress}%</strong><span>course<br />complete</span></>
            ) : (
              <><strong>{featuredCourse.lessons || 42}</strong><span>lessons<br />available</span></>
            )}
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div><p className="eyebrow">YOUR MOMENTUM</p><h2>Keep the rhythm</h2></div>
        <Link to="/courses">View all courses <span>→</span></Link>
      </div>

      <section className="progress-grid">
        <Card className="momentum-card">
          <div className="stat-number">{streakDays}<span>days</span></div>
          <div>
            <h3>Learning streak</h3>
            <p>
              {isAuthenticated
                ? (streakDays > 0 ? 'You are building a strong habit. Keep it going today.' : 'Start your first lesson to build a learning habit.')
                : 'Sign in to build your daily learning habit and track streaks.'}
            </p>
          </div>
          <div className="streak-bars">
            {[0, 0, 0, 0, 0, 0, 0].map((day, index) => <span className={day ? 'filled' : ''} key={index} />)}
          </div>
        </Card>

        <Card className="goal-card">
          <div className="goal-ring"><span>{weeklyGoalPct}<small>%</small></span></div>
          <div>
            <h3>Weekly goal</h3>
            <p>
              {isAuthenticated
                ? (weeklyGoalPct > 0 ? `${weeklyGoalPct}% of weekly target completed` : 'Set a weekly goal in your profile to track progress.')
                : 'Sign in to set and measure your weekly study targets.'}
            </p>
            <ProgressBar value={weeklyGoalPct} label="" />
          </div>
        </Card>
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <div><p className="eyebrow">RECENTLY COMPLETED</p><h2>Small wins, remembered</h2></div>
          {isAuthenticated && <Link to={continueLink}>Continue next lesson <span>→</span></Link>}
        </div>
        <Card className="recent-card">
          {completedLessons.length ? (
            completedLessons.map((lesson) => (
              <Link className="recent-lesson" to={`/learn/${featuredCourseId}?lesson=${lesson.id}`} key={lesson.id}>
                <span className="recent-check">✓</span>
                <span><strong>{lesson.title}</strong><small>{featuredCourse.title} · {lesson.duration}</small></span>
                <span className="recent-arrow">→</span>
              </Link>
            ))
          ) : (
            <p className="recent-empty">
              {isAuthenticated ? 'Complete your first lesson and it will show up here.' : 'Sign in to track your recently completed lessons.'}
            </p>
          )}
        </Card>
      </section>

      <Card className="dashboard-quiz-card">
        <div className="quiz-dashboard-icon">?</div>
        <div>
          <p className="eyebrow">QUIZ ACTIVITY</p>
          <h3>
            {latestQuizData
              ? latestQuizData.title
              : (isAuthenticated ? 'Ready to test your understanding?' : 'Test your skills with quizzes')}
          </h3>
          <p>
            {latestQuizData
              ? `Latest result · ${latestQuiz.percentage}% · ${latestQuiz.passed ? 'Passed' : 'Keep practicing'}`
              : (isAuthenticated ? 'Complete a lesson quiz to see your results here.' : 'Sign in to take lesson quizzes and test your knowledge.')}
          </p>
        </div>
        {latestQuizData ? (
          <Link to={`/quiz/${latestQuizData.id}`}>Review result <span>→</span></Link>
        ) : isAuthenticated ? (
          <Link to="/courses">Explore courses <span>→</span></Link>
        ) : (
          <Link to="/login">Sign in to practice <span>→</span></Link>
        )}
      </Card>

      <div className="section-heading">
        <div><p className="eyebrow">CURATED FOR YOU</p><h2>Pick up a new skill</h2></div>
        <Link to="/courses">Browse all courses <span>→</span></Link>
      </div>

      <section className="course-grid">
        {courseList.slice(0, 3).map((course) => (
          <CourseCard key={course.id || course._id} course={course} />
        ))}
      </section>
    </PageContainer>
  )
}
