import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './config';

// Módulo de configuração central da api utilizando axios.

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-type': 'application/json',
    },
    withCredentials: true
});

let refreshRequest: Promise<unknown> | null = null;

// Renova a sessão uma vez e repete a requisição que falhou, sem ciclos de renovação.

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const request = error.config as (InternalAxiosRequestConfig & { sessionRetried?: boolean }) | undefined;
        const isAuthRequest = /\/user\/(login|refresh|logout|register|forgot-password|reset-password|password)(?:\?|$)/.test(request?.url || '');
        if (error.response?.status === 401 && request && !isAuthRequest && !request.sessionRetried) {
            request.sessionRetried = true;
            try {
                if (!refreshRequest) {
                    refreshRequest = api.post('/v1/user/refresh').finally(() => { refreshRequest = null; });
                }
                await refreshRequest;
                return api.request(request);
            } catch {
                // A falha definitiva é tratada abaixo pelo contexto de autenticação.
            }
        }
        // Se a segurança do back-end chutar o usuário (Token inválido, expirado ou sem cookie)
        // Mas se a requisição atual não for a tentativa inicial de login! (para podermos mostrar o erro "senha inválida" na tela)
        if (
            error.response &&
            error.response.status === 401 &&
            error.config &&
            !isAuthRequest
        ) {
            localStorage.removeItem('isAuthenticated'); // Limpa a UI
            // Emite um evento silencioso para o AuthContext lidar, em vez de dar refreseh hostil na página
            window.dispatchEvent(new Event('auth-error'));
        }
        return Promise.reject(error);
    }
);

export default api;
