import { createContext, useContext, ReactNode } from 'react';
import { useAuth, User, UserRole } from '@/hooks/useAuth';

export interface SurveyAnswers {
  mainGoal: string;
  desiredHoursPerDay: string;
  currentHoursPerDay: number;
  distractions: string[];
  loseFocusWhen: string;
  productivityStyle: string;
  upcomingEvents: boolean;
  motivationStyle: string;
  statsVisibility: string;
  consistency: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: UserRole) => void;
  isAuthenticated: boolean;
  surveyAnswers: SurveyAnswers | null;
  setSurveyAnswers: (answers: SurveyAnswers) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
