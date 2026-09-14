import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'

export function InstructorRoute({ children }) {
  const location = useLocation()
  if (!authService.isAuthenticated()) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />
  }

  const user = authService.getCurrentUser()
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin'
  if (!isInstructor) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
