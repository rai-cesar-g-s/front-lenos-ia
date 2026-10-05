import { useEffect, useState } from 'react';
import { YouTubeService, type YouTubeConnection } from '../api/youtube';
import { useAuth } from './useAuth';

export const useYouTubeConnection = () => {
  const { user } = useAuth();
  const [connection, setConnection] = useState<YouTubeConnection>('unconfirmed');
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let active = true;
    void YouTubeService.checkConnection().then((status) => {
      if (active) setConnection(status);
    }).catch(() => {
      // Sem confirmação da API, continue oferecendo a conexão.
    }).finally(() => {
      if (active) setChecking(false);
    });
    return () => { active = false; };
  }, [user.id]);
  return { connected: connection === 'connected', checking };
};
