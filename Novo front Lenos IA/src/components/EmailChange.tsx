import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit3 } from 'react-icons/fi';
import { UserService } from '../api/user';
import { useAuth } from '../hooks/useAuth';
import { emailChangeError, validateNewEmail } from '../utils/emailChange';

export function EmailChange() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentEmail = typeof user.email === 'string' ? user.email : '';
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const inFlight = useRef(false);
  const requestChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current) return;
    const validation = validateNewEmail(email, currentEmail);
    setError(validation);
    if (validation) return;
    inFlight.current = true;
    setBusy(true);
    setMessage('');
    try {
      await UserService.requestEmailChange(email);
      setMessage('Enviamos um link de confirmação para o novo e-mail. Confira sua caixa de entrada e o spam. Seu endereço atual será mantido até a confirmação.');
      setEditing(false);
      navigate('/confirm-email');
    } catch (failure) { setError(emailChangeError(failure)); }
    finally { setBusy(false); inFlight.current = false; }
  };
  return <>
    {!editing && <div className="channel-answer-view">
      <span>{currentEmail || 'Não informado'}</span>
      <button type="button" className="settings-secondary-btn" onClick={() => { setEmail(currentEmail); setEditing(true); setError(''); setMessage(''); }}><FiEdit3 /> Alterar e-mail</button>
    </div>}
    {editing && <form onSubmit={requestChange} noValidate>
      <div className="field-group">
        <label htmlFor="new-account-email">Novo e-mail</label>
        <input id="new-account-email" type="email" autoComplete="email" autoFocus value={email} disabled={busy} required aria-invalid={Boolean(error)} aria-describedby="email-change-count email-change-feedback" onChange={event => { setEmail(event.target.value); setError(''); }} />
        <small id="email-change-count">{Array.from(email).length} caracteres</small>
      </div>
      <div className="channel-answer-actions">
        <button className="settings-save-btn" disabled={busy}>{busy ? 'Enviando...' : 'Enviar confirmação'}</button>
        <button className="settings-secondary-btn" type="button" disabled={busy} onClick={() => { setEditing(false); setEmail(''); setError(''); }}>Cancelar</button>
      </div>
    </form>}
    <div id="email-change-feedback">
      {error && <p className="settings-field-error" role="alert">{error}</p>}
      {message && <p className="settings-field-success" role="status">{message}</p>}
    </div>
  </>;
}
