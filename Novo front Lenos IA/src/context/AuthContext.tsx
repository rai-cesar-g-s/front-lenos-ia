import React, { useState, useEffect } from 'react';
import { UserService } from '../api/user';
import { QuestionService } from '../api/questions';
import { AuthContext } from './auth-context';

type UserProfile = {
  name?: string;
  [key: string]: unknown;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile>({ name: 'Carregando...' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAnsweredQuestions, setHasAnsweredQuestions] = useState(false);
  const reloadQuestionStatus = async () => {
    setHasAnsweredQuestions(false);
    const complete = (await QuestionService.getPendingQuestions()).length === 0;
    setHasAnsweredQuestions(complete);
    return complete;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthFlag = localStorage.getItem('isAuthenticated');

      if (isAuthFlag === 'true') {
        try {
          const profile = await UserService.getUserProfile();
          setUser(profile as UserProfile);

          try {
            await reloadQuestionStatus();
          } catch (err) {
            console.error('AuthContext: Falha ao carregar status da pesquisa:', err);
            setHasAnsweredQuestions(false);
          }

          setIsAuthenticated(true);
        } catch (error) {
          console.error('AuthContext: Falha ao revalidar sessão:', error);
          localStorage.removeItem('isAuthenticated');
          setIsAuthenticated(false);
          setUser({ name: '' });
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();

    const handleAuthError = () => {
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
      setUser({ name: '' });
      setHasAnsweredQuestions(false);
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await UserService.loginUser(credentials);

    try {
      const profile = await UserService.getUserProfile();
      setUser(profile as UserProfile);

      try {
        await reloadQuestionStatus();
      } catch (err) {
        console.error('AuthContext: Falha ao buscar status da pesquisa pós-login:', err);
        setHasAnsweredQuestions(false);
      }

      setIsAuthenticated(true);
    } catch (profileError) {
      console.warn('Falha ao recuperar perfil pós-login', profileError);
      window.dispatchEvent(new Event('auth-error'));
      throw new Error('COOKIE_REJECTED', { cause: profileError });
    }

    return data;
  };

  const logout = async () => {
    try {
      await UserService.logoutUser();
    } catch (err) {
      console.warn('API logout falhou ou já estava deslogado', err);
    } finally {
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
      setUser({ name: '' });
      setHasAnsweredQuestions(false);
      window.dispatchEvent(new Event('auth-error'));
    }
  };

  const reloadUserProfile = async () => {
    try {
      const profile = await UserService.getUserProfile();
      setUser(profile as UserProfile);
    } catch (err) {
      console.error('AuthContext: Falha ao recarregar perfil:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        hasAnsweredQuestions,
        setHasAnsweredQuestions,
        reloadQuestionStatus,
        reloadUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

