import { UserPreferences, DEFAULT_TOPICS } from '../types';

const STORAGE_KEY = 'tech_digest_user_prefs';

export const getUserPreferences = (): UserPreferences => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse user preferences", e);
    }
  }
  return {
    name: 'Guest',
    topics: DEFAULT_TOPICS
  };
};

export const saveUserPreferences = (prefs: UserPreferences): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};