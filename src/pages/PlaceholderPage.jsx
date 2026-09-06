import { Button, Card, EmptyState, PageContainer } from '../components/ui'

const pageContent = {
  login: ['Welcome back', 'Pick up your learning journey where you left off.', 'Sign in is coming next'],
  register: ['Make space to learn', 'Create a focused learning routine that grows with you.', 'Registration is coming next'],
  dashboard: ['Your learning overview', 'A focused view of your progress, goals, and next best lesson.', 'Dashboard modules are coming next'],
  courses: ['Explore the catalogue', 'Find thoughtful courses built for the skills you want to practice.', 'Course browsing is coming next'],
  course: ['Course details', 'A clear course overview, curriculum, and instructor story will live here.', 'Course details are coming next'],
  learn: ['Your learning space', 'Structured lessons, notes, and progress tracking will live here.', 'The lesson player is coming next'],
  quiz: ['Knowledge check', 'Test your understanding and turn practice into progress.', 'Quiz flow is coming next'],
  profile: ['Your profile', 'Manage your learning identity, goals, and preferences.', 'Profile settings are coming next'],
}

export function PlaceholderPage({ type }) {
  const [title, description, status] = pageContent[type] || pageContent.dashboard
  return <PageContainer className="placeholder-page"><div className="placeholder-heading"><p className="eyebrow coral">FOUNDATION VIEW</p><h1>{title}</h1><p className="page-lede">{description}</p></div><Card className="placeholder-card"><div className="placeholder-icon">✦</div><EmptyState title={status} description="This route is connected and ready for the next product slice." /><Button to="/" variant="secondary">Return to overview</Button></Card></PageContainer>
}
