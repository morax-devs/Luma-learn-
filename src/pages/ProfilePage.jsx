import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Card, ErrorState, LoadingState, PageContainer } from '../components/ui'
import { useAsyncData } from '../hooks/useAsyncData'
import { useLearningStats } from '../hooks/useLearningStats'
import { profileService } from '../services/profileService'
import { courseService } from '../services/courseService'
import { quizService } from '../services/quizService'
import { authService } from '../services/authService'

export function ProfilePage() {
  const navigate = useNavigate()
  const { data, loading, error, retry } = useAsyncData(() => Promise.all([profileService.getProfile(), courseService.getCourses(), quizService.getQuizzes().catch(() => [])]), [])
  const stats = useLearningStats(data?.[1] || [])
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [savedProfile, setSavedProfile] = useState(null)
  if (loading) return <PageContainer><LoadingState /></PageContainer>
  if (error) return <PageContainer><ErrorState onRetry={retry} /></PageContainer>
  const [profile, courses, quizzes] = data
  const displayProfile = savedProfile || profile
  const profileDraft = draft || displayProfile
  const saveProfile = () => { profileService.saveProfile(profileDraft); setSavedProfile(profileDraft); setDraft(profileDraft); setIsEditing(false) }

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login')
  }

  const initials = displayProfile.name && displayProfile.name !== 'Learner'
    ? displayProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return <PageContainer className="profile-page"><div className="profile-heading"><div className="profile-avatar">{initials}</div><div><p className="eyebrow coral">YOUR PROFILE</p>{isEditing ? <div className="profile-edit-fields"><input value={profileDraft.name} onChange={(event) => setDraft({ ...profileDraft, name: event.target.value })} aria-label="Name" /><input value={profileDraft.learningGoal} onChange={(event) => setDraft({ ...profileDraft, learningGoal: event.target.value })} aria-label="Learning goal" /><textarea value={profileDraft.bio} onChange={(event) => setDraft({ ...profileDraft, bio: event.target.value })} aria-label="Short bio" /></div> : <><h1>{displayProfile.name}</h1><p className="page-lede">{displayProfile.role} · {displayProfile.learningGoal}</p><p className="profile-bio">{displayProfile.bio}</p></>}</div><div className="profile-actions">{isEditing ? <><button className="button button-secondary" onClick={() => { setDraft(displayProfile); setIsEditing(false) }}>Cancel</button><button className="button button-primary" onClick={saveProfile}>Save changes</button></> : <><button className="button button-secondary" onClick={() => { setDraft(displayProfile); setIsEditing(true) }}>Edit profile</button><button className="button button-secondary" onClick={handleLogout}>Sign out</button></>}</div></div><section className="profile-stats"><Card><strong>{stats.coursesCompleted}</strong><span>Courses completed</span></Card><Card><strong>{stats.lessonsCompleted}</strong><span>Lessons completed</span></Card><Card><strong>{stats.quizzesCompleted}</strong><span>Quizzes completed</span></Card><Card><strong>{stats.averageQuizScore}%</strong><span>Average quiz score</span></Card></section><div className="profile-layout"><Card className="profile-activity"><div className="section-heading"><div><p className="eyebrow">ASSESSMENT HISTORY</p><h2>Your quiz results</h2></div></div>{stats.history.length ? stats.history.map((result) => { const quiz = quizzes.find((item) => item.id === result.quizId); const course = courses.find((item) => item.id === result.courseId); return <Link className="quiz-history-item" to={`/quiz/${result.quizId}`} key={`${result.quizId}-${result.submittedAt}`}><span className={`history-status ${result.passed ? 'passed' : 'failed'}`}>{result.passed ? '✓' : '!'}</span><span><strong>{quiz?.title || 'Quiz result'}</strong><small>{course?.title || 'Course'} · {new Date(result.submittedAt).toLocaleDateString()}</small></span><b>{result.percentage}%</b></Link>}) : <p className="recent-empty">Your submitted quiz results will appear here.</p>}</Card><Card className="profile-note"><p className="eyebrow">LEARNING PHILOSOPHY</p><h3>Keep the loop short.</h3><p>Learn something, try it in the world, and come back with a better question. Your progress is a record of that practice.</p><Link to="/courses">Explore more courses <span>→</span></Link></Card></div></PageContainer>
}
