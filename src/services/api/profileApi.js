import { httpClient } from './httpClient'

export const profileApi = {
  getProfile: async () => (await httpClient.get('/profile')).profile,
  updateProfile: async (profile) => (await httpClient.patch('/profile', profile)).profile,
}
