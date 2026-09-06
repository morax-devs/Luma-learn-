import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, PageContainer } from '../components/ui'
import { authService } from '../services/authService'

export function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all fields (name, email, and password).')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="auth-page-container">
      <div className="auth-card-wrap">
        <div className="auth-header">
          <p className="eyebrow coral">START YOUR JOURNEY</p>
          <h1>Create your account</h1>
          <p className="page-lede">Join Luma Learn and build a focused learning habit that grows with you.</p>
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
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Arjun Mehta"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

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
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <Button type="submit" variant="primary" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'} <span>→</span>
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Sign in instead</Link>
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
