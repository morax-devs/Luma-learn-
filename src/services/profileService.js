import { storage } from '../utils/storage'
import { profileApi } from './api/profileApi'
import { authService } from './authService'
import { isApiMode } from './serviceConfig'

const PROFILE_KEY = 'luma-profile'
export const PROFILE_EVENT = 'luma-profile-updated'

export const profileService = {
  async getProfile() {
    if (!authService.isAuthenticated()) {
      return {
        name: '',
        role: 'Guest',
        email: '',
        learningGoal: 'Explore courses and start learning.',
        bio: '',
        streak: 0,
        weeklyGoal: 0,
      }
    }
    if (isApiMode) return profileApi.getProfile()
    const currentUser = authService.getCurrentUser()
    const stored = storage.get(PROFILE_KEY, {})
    return {
      name: currentUser?.name || stored.name || 'Learner',
      role: currentUser?.role || stored.role || 'Learner',
      email: currentUser?.email || stored.email || '',
      learningGoal: stored.learningGoal || currentUser?.learningGoal || 'Set a learning goal to track your progress.',
      bio: stored.bio || currentUser?.bio || 'Add a short bio to introduce yourself.',
      streak: stored.streak || 0,
      weeklyGoal: stored.weeklyGoal || 0,
      ...stored,
    }
  },
  saveProfile(profile) {
    if (isApiMode && authService.isAuthenticated()) return profileApi.updateProfile(profile)
    storage.set(PROFILE_KEY, profile)
    window.dispatchEvent(new CustomEvent(PROFILE_EVENT))
    return profile
  },
}
