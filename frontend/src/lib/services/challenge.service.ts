import { apiClient } from '../api-client';

// Types for challenge operations
export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress?: number;
  total?: number;
  category: string;
  joined?: boolean;
  icon?: string;
  color?: string;
}

export interface ChallengesResponse {
  success: boolean;
  challenges: Challenge[];
}

export interface EnrollChallengeResponse {
  success: boolean;
  message: string;
  challenge: Challenge;
}

// Challenge service
export const challengeService = {
  /**
   * Get all challenges
   */
  async getChallenges(): Promise<ChallengesResponse> {
    return apiClient.get<ChallengesResponse>('/challenges');
  },

  /**
   * Enroll in a challenge
   */
  async enrollChallenge(id: string): Promise<EnrollChallengeResponse> {
    return apiClient.post<EnrollChallengeResponse>(`/challenges/enroll/${id}`);
  },

  /**
   * Get a single challenge
   */
  async getChallenge(id: string): Promise<Challenge> {
    return apiClient.get<Challenge>(`/challenges/${id}`);
  },
};
