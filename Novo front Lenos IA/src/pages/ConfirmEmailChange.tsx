import ThemeToggle from '../components/ThemeToggle';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiMail } from 'react-icons/fi';
import { UserService } from '../api/user';
import { useAuth } from '../hooks/useAuth';
import { emailChangeError } from '../utils/emailChange';
import './style/ConfirmationEmail.css';

// Compartilha a requisição para não consumir duas vezes o mesmo link no StrictMode.
const confirmations = new Map<string, Promise<unknown>>();
function confirmOnce(token: string) {
  let request = confirmations.get(token);
  if (!request) {
    request = UserService.confirmEmailChange(token);
    confirmations.set(token, request);
    const current = request;
    void request.catch(() => { if (confirmations.get(token) === current) confirmations.delete(token); });
  }
  return request;
}
export default function ConfirmEmailChange() {
  const { isAuthenticated, loading, reloadUserProfile } = useAuth();
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = params.get('token');
  const [result, setResult] = useState<{ token: string; error?: string } | null>(null);
  useEffect(() => {
    if (!token || loading || !isAuthenticated || result?.token === token) return;
    let active = true;
    void confirmOnce(token).then(() => {
      if (!active) return;
      // A confirmação renova os cookies no backend; apenas atualize o perfil.
      void reloadUserProfile();
      navigate('/settings', { replace: true });
    }).catch(error => { if (active) setResult({ token, error: emailChangeError(error, true) }); });
    return () => { active = false; };
  }, [token, loading, isAuthenticated, navigate, result, reloadUserProfile]);
  const outcome = result?.token === token ? result : null;
  const pending = Boolean(token && !outcome && (loading || isAuthenticated));
  const success = Boolean(outcome && !outcome.error);
  const title = !token ? 'Verifique seu novo e-mail' : pending ? 'Confirmando seu novo e-mail' : success ? 'E-mail alterado' : outcome?.error ? 'Não foi possível confirmar' : 'Entre para confirmar seu e-mail';
  return <main className="confirmation-email-page"><section className="confirmation-email-card" aria-live="polite" aria-busy={pending}>
    <div className="auth-theme-nav"><Link to="/" className="confirmation-brand"><img className="official-brand-logo official-brand-logo--auth" src="/logo.png" alt="Lenos IA" /></Link><ThemeToggle /></div>
    <div className={'confirmation-status-icon confirmation-status-' + (pending ? 'pending' : success ? 'success' : outcome?.error ? 'error' : 'notice')}>
      {pending ? <FiLoader /> : success ? <FiCheckCircle /> : outcome?.error ? <FiAlertCircle /> : <FiMail />}
    </div>
    <h1 className="confirmation-title">{title}</h1>
    <p className="confirmation-description">{!token ? 'Enviamos um link de confirmação para o novo endereço. Confira sua caixa de entrada e o spam. Seu e-mail atual será mantido até a confirmação.' : pending ? 'Estamos validando o link. Aguarde alguns instantes.' : success ? 'Seu e-mail foi alterado com sucesso. Use o novo endereço no próximo login.' : outcome?.error || 'Entre na conta que solicitou a alteração usando seu e-mail atual. A confirmação será feita após o login.'}</p>
    {!pending && <div className="confirmation-actions">
      {token && !isAuthenticated && !success ? <Link className="confirmation-primary-action" to="/login" state={{ emailChangeReturnTo: location.pathname + location.search }}>Entrar na conta</Link> : <Link className="confirmation-primary-action" to={isAuthenticated ? '/settings' : '/login'}>{isAuthenticated ? 'Voltar às Configurações' : 'Entrar na conta'}</Link>}
    </div>}
  </section></main>;
}
