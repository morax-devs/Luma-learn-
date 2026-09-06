import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, PageContainer } from '../components/ui'
import { authService, AUTH_EVENT } from '../services/authService'

export function SettingsPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser())

  // Listen to auth changes (e.g. email update)
  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(authService.getCurrentUser())
    window.addEventListener(AUTH_EVENT, handleAuthChange)
    return () => window.removeEventListener(AUTH_EVENT, handleAuthChange)
  }, [])

  // Section 1: Change Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Section 2: Change Email State
  const [newEmail, setNewEmail] = useState('')
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')

  // Section 3: Delete Account State
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.')
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password cannot be the same as your current password.')
      return
    }

    try {
      setPasswordLoading(true)
      const res = await authService.changePassword(currentPassword, newPassword)
      setPasswordSuccess(res.message || 'Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')
    setEmailSuccess('')

    if (!newEmail || !emailCurrentPassword) {
      setEmailError('Please provide both your new email and current password.')
      return
    }

    const trimmedEmail = newEmail.trim().toLowerCase()
    if (trimmedEmail === currentUser?.email?.toLowerCase()) {
      setEmailError('New email cannot be the same as your current email.')
      return
    }

    try {
      setEmailLoading(true)
      const res = await authService.changeEmail(trimmedEmail, emailCurrentPassword)
      setEmailSuccess(res.message || 'Email address updated successfully.')
      setNewEmail('')
      setEmailCurrentPassword('')
    } catch (err) {
      setEmailError(err.message || 'Failed to update email address.')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    setDeleteError('')

    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm account deletion.')
      return
    }

    if (deleteConfirmation.trim() !== 'DELETE') {
      setDeleteError('Please type "DELETE" exactly to confirm.')
      return
    }

    try {
      setDeleteLoading(true)
      await authService.deleteAccount(deletePassword)
      navigate('/login')
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account. Please verify your password.')
      setDeleteLoading(false)
    }
  }

  const isDeleteButtonEnabled = deletePassword.trim().length > 0 && deleteConfirmation.trim() === 'DELETE'

  return (
    <PageContainer className="settings-page">
      <div className="settings-header">
        <p className="eyebrow coral">ACCOUNT PREFERENCES</p>
        <h1>Settings</h1>
        <p className="page-lede">Manage your credentials, email address, and account preferences.</p>
      </div>

      <div className="settings-grid">
        {/* Section 1: Change Password */}
        <Card className="settings-card">
          <div className="settings-card-header">
            <div>
              <h2>Password & Security</h2>
              <p>Update your password to keep your account secure. Passwords must be at least 6 characters.</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="settings-alert settings-alert-success">
              <span className="alert-icon">✓</span>
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="settings-alert settings-alert-error">
              <span className="alert-icon">!</span>
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                disabled={passwordLoading}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                disabled={passwordLoading}
                placeholder="Enter new password (min. 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={passwordLoading}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="settings-form-actions">
              <button
                type="submit"
                className="button button-primary"
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Updating password...' : 'Update password'}
              </button>
            </div>
          </form>
        </Card>

        {/* Section 2: Change Email */}
        <Card className="settings-card">
          <div className="settings-card-header">
            <div>
              <h2>Email Address</h2>
              <p>Change the email address associated with your account. You will need your current password to confirm.</p>
            </div>
          </div>

          <div className="settings-current-info">
            <span className="info-label">Current email:</span>
            <strong className="info-value">{currentUser?.email || 'Not available'}</strong>
          </div>

          {emailSuccess && (
            <div className="settings-alert settings-alert-success">
              <span className="alert-icon">✓</span>
              <span>{emailSuccess}</span>
            </div>
          )}

          {emailError && (
            <div className="settings-alert settings-alert-error">
              <span className="alert-icon">!</span>
              <span>{emailError}</span>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="new-email">New email address</label>
              <input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="email"
                disabled={emailLoading}
                placeholder="e.g. name@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email-current-password">Current password</label>
              <input
                id="email-current-password"
                type="password"
                value={emailCurrentPassword}
                onChange={(e) => setEmailCurrentPassword(e.target.value)}
                autoComplete="current-password"
                disabled={emailLoading}
                placeholder="Enter password to confirm"
                required
              />
            </div>

            <div className="settings-form-actions">
              <button
                type="submit"
                className="button button-primary"
                disabled={emailLoading}
              >
                {emailLoading ? 'Updating email...' : 'Update email'}
              </button>
            </div>
          </form>
        </Card>

        {/* Section 3: Danger Zone */}
        <Card className="settings-card danger-card">
          <div className="settings-card-header">
            <div>
              <div className="danger-badge">DANGER ZONE</div>
              <h2>Delete Account</h2>
              <p className="danger-text">
                Permanently delete your account and all associated learning history. This action cannot be undone.
              </p>
            </div>
          </div>

          {deleteError && (
            <div className="settings-alert settings-alert-error">
              <span className="alert-icon">!</span>
              <span>{deleteError}</span>
            </div>
          )}

          <form onSubmit={handleDeleteAccount} className="settings-form">
            <div className="form-group">
              <label htmlFor="delete-password">Confirm your password</label>
              <input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                autoComplete="current-password"
                disabled={deleteLoading}
                placeholder="Enter your current password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="delete-confirmation">
                Type <strong>DELETE</strong> to confirm
              </label>
              <input
                id="delete-confirmation"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                disabled={deleteLoading}
                placeholder='Type "DELETE"'
                required
              />
            </div>

            <div className="settings-form-actions">
              <button
                type="submit"
                className="button button-danger"
                disabled={!isDeleteButtonEnabled || deleteLoading}
              >
                {deleteLoading ? 'Deleting account...' : 'Permanently delete account'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  )
}
