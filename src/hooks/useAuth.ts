import { useState, useCallback } from 'react';

export type UserRole = 'end-user' | 'coach' | 'admin' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: UserRole) => void;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('refocus_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, password: string, role: UserRole) => {
    // Mock login
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
    };
    setUser(mockUser);
    localStorage.setItem('refocus_user', JSON.stringify(mockUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('refocus_user');
  }, []);

  const signup = useCallback((name: string, email: string, password: string, role: UserRole) => {
    // Mock signup
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };
    setUser(mockUser);
    localStorage.setItem('refocus_user', JSON.stringify(mockUser));
  }, []);

  return {
    user,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
  };
};
