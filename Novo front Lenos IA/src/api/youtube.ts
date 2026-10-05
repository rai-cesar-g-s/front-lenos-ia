import api from './api';

export type YouTubeConnection = 'connected' | 'unconfirmed';
let connectionRequest: Promise<YouTubeConnection> | null = null;

export const YouTubeService = {
  checkConnection(): Promise<YouTubeConnection> {
    if (!connectionRequest) {
      connectionRequest = this.requestConnection().finally(() => { connectionRequest = null; });
    }
    return connectionRequest;
  },
  async requestConnection(): Promise<YouTubeConnection> {
    try {
      // Não siga o 307 para o Google durante a verificação do card.
      await api.get('/v1/oauth2/login', { adapter: 'fetch', fetchOptions: { redirect: 'manual' } });
      return 'unconfirmed';
    } catch (error: unknown) {
      const response = (error as { response?: { status?: number; data?: { message?: string; detail?: string } } }).response;
      const message = response?.data?.message || response?.data?.detail || '';
      if (response?.status === 400 && /(?:youtube|google).*já (?:está )?conectad/i.test(message)) return 'connected';
      // Redirecionamentos entre origens são opacos no navegador e não confirmam conexão.
      if (!response || response.status === 0) return 'unconfirmed';
      throw error;
    }
  },
};
