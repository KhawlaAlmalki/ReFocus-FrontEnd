// API Configuration
// In production (Netlify), VITE_API_URL should be set to: https://refocus-n0hq.onrender.com/api
// In development, it falls back to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  // User endpoints
  users: {
    base: '/users',
    profile: (id: string) => `/users/${id}`,
  },
  // Goal endpoints
  goals: {
    base: '/goals',
    single: (id: string) => `/goals/${id}`,
  },
  // Session endpoints
  sessions: {
    base: '/sessions',
    single: (id: string) => `/sessions/${id}`,
  },
  // Survey endpoints
  surveys: {
    base: '/survey',
    single: (id: string) => `/survey/${id}`,
  },
  // Coach endpoints
  coach: {
    base: '/coach',
    profile: (id: string) => `/coach/${id}`,
  },
  // Admin endpoints
  admin: {
    base: '/admin',
    users: '/admin/users',
  },
} as const;
