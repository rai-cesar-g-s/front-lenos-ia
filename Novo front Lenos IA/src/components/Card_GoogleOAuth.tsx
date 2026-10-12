import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';
import { useYouTubeConnection } from '../hooks/useYouTubeConnection';
import { triggerGoogleAuth } from '../utils/googleAuth';
import './style/Card_GoogleOAuth.css';

const Card_GoogleOAuth = () => {
  const { connected, expired, checking, expiresAt, retry, error: connectionError } = useYouTubeConnection();
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
  const expiration = expiresAt ? new Date(expiresAt) : null;
  const expirationLabel = expiration && Number.isFinite(expiration.getTime())
    ? expiration.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }) : null;
  return <div className="card_google_oauth">
    {connected ? <FiCheckCircle className="youtube-connected-icon" aria-hidden="true" /> : <FaGoogle className="google-connect-icon" aria-hidden="true" />}
    <h3>{checking ? 'Verificando conexão' : connectionError ? 'Conexão não confirmada' : connected ? 'Você já está conectado ao YouTube' : expired ? 'Reconecte sua conta Google' : 'Conecte seu canal do YouTube'}</h3>
    <p>{checking ? 'Consultando o status da sua conta Google...' : connectionError ? 'Tente verificar novamente para consultar o vínculo da sua conta.' : connected ? 'Sua conta do YouTube está vinculada. Você pode começar a analisar seus vídeos.' : expired ? 'Sua autorização expirou. Reconecte a conta Google para continuar analisando seus vídeos.' : 'Para começar a analisar seus vídeos, conecte a conta Google vinculada ao seu canal.'}</p>
    {!checking && !connectionError && expirationLabel && (connected || expired) && <p className="connection-expiration">{expired ? 'Autorização expirada em' : 'Autorização válida até'} {expirationLabel} (horário de Brasília).</p>}
    {connectionError && <p className="server-error" role="alert">{connectionError}</p>}
    {error && <p className="server-error" role="alert">{error}</p>}
    {checking ? <p role="status">Verificando conexão...</p> : connectionError ? <button className="google-connect-button" onClick={retry}>Tentar novamente</button> : <button className="google-connect-button" onClick={connect} disabled={loading}>
      {loading ? 'Redirecionando...' : connected ? 'Trocar conta do YouTube' : expired ? 'Reconectar Google' : 'Conectar Google'}
    </button>}
  </div>;
};
export default Card_GoogleOAuth;
