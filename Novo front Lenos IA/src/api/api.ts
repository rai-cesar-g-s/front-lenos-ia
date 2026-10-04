import axios from 'axios';

// Módulo de configuração central da api utilizando axios.

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL){
        return import.meta.env.VITE_API_URL;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname == "127.0.0.1") {
        return ''; // URL relativa ativa o Proxy do Vite em ambiente local
    }
    return 'https://api.lenos-ia.com.br';
}

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
        'Content-type': 'application/json',
    },
    withCredentials: true
});

// Interceptor Global para respostas de autenticação (trata o retorno 401 do backend)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se a segurança do back-end chutar o usuário (Token inválido, expirado ou sem cookie)
        // Mas se a requisição atual não for a tentativa inicial de login! (para podermos mostrar o erro "senha inválida" na tela)
        if (
            error.response &&
            error.response.status === 401 &&
            error.config &&
            !error.config.url.includes('/login')
        ) {
            localStorage.removeItem('isAuthenticated'); // Limpa a UI
            // Emite um evento silencioso para o AuthContext lidar, em vez de dar refreseh hostil na página
            window.dispatchEvent(new Event('auth-error'));
        }
        return Promise.reject(error);
    }
);

export default api;