import api from './api';
export type YouTubeConnection = { connected: boolean; expired: boolean; expires_at: string | null };
let connectionRequest: Promise<YouTubeConnection> | null = null;
export const YouTubeService = {
  checkConnection(): Promise<YouTubeConnection> {
    if (!connectionRequest) connectionRequest = api.get<YouTubeConnection>('/v1/oauth2/status').then(response => response.data).finally(() => { connectionRequest = null; });
    return connectionRequest;
  },
};
