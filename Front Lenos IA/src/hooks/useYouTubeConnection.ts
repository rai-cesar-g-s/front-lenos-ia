import { useEffect, useState } from 'react';
import { YouTubeService, type YouTubeConnection } from '../api/youtube';
import { useAuth } from './useAuth';

export const useYouTubeConnection = () => {
  const { user } = useAuth();
  const [retryKey, setRetryKey] = useState(0);
  const [connection, setConnection] = useState<YouTubeConnection | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
    setChecking(true);
    setConnection(null);
    setError('');
    void YouTubeService.checkConnection().then((status) => {
      if (active) setConnection(status);
    }).catch(() => {
      if (active) setError('Não foi possível verificar a conexão Google.');
    }).finally(() => {
      if (active) setChecking(false);
    });
    }, 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [user.id, retryKey]);
  return { connected: connection?.connected === true && !connection.expired, expired: connection?.expired === true, checking, error, expiresAt: connection?.expires_at ?? null, retry: () => setRetryKey(current => current + 1) };
};
