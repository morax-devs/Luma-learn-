import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'

export function ProtectedRoute({ children }) {
  const location = useLocation()
  return authService.isAuthenticated() ? children : <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />
}
