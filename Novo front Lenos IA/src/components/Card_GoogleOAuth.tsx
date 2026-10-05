import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';
import { useYouTubeConnection } from '../hooks/useYouTubeConnection';
import { triggerGoogleAuth } from '../utils/googleAuth';
import './style/Card_GoogleOAuth.css';

const Card_GoogleOAuth = () => {
  const { connected, checking } = useYouTubeConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const connect = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    const result = await triggerGoogleAuth();
    if (!result.success) {
      setError(result.error || 'Não foi possível conectar ao Google.');
      setLoading(false);
    }
  };
  return <div className="card_google_oauth">
    {connected ? <FiCheckCircle className="youtube-connected-icon" aria-hidden="true" /> : <FaGoogle className="google-connect-icon" aria-hidden="true" />}
    <h3>{connected ? 'YouTube conectado' : 'Conecte seu canal do YouTube'}</h3>
    <p>{connected ? 'Sua conta do YouTube está vinculada. Você pode começar a analisar seus vídeos.' : 'Para começar a analisar seus vídeos, conecte a conta Google vinculada ao seu canal.'}</p>
    {error && <p className="server-error" role="alert">{error}</p>}
    {checking ? <p role="status">Verificando conexão...</p> : !connected && <button className="google-connect-button" onClick={connect} disabled={loading}>
      {loading ? 'Redirecionando...' : 'Conectar Google'}
    </button>}
  </div>;
};
export default Card_GoogleOAuth;
