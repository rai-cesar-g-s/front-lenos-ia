import { logSafeError } from '../utils/safeLogger';
import api from './api';
import { API_BASE_URL } from './config';

/**
 * Serviços relacionados às requisições do Usuário (Autenticação e Perfil).
 * Mapeados de acordo com a documentação OpenAPI de https://api.lenos-ia.com.br/docs#/
 */

type UserRegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  terms_accepted: boolean;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type UpdateUserData = {
  name?: string;
  email?: string;
  phone?: string;
};

type UpdatePasswordData = {
  current_password: string;
  new_password: string;
};

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  token: string;
  password: string;
};

export const UserService = {
  /**
   * Solicita o e-mail de recuperação de senha.
   * Endpoint OpenAPI: POST /v1/user/forgot-password
   */
  async requestPasswordReset(data: ForgotPasswordData) {
    const response = await api.post('/v1/user/forgot-password', data);
    return response.data;
  },

  /**
   * Redefine a senha com o token recebido por e-mail.
   * Endpoint OpenAPI: POST /v1/user/reset-password?token=...
   */
  async resetPassword(data: ResetPasswordData) {
    const response = await api.post(`/v1/user/reset-password?token=${encodeURIComponent(data.token)}`, {
      new_password: data.password,
    });
    return response.data;
  },

  /**
   * Registra um novo usuário.
   * Endpoint OpenAPI: POST /v1/user/register
   */
  async registerUser(userData: UserRegisterData) {
    try {
      const response = await api.post('/v1/user/register', userData, { timeout: 60000 });
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao registrar usuário", error);
      throw error;
    }
  },

  /**
   * Realiza login do usuário com e-mail e senha.
   * Endpoint OpenAPI: POST /v1/user/login
   */
  async loginUser(credentials: LoginCredentials) {
    try {
      const response = await api.post('/v1/user/login', credentials);
      localStorage.setItem('isAuthenticated', 'true');
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao realizar login", error);
      throw error;
    }
  },

  /**
   * Realiza o logout do usuário.
   * Endpoint OpenAPI: POST /v1/user/logout
   */
  async logoutUser() {
    try {
      const response = await api.post('/v1/user/logout');
      localStorage.removeItem('isAuthenticated');
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao realizar logout", error);
      throw error;
    } finally {
      localStorage.removeItem('isAuthenticated');
    }
  },

  /**
   * Renova o token de sessão do usuário.
   * Endpoint OpenAPI: POST /v1/user/refresh
   */
  async refreshToken() {
    try {
      const response = await api.post('/v1/user/refresh');
      localStorage.setItem('isAuthenticated', 'true');
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao atualizar token", error);
      throw error;
    }
  },

  /**
   * Recupera o perfil do usuário logado.
   * Endpoint OpenAPI: GET /v1/user/me
   */
  async getUserProfile() {
    try {
      const response = await api.get('/v1/user/me');
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao buscar perfil do usuário", error);
      throw error;
    }
  },

  /**
   * Atualiza dados cadastrais do perfil (nome, email, telefone).
   * Endpoint OpenAPI: PUT /v1/user
   */
  async updateUser(data: UpdateUserData) {
    try {
      const response = await api.put('/v1/user', data);
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao atualizar dados", error);
      throw error;
    }
  },

  /**
   * Atualiza a senha do usuário.
   * Endpoint OpenAPI: PUT /v1/user/password
   */
  async updatePassword(data: UpdatePasswordData) {
    try {
      const response = await api.put('/v1/user/password', data);
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao atualizar senha", error);
      throw error;
    }
  },

  /**
   * Exclui a conta do usuário.
   * Endpoint OpenAPI: DELETE /v1/user
   */
  async deleteUserAccount() {
    try {
      const response = await api.delete('/v1/user');
      localStorage.removeItem('isAuthenticated');
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao excluir conta", error);
      throw error;
    }
  },

  /**
   * Verifica e-mail via token.
   * Endpoint OpenAPI: POST /v1/user/verify-email?token=...
   */
  async verify_email(token: string) {
    try {
      const response = await api.post(`/v1/user/verify-email?token=${encodeURIComponent(token)}`);
      return response.data;
    } catch (error) {
      logSafeError("UserService: Falha ao verificar email", error);
      throw error;
    }
  },

  /**
   * Retorna a URL para redirecionamento do OAuth2 (Google / YouTube).
   * Endpoint OpenAPI: GET /v1/oauth2/login
   */
  getOAuth2LoginUrl() {
    return `${API_BASE_URL}/v1/oauth2/login`;
  }
};
