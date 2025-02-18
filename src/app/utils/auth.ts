interface User {
  role: string;
  username: string;
  // Add other user properties as needed
}

// Create a custom event for auth state changes
const AUTH_STATE_CHANGED = 'authStateChanged';

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const login = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Dispatch auth state change event
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Dispatch auth state change event
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
};

export const subscribeToAuthChanges = (callback: () => void) => {
  window.addEventListener(AUTH_STATE_CHANGED, callback);
  return () => window.removeEventListener(AUTH_STATE_CHANGED, callback);
};
