import { useState, useCallback, useEffect } from 'react';
import { authService } from '@/lib/services';
import { tokenManager } from '@/lib/api-client';
import { toAppError } from '@/lib/errors';

export type UserRole = 'user' | 'coach' | 'admin' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('refocus_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (tokenManager.get() && !user) {
        try {
          const response = await authService.getCurrentUser();
          // Safe property access with optional chaining
          if (response?.user) {
            const mappedUser: User = {
              id: response.user.id || '',
              name: response.user.name || '',
              email: response.user.email || '',
              role: (response.user.role as UserRole) || 'user',
            };
            setUser(mappedUser);
            localStorage.setItem('refocus_user', JSON.stringify(mappedUser));
          }
        } catch (error) {
          // Convert to AppError for consistent handling
          const appError = toAppError(error);
          console.error('Failed to load user:', appError);
          tokenManager.remove();
          localStorage.removeItem('refocus_user');
        }
      }
    };
    loadUser();
  }, [user]);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    try {
      const response = await authService.login({ email, password });

      // Safe token handling
      if (response?.token) {
        tokenManager.set(response.token);
      }

      // Safe user data extraction with optional chaining
      if (response?.user) {
        const mappedUser: User = {
          id: response.user.id || '',
          name: response.user.name || '',
          email: response.user.email || '',
          role: (response.user.role as UserRole) || role,
        };
        setUser(mappedUser);
        localStorage.setItem('refocus_user', JSON.stringify(mappedUser));
      } else {
        throw new Error('Invalid login response: missing user data');
      }
    } catch (error) {
      // Convert to AppError before re-throwing
      throw toAppError(error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      const appError = toAppError(error);
      console.error('Logout error:', appError);
      // Don't throw - logout should always succeed locally
    } finally {
      setUser(null);
      localStorage.removeItem('refocus_user');
      tokenManager.remove();
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
      });

      // Safe token handling
      if (response?.token) {
        tokenManager.set(response.token);
      }

      // Safe user data extraction
      if (response?.user) {
        const mappedUser: User = {
          id: response.user.id || '',
          name: response.user.name || name,
          email: response.user.email || email,
          role: (response.user.role as UserRole) || role,
        };
        setUser(mappedUser);
        localStorage.setItem('refocus_user', JSON.stringify(mappedUser));
      } else {
        throw new Error('Invalid signup response: missing user data');
      }
    } catch (error) {
      // Convert to AppError before re-throwing
      throw toAppError(error);
    }
  }, []);

  return {
    user,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
  };
};
