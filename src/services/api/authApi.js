import { httpClient } from './httpClient'

export const authApi = {
  getCurrentUser: () => httpClient.get('/auth/me'),
  login: (credentials) => httpClient.post('/auth/login', credentials),
  register: (userData) => httpClient.post('/auth/register', userData),
  logout: () => httpClient.post('/auth/logout'),
  changePassword: (data) => httpClient.post('/auth/change-password', data),
  changeEmail: (data) => httpClient.post('/auth/change-email', data),
  deleteAccount: (data) => httpClient.delete('/auth/account', { body: data }),
}
