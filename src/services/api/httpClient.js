const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'UNKNOWN_ERROR', details = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function getErrorCode(status) {
  if (status === 401) return 'UNAUTHORIZED'
  if (status === 404) return 'NOT_FOUND'
  if (status >= 400 && status < 500) return 'VALIDATION_ERROR'
  if (status >= 500) return 'SERVER_ERROR'
  return 'UNKNOWN_ERROR'
}

const AUTH_KEY = 'luma-auth-session'
const AUTH_EVENT = 'luma-auth-updated'

function clearStoredSession() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_KEY)
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AUTH_EVENT))
    }
  } catch {
    /* Ignore storage errors during cleanup */
  }
}

function getStoredToken() {
  try {
    const sessionStr = typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_KEY) : null
    if (!sessionStr) return null
    const session = JSON.parse(sessionStr)
    return session?.token || null
  } catch {
    return null
  }
}

export async function request(path, { method = 'GET', body, token, signal } = {}) {
  if (!baseUrl) throw new ApiError('The API base URL is not configured.', { code: 'CONFIGURATION_ERROR' })
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const authToken = token || getStoredToken()
  if (authToken) headers.Authorization = `Bearer ${authToken}`
  let response
  try {
    response = await fetch(`${baseUrl}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal })
  } catch {
    throw new ApiError('The service is unavailable. Check your connection and try again.', { code: 'NETWORK_ERROR' })
  }
  let payload = null
  try { payload = await response.json() } catch { /* Empty response bodies are valid for some requests. */ }
  if (!response.ok) {
    if (response.status === 401 && headers.Authorization) {
      clearStoredSession()
    }
    throw new ApiError(payload?.message || 'The request could not be completed.', { status: response.status, code: getErrorCode(response.status), details: payload?.details })
  }
  return payload
}

export const httpClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
