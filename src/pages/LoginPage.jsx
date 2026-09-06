import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, PageContainer } from '../components/ui'
import { authService } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = new URLSearchParams(location.search).get('returnTo') || '/'

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in both email and password.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      })
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="auth-page-container">
      <div className="auth-card-wrap">
        <div className="auth-header">
          <p className="eyebrow coral">WELCOME BACK</p>
          <h1>Sign in to Luma Learn</h1>
          <p className="page-lede">Pick up your learning journey right where you left off.</p>
        </div>

        <Card className="auth-card">
          {error && (
            <div className="auth-error-banner" role="alert">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <Button type="submit" variant="primary" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in to account'} <span>→</span>
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don&apos;t have an account yet? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
