import { logSafeError } from '../utils/safeLogger';
import React, { useEffect, useState } from 'react';
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

const validateEmail = (value: string) => {
  if (!value.trim()) return 'Informe seu e-mail.';
  if (value.length > 200) return 'O e-mail deve ter no máximo 200 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Informe um e-mail válido.';
  return '';
};

const validatePassword = (value: string) => {
  if (!value) return 'Informe uma senha.';
  if (value.length < 8 || value.length > 20) return 'A senha deve conter entre 8 e 20 caracteres.';
  return '';
};

export const Settings: React.FC = () => {
  const { user, reloadUserProfile, logout } = useAuth();
  const { reports, reportsError, isLoadingReports } = useDashboard();
  const completedReportCount = reports.filter((report) => report.status === 'done' || report.status === 'completed').length;
  const navigate = useNavigate();


  const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca' | 'canal' | 'plano'>('perfil');

  const channelDetails = useChannelDetails(activeTab === 'canal');

  // Form states
  const [name, setName] = useState(typeof user?.name === 'string' && user.name !== 'Carregando...' ? user.name : '');
  const [phone, setPhone] = useState(typeof user?.phone === 'string' ? phoneDigits(user.phone) : '');
  const [email, setEmail] = useState(typeof user?.email === 'string' ? user.email : '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (typeof user?.name === 'string' && user.name !== 'Carregando...') setName(user.name);
    if (typeof user?.phone === 'string') setPhone(phoneDigits(user.phone));
    if (typeof user?.email === 'string') setEmail(user.email);
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSaveName = async () => {
    const error = validateName(name);
    setFieldErrors((current) => ({ ...current, name: error }));
    if (error) return;

    try {
      await UserService.updateUser({ name: name.trim() });
      await reloadUserProfile();
      showToast('Perfil atualizado com sucesso!');
    } catch (err) {
      logSafeError(err);
      showToast('Não foi possível atualizar o perfil. Tente novamente.');
    }
  };

  const handleSavePhone = async () => {
    const error = validatePhone(phone);
    setFieldErrors((current) => ({ ...current, phone: error }));
    if (error) return;

    try {
      await UserService.updateUser({ phone: `+55${phoneDigits(phone)}` });
      await reloadUserProfile();
      showToast('Telefone atualizado com sucesso!');
    } catch (err) {
      logSafeError(err);
      showToast('Não foi possível atualizar o telefone. Tente novamente.');
    }
  };

  const handleSaveEmail = async () => {
    const error = validateEmail(email);
    setFieldErrors((current) => ({ ...current, email: error }));
    if (error) return;

    try {
      await UserService.updateUser({ email: email.trim() });
      await reloadUserProfile();
      showToast('Endereço de e-mail atualizado!');
    } catch (err) {
      logSafeError(err);
      showToast('Não foi possível atualizar o e-mail. Tente novamente.');
    }
  };

  const handleChangePassword = async () => {
    const error = validatePassword(newPassword);
    setFieldErrors((current) => ({ ...current, newPassword: error }));
    if (!currentPassword) {
      showToast('Preencha a senha atual e a nova senha.');
      return;
    }
    if (error) return;
    try {
      await UserService.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      showToast('Senha alterada com sucesso!');
    } catch (err) {
      logSafeError(err);
      showToast('Não foi possível alterar a senha. Confira a senha atual e tente novamente.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Deseja excluir permanentemente sua conta?')) return;

    try {
      await UserService.deleteUserAccount();
      await logout();
      navigate('/');
    } catch (error) {
      logSafeError(error);
      showToast('Não foi possível excluir a conta. Tente novamente.');
    }
  };

  return (
    <AppShell>
      <div className="page-heading">
        <h1>Configurações</h1>
        <p>Gerencie sua conta, segurança e assinatura.</p>
      </div>

      {toastMsg && <div className="settings-toast-msg">{toastMsg}</div>}

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

            <div className="field-group">
              <label>Nome completo</label>
              <input
                type="text"
                maxLength={50}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((current) => ({ ...current, name: validateName(e.target.value) }));
                }}
                placeholder="Seu nome completo"
              />
              {fieldErrors.name && <small className="settings-field-error">{fieldErrors.name}</small>}
            </div>

            <button className="settings-save-btn" onClick={handleSaveName}>
              Salvar
            </button>
          </div>

          <div className="settings-card">
            <h3><FiPhone /> Telefone</h3>
            <p className="card-desc">Seu telefone. Alterações exigem verificação.</p>

            <div className="field-group">
              <label>Telefone</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={isPhoneFocused ? 11 : 19}
                value={isPhoneFocused ? phone : formatPhone(phone)}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
                onChange={(e) => {
                  const digits = phoneDigits(e.target.value);
                  setPhone(digits);
                  setFieldErrors((current) => ({ ...current, phone: validatePhone(digits) }));
                }}
                placeholder="(00) 00000-0000"
              />
              {fieldErrors.phone && <small className="settings-field-error">{fieldErrors.phone}</small>}
            </div>

            <button className="settings-save-btn" onClick={handleSavePhone}>
              Salvar telefone
            </button>
          </div>

          <div className="settings-card">
            <h3><FiMail /> E-mail</h3>
            <p className="card-desc">Seu endereço de e-mail. Alterações exigem validação.</p>

            <div className="field-group">
              <label>E-mail</label>
              <input
                type="email"
                maxLength={200}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((current) => ({ ...current, email: validateEmail(e.target.value) }));
                }}
                placeholder="seu.email@exemplo.com"
              />
              {fieldErrors.email && <small className="settings-field-error">{fieldErrors.email}</small>}
            </div>

            <button className="settings-save-btn" onClick={handleSaveEmail}>
              Salvar e-mail
            </button>
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
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />} <span>{showPassword ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>
            </div>

            <div className="field-group">
              <label>Nova senha</label>
              <input
                type="password"
                minLength={8}
                maxLength={20}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setFieldErrors((current) => ({ ...current, newPassword: validatePassword(e.target.value) }));
                }}
                placeholder="Digite a nova senha"
              />
              {fieldErrors.newPassword && <small className="settings-field-error">{fieldErrors.newPassword}</small>}
            </div>

            <button className="settings-save-btn" onClick={handleChangePassword}>
              <FiLock /> Alterar senha
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
                onClick={handleDeleteAccount}
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
            <p className="card-desc">Confira as perguntas e respostas que você forneceu sobre seu canal.</p>
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
                    <dd>{item.answer}</dd>
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

            <div className="plan-usage-group">
              <div className="usage-item">
                <div className="usage-label-row">
                  <span>Análises concluídas</span>
                  <span className="usage-count">
                    {isLoadingReports ? 'Carregando...' : reportsError ? 'Indisponível' : `${completedReportCount} de 5`}
                  </span>
                </div>
                <div className="plan-progress-bg">
                  <div className="plan-progress-fill" style={{ width: `${Math.min(100, (completedReportCount / 5) * 100)}%` }} />
                </div>
              </div>

              <div className="usage-item">
                <div className="usage-label-row">
                  <span>Comentários processados</span>
                  <span className="usage-count">0 de 2.500</span>
                </div>
                <div className="plan-progress-bg">
                  <div className="plan-progress-fill" style={{ width: '0%' }} />
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
              Limite: até 5 análises/mês · 500 comentários por análise
            </small>
          </div>
        </div>
      )}

    </AppShell>
  );
};

export default Settings;
