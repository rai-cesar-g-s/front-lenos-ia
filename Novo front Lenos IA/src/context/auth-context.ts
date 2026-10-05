import { createContext } from 'react';

type UserProfile = {
  name?: string;
  [key: string]: unknown;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  hasAnsweredQuestions: boolean;
  user: UserProfile;
  login: (credentials: LoginCredentials) => Promise<unknown>;
  logout: () => Promise<void>;
  setHasAnsweredQuestions: (value: boolean) => void;
  reloadUserProfile: () => Promise<void>;
  reloadQuestionStatus: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
