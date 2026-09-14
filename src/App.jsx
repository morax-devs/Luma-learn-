import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { InstructorRoute } from './components/InstructorRoute'
import { CourseDetailsPage } from './pages/CourseDetailsPage'
import { CoursesPage } from './pages/CoursesPage'
import { HomePage } from './pages/HomePage'
import { LearningPage } from './pages/LearningPage'
import { QuizPage } from './pages/QuizPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { InstructorDashboardPage } from './pages/InstructorDashboardPage'
import { CourseEditorPage } from './pages/CourseEditorPage'
import './styles/index.css'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="/learn/:courseId" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/instructor" element={<InstructorRoute><InstructorDashboardPage /></InstructorRoute>} />
          <Route path="/instructor/courses/new" element={<InstructorRoute><CourseEditorPage /></InstructorRoute>} />
          <Route path="/instructor/courses/:courseId/edit" element={<InstructorRoute><CourseEditorPage /></InstructorRoute>} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
