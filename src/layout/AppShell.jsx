import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { authService, AUTH_EVENT } from '../services/authService'

const navItems = [
  { id: 'nav-overview', label: 'Overview', to: '/dashboard', icon: '⌂' },
  { id: 'nav-explore', label: 'Explore courses', to: '/courses', icon: '◈' },
  { id: 'nav-learning', label: 'My learning', to: '/courses', icon: '▣' },
]

export function AppShell({ children }) {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser())
  const isAuthenticated = Boolean(currentUser)

  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(authService.getCurrentUser())
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener(AUTH_EVENT, handleAuthChange)
    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener(AUTH_EVENT, handleAuthChange)
    }
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login')
  }

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/"><span className="brand-mark">L</span><span>Luma<span className="brand-muted">/learn</span></span></Link>
        <div className="sidebar-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => <NavLink key={item.id} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to={item.to}><span>{item.icon}</span>{item.label}</NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-label">Your account</div>
          {isAuthenticated ? (
            <>
              <NavLink className="nav-link" to="/profile"><span>◎</span>Profile</NavLink>
              <NavLink className="nav-link" to="/settings"><span>⚙</span>Settings</NavLink>
              <button className="nav-link nav-logout-btn" onClick={handleLogout} type="button"><span>↪</span>Sign out</button>
            </>
          ) : (
            <>
              <NavLink className="nav-link" to="/login"><span>→</span>Sign in</NavLink>
              <NavLink className="nav-link" to="/register"><span>+</span>Register</NavLink>
            </>
          )}
          <Link className="help-link" to="/courses"><span>?</span>Need a hand?</Link>
        </div>
      </aside>
      <div className="shell-content">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">L</span> Luma</div>
          <div className="topbar-search">⌕ <span>Search courses, topics, or skills</span><kbd>⌘ K</kbd></div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications">♢</button>
            {isAuthenticated ? (
              <Link className="avatar" to="/profile" aria-label="Open profile" title={currentUser?.name}>{initials}</Link>
            ) : (
              <Link className="button button-secondary auth-topbar-btn" to="/login">Sign in</Link>
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
