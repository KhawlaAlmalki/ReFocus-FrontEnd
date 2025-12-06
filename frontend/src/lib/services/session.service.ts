import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../../config/api';

// Types for session operations
export interface Session {
  id: string;
  date: string;
  startTime?: string;
  duration: number;
  category: string;
  status: 'completed' | 'interrupted';
  createdAt?: string;
}

export interface CreateSessionData {
  duration: number;
  category: string;
}

export interface SessionsResponse {
  success: boolean;
  sessions: Session[];
}

export interface CreateSessionResponse {
  success: boolean;
  message: string;
  session: Session;
}

// Session service
export const sessionService = {
  /**
   * Get all sessions for current user
   */
  async getSessions(): Promise<SessionsResponse> {
    return apiClient.get<SessionsResponse>(API_ENDPOINTS.sessions.base);
  },

  /**
   * Create a new session
   */
  async createSession(data: CreateSessionData): Promise<CreateSessionResponse> {
    return apiClient.post<CreateSessionResponse>(API_ENDPOINTS.sessions.base, data);
  },

  /**
   * Get a single session by ID
   */
  async getSession(id: string): Promise<Session> {
    return apiClient.get<Session>(API_ENDPOINTS.sessions.single(id));
  },
};
