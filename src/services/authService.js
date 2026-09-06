import { storage } from '../utils/storage'
import { authApi } from './api/authApi'

const AUTH_KEY = 'luma-auth-session'
export const AUTH_EVENT = 'luma-auth-updated'

export const authService = {
  getSession() {
    return storage.get(AUTH_KEY, null)
  },
  getToken() {
    return this.getSession()?.token || null
  },
  getCurrentUser() {
    return this.getSession()?.user || null
  },
  isAuthenticated() {
    return Boolean(this.getToken())
  },
  async login(credentials) {
    const result = await authApi.login(credentials)
    if (!result?.token || !result?.user) {
      throw new Error('Invalid response from authentication server.')
    }
    const session = { token: result.token, user: result.user }
    storage.set(AUTH_KEY, session)
    window.dispatchEvent(new CustomEvent(AUTH_EVENT))
    return result
  },
  async register(userData) {
    const result = await authApi.register(userData)
    if (!result?.token || !result?.user) {
      throw new Error('Invalid response from registration server.')
    }
    const session = { token: result.token, user: result.user }
    storage.set(AUTH_KEY, session)
    window.dispatchEvent(new CustomEvent(AUTH_EVENT))
    return result
  },
  async logout() {
    try {
      await authApi.logout()
    } catch {
      /* Ignore network errors during logout cleanup */
    } finally {
      storage.remove(AUTH_KEY)
      window.dispatchEvent(new CustomEvent(AUTH_EVENT))
    }
  },
  async changePassword(currentPassword, newPassword) {
    return authApi.changePassword({ currentPassword, newPassword })
  },
  async changeEmail(newEmail, currentPassword) {
    const result = await authApi.changeEmail({ newEmail, currentPassword })
    if (result?.user) {
      const session = this.getSession()
      if (session) {
        storage.set(AUTH_KEY, { ...session, user: result.user })
        window.dispatchEvent(new CustomEvent(AUTH_EVENT))
      }
    }
    return result
  },
  async deleteAccount(password) {
    try {
      await authApi.deleteAccount({ password })
    } finally {
      storage.remove(AUTH_KEY)
      window.dispatchEvent(new CustomEvent(AUTH_EVENT))
    }
  },
}
