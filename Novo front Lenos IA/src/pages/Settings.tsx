import { logSafeError } from '../utils/safeLogger';
import { validatePassword, validatePasswordConfirmation } from '../utils/passwordValidation';
import { isAxiosError } from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiShield,
  FiYoutube,
  FiLock,
  FiCreditCard,
  FiTrash2,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiAlertTriangle,
  FiPhone,
} from 'react-icons/fi';
import { ChannelAnswerEditor } from '../components/ChannelAnswerEditor';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import AppShell from '../components/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { UserService } from '../api/user';
import './style/Settings.css';
import { useChannelDetails } from '../hooks/useChannelDetails';

const phoneDigits = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('55') && digits.length > 11 ? digits.slice(2, 13) : digits.slice(0, 11);
};

const formatPhone = (value: string) => {
  const digits = phoneDigits(value);
  if (!digits) return '';
  let formatted = '+55';
  if (digits.length >= 2) formatted += ` (${digits.slice(0, 2)})`;
  if (digits.length > 2) formatted += ` ${digits.slice(2, 7)}`;
  if (digits.length > 7) formatted += `-${digits.slice(7, 11)}`;
  return formatted;
};

const validateName = (value: string) => {
  if (!value.trim()) return 'Informe seu nome completo.';
  if (value.trim().length < 3) return 'Informe seu nome completo (pelo menos 3 caracteres).';
  if (value.length > 50) return 'O nome deve ter no máximo 50 caracteres.';
  return '';
};

const validatePhone = (value: string) => {
  const digits = phoneDigits(value);
  if (!digits) return 'Informe seu telefone com DDD e 9 dígitos.';
  if (digits.length !== 11) return 'Informe um telefone válido com DDD e 9 dígitos.';
  return '';
};

export const Settings: React.FC = () => {
  const { user, reloadUserProfile, logout } = useAuth();
  const { quota, quotaError, isLoadingQuota, reloadQuota } = useDashboard();
  const navigate = useNavigate();


  const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca' | 'canal' | 'plano'>('perfil');

  const channelDetails = useChannelDetails(activeTab === 'canal');

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const saveProfileField = async (field: 'name' | 'phone', value: string) => {
    await UserService.updateUser({ [field]: field === 'phone' ? '+55' + phoneDigits(value) : value });
    await reloadUserProfile();
  };
  const showToast = (msg: string) => setToastMsg(msg);

  const handleChangePassword = async () => {
    if (isChangingPassword) return;
    const currentError = currentPassword ? '' : 'Informe sua senha atual.';
    const newError = validatePassword(newPassword) || (newPassword === currentPassword ? 'A nova senha deve ser diferente da atual.' : '');
    const confirmationError = validatePasswordConfirmation(newPassword, passwordConfirmation);
    setFieldErrors(current => ({ ...current, currentPassword: currentError, newPassword: newError, passwordConfirmation: confirmationError }));
    if (currentError || newError || confirmationError) return;
    setToastMsg('');
    setIsChangingPassword(true);
    try {
      await UserService.updatePassword({ current_password: currentPassword, new_password: newPassword });
    } catch (err) {
      const status = isAxiosError(err) ? err.response?.status : undefined;
      if (status === 401) {
        setFieldErrors(current => ({ ...current, currentPassword: 'A senha atual está incorreta. Confira e tente novamente.' }));
      } else {
        showToast(status === 403 ? 'Você não tem permissão para alterar a senha.' : status === 422 ? 'Confira os dados da senha e tente novamente.' : 'Não foi possível alterar a senha. Tente novamente.');
      }
      setIsChangingPassword(false);
      return;
    }
    // The change succeeded. Re-establish cookies using the new password.
    try {
      if (typeof user?.email !== 'string' || !user.email) throw new Error('Missing account email');
      await UserService.loginUser({ email: user.email, password: newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setPasswordConfirmation('');
      setShowPassword(false);
      setShowNewPassword(false);
      setShowPasswordConfirmation(false);
      showToast('Senha alterada com sucesso!');
    } catch {
      setCurrentPassword('');
      setNewPassword('');
      setPasswordConfirmation('');
      navigate('/login', { replace: true, state: { message: 'Senha alterada com sucesso. Entre novamente com sua nova senha.' } });
      window.dispatchEvent(new Event('auth-error'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {

    try {
      await UserService.deleteUserAccount();
      await logout();
      navigate('/');
    } catch (error) {
      logSafeError(error);
      throw error;
    }
  };

  return (
    <AppShell>
      {confirmDeleteAccount && <ConfirmDeleteModal title="Excluir conta?" description="Sua conta e todos os dados associados serão excluídos permanentemente. Esta ação não pode ser desfeita." confirmLabel="Excluir conta" onCancel={() => setConfirmDeleteAccount(false)} onConfirm={handleDeleteAccount} />}
      <div className="page-heading">
        <h1>Configurações</h1>
        <p>Gerencie sua conta, segurança e assinatura.</p>
      </div>


      {/* Subtabs navigation bar matching UI design */}
      <div className="settings-tabs-bar">
        <button
          className={`settings-tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          <FiUser /> <span>Perfil</span>
        </button>

        <button
          className={`settings-tab-btn ${activeTab === 'seguranca' ? 'active' : ''}`}
          onClick={() => setActiveTab('seguranca')}
        >
          <FiShield /> <span>Segurança</span>
        </button>

        <button
          className={`settings-tab-btn ${activeTab === 'canal' ? 'active' : ''}`}
          onClick={() => setActiveTab('canal')}
        >
          <FiYoutube /> <span>Detalhes do canal</span>
        </button>



        <button
          className={`settings-tab-btn ${activeTab === 'plano' ? 'active' : ''}`}
          onClick={() => setActiveTab('plano')}
        >
          <FiCreditCard /> <span>Plano</span>
        </button>
      </div>

      {/* Tab 1: Perfil */}
      {activeTab === 'perfil' && (
        <div className="settings-content-wrapper">
          <div className="settings-card">
            <h3>Nome</h3>
            <p className="card-desc">Seu nome de exibição na plataforma.</p>

            <ChannelAnswerEditor question="Nome completo" answer={typeof user?.name === 'string' ? user.name : ''}
              maxLength={50} validate={validateName} onSave={value => saveProfileField('name', value)}
              successMessage="Informação atualizada com sucesso!" />
          </div>

          <div className="settings-card">
            <h3><FiPhone /> Telefone</h3>
            <p className="card-desc">Seu telefone. Alterações exigem verificação.</p>

            <ChannelAnswerEditor question="Telefone" answer={typeof user?.phone === 'string' ? phoneDigits(user.phone) : ''}
              type="tel" maxLength={11} validate={validatePhone} normalize={phoneDigits} displayValue={typeof user?.phone === 'string' ? formatPhone(user.phone) : 'Não informado'} onSave={value => saveProfileField('phone', value)}
              successMessage="Informação atualizada com sucesso!" />
          </div>

          <div className="settings-card">
            <h3><FiMail /> E-mail</h3>
            <p className="card-desc">Seu endereço de e-mail. Alterações exigem validação.</p>

            <div className="channel-answer-view">
              <span>{typeof user?.email === 'string' ? user.email : 'Não informado'}</span>
            </div>
            <small className="settings-email-notice" role="status">
              A troca de e-mail está temporariamente indisponível. O novo endereço precisa ser confirmado antes de substituir o atual.
            </small>
          </div>
        </div>
      )}

      {/* Tab 3: Segurança */}
      {activeTab === 'seguranca' && (
        <div className="settings-content-wrapper">
          <div className="settings-card">
            <h3><FiLock /> Senha</h3>
            <p className="card-desc">Sua senha não é exibida por segurança. Use o formulário abaixo para alterá-la.</p>

            <div className="field-group">
              <label>Senha atual</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setFieldErrors(current => ({ ...current, currentPassword: '' })); }}
                  disabled={isChangingPassword}
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.currentPassword)}
                  aria-describedby={fieldErrors.currentPassword ? 'current-password-error' : undefined}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  disabled={isChangingPassword}
                  aria-label={showPassword ? 'Ocultar senha atual' : 'Mostrar senha atual'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />} <span>{showPassword ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>
              {fieldErrors.currentPassword && <small id="current-password-error" className="settings-field-error" role="alert">{fieldErrors.currentPassword}</small>}
            </div>

            <div className="field-group">
              <label>Nova senha</label>
              <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                minLength={8}
                maxLength={20}
                disabled={isChangingPassword}
                autoComplete="new-password"
                aria-describedby="new-password-hint new-password-error"
                aria-invalid={Boolean(fieldErrors.newPassword)}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setFieldErrors((current) => ({ ...current, newPassword: validatePassword(e.target.value), passwordConfirmation: passwordConfirmation ? validatePasswordConfirmation(e.target.value, passwordConfirmation) : '' }));
                }}
                placeholder="Digite a nova senha"
              />
                <button type="button" className="toggle-password-btn" disabled={isChangingPassword}
                  aria-label={showNewPassword ? 'Ocultar nova senha' : 'Mostrar nova senha'} aria-pressed={showNewPassword}
                  onClick={() => setShowNewPassword(visible => !visible)}>
                  {showNewPassword ? <FiEyeOff /> : <FiEye />} <span>{showNewPassword ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>
              <small id="new-password-hint">A senha deve conter entre 8 e 20 caracteres.</small>
              {fieldErrors.newPassword && <small id="new-password-error" className="settings-field-error" role="alert">{fieldErrors.newPassword}</small>}
            </div>

            <div className="field-group">
              <label htmlFor="password-confirmation">Confirmar nova senha</label>
              <div className="password-input-wrapper">
              <input
                id="password-confirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                minLength={8}
                maxLength={20}
                autoComplete="new-password"
                disabled={isChangingPassword}
                value={passwordConfirmation}
                onChange={event => {
                  setPasswordConfirmation(event.target.value);
                  setFieldErrors(current => ({ ...current, passwordConfirmation: validatePasswordConfirmation(newPassword, event.target.value) }));
                }}
                placeholder="Repita a nova senha"
                aria-invalid={Boolean(fieldErrors.passwordConfirmation)}
                aria-describedby={fieldErrors.passwordConfirmation ? 'password-confirmation-error' : undefined}
              />
                <button type="button" className="toggle-password-btn" disabled={isChangingPassword}
                  aria-label={showPasswordConfirmation ? 'Ocultar confirmação da nova senha' : 'Mostrar confirmação da nova senha'} aria-pressed={showPasswordConfirmation}
                  onClick={() => setShowPasswordConfirmation(visible => !visible)}>
                  {showPasswordConfirmation ? <FiEyeOff /> : <FiEye />} <span>{showPasswordConfirmation ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>
              {fieldErrors.passwordConfirmation && <small id="password-confirmation-error" className="settings-field-error" role="alert">{fieldErrors.passwordConfirmation}</small>}
            </div>

            {toastMsg && <small className={toastMsg === 'Senha alterada com sucesso!' ? 'settings-field-success' : 'settings-field-error'} role="status">{toastMsg}</small>}
            <button className="settings-save-btn" disabled={isChangingPassword} onClick={handleChangePassword}>
              <FiLock /> {isChangingPassword ? 'Alterando...' : 'Alterar senha'}
            </button>
          </div>

          <div className="settings-card danger-card">
            <h3 className="danger-title"><FiAlertTriangle /> Zona de risco</h3>
            <p className="card-desc">Ações nesta seção são permanentes.</p>

            <div className="switch-row">
              <div>
                <strong className="danger-text">Excluir conta</strong>
                <p>Remove permanentemente sua conta e todos os dados associados.</p>
              </div>
              <button
                className="danger-outline-btn small"
                onClick={() => setConfirmDeleteAccount(true)}
              >
                <FiTrash2 /> Excluir
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Perguntas e respostas já fornecidas pelo usuário. */}
      {activeTab === 'canal' && (
        <div className="settings-content-wrapper">
          <div className="settings-card">
            <h3><FiYoutube /> Detalhes do canal</h3>
            <p className="card-desc">Confira e edite as respostas que você forneceu sobre seu canal.</p>
            {channelDetails.loading ? <p role="status">Carregando detalhes do canal...</p> : channelDetails.error ? (
              <div role="alert">
                <p className="settings-field-error">{channelDetails.error}</p>
                <button className="settings-secondary-btn" onClick={channelDetails.retry}>Tentar novamente</button>
              </div>
            ) : channelDetails.answers.length === 0 ? (
              <p>Você ainda não respondeu às perguntas sobre seu canal.</p>
            ) : (
              <dl className="channel-answers-list">
                {channelDetails.answers.map((item) => (
                  <div className="channel-answer" key={item.answer_id}>
                    <dt>{item.question}</dt>
                    <dd><ChannelAnswerEditor answer={item.answer} question={item.question} onSave={value => channelDetails.updateAnswer(item.answer_id, value)} /></dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}
      {/* Tab 6: Plano */}
      {activeTab === 'plano' && (
        <div className="settings-content-wrapper">
          <div className="settings-card">
            <div className="plan-title-header">
              <div className="plan-title-group">
                <h3><FiCreditCard /> Plano atual</h3>
                <div className="plan-name-badge">
                  <strong>Gratuito</strong>
                  <span className="active-status">Ativa</span>
                </div>
              </div>
            </div>

            {quotaError && <p className="settings-field-error" role="alert">{quotaError} <button type="button" onClick={() => void reloadQuota()}>Tentar novamente</button></p>}
            <div className="plan-usage-group">
              <div className="usage-item">
                <div className="usage-label-row">
                  <span>Análises concluídas</span>
                  <span className="usage-count">
                    {isLoadingQuota ? 'Carregando...' : quotaError || !quota ? 'Indisponível' : `${quota.used} de ${quota.limit} neste mês`}
                  </span>
                </div>
                <div className="plan-progress-bg">
                  <div className="plan-progress-fill" style={{ width: `${quota && quota.limit > 0 ? Math.min(100, (quota.used / quota.limit) * 100) : 0}%` }} />
                </div>
              </div>

              <div className="usage-item">
                <div className="usage-label-row">
                  <span>Comentários processados neste mês</span>
                  <span className="usage-count">
                    {isLoadingQuota ? 'Carregando...' : quotaError || !quota ? 'Indisponível' : quota.comments_processed.toLocaleString('pt-BR')}
                  </span>
                </div>

              </div>
            </div>

            <p className="card-desc">O plano Gratuito é o único plano disponível no momento.</p>
          </div>

          <div className="settings-card">
            <h3>Recursos incluídos</h3>
            <ul className="plan-features-list">
              <li><FiCheck className="check-icon" /> Análise de sentimentos</li>
              <li><FiCheck className="check-icon" /> Visualização de temas</li>
              <li><FiCheck className="check-icon" /> Histórico limitado</li>
              <li><FiCheck className="check-icon" /> 1 usuário</li>
            </ul>
            <small className="plan-limit-note">
              {quota ? `Limite: até ${quota.limit} análises/mês · ${quota.remaining} disponíveis` : 'Limite mensal indisponível'}
            </small>
          </div>
        </div>
      )}

    </AppShell>
  );
};

export default Settings;
