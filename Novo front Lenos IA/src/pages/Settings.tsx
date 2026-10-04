import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiShield,
  FiBell,
  FiLock,
  FiCreditCard,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiAlertTriangle,
  FiPhone,
} from 'react-icons/fi';
import AppShell from '../components/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { UserService } from '../api/user';
import './style/Settings.css';

type SavedPreferences = {
  notifyCompleted: boolean;
  notifyTips: boolean;
  notifyNews: boolean;
  allowDataAnalysis: boolean;
  keepHistory: boolean;
};

const readSavedPreferences = (): Partial<SavedPreferences> => {
  try {
    return JSON.parse(localStorage.getItem('lenos-settings-preferences') || '{}') as Partial<SavedPreferences>;
  } catch {
    return {};
  }
};

export const Settings: React.FC = () => {
  const { user, reloadUserProfile, logout } = useAuth();
  const { reports, reportsError, isLoadingReports } = useDashboard();
  const completedReportCount = reports.filter((report) => report.status === 'done' || report.status === 'completed').length;
  const navigate = useNavigate();
  const [initialPreferences] = useState(readSavedPreferences);

  const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca' | 'preferencias' | 'privacidade' | 'plano'>('perfil');

  // Form states
  const [name, setName] = useState(typeof user?.name === 'string' && user.name !== 'Carregando...' ? user.name : '');
  const [phone, setPhone] = useState(typeof user?.phone === 'string' ? user.phone : '');
  const [email, setEmail] = useState(typeof user?.email === 'string' ? user.email : '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Preference switches
  const [notifyCompleted, setNotifyCompleted] = useState(initialPreferences.notifyCompleted ?? true);
  const [notifyTips, setNotifyTips] = useState(initialPreferences.notifyTips ?? true);
  const [notifyNews, setNotifyNews] = useState(initialPreferences.notifyNews ?? false);
  const [allowDataAnalysis, setAllowDataAnalysis] = useState(initialPreferences.allowDataAnalysis ?? true);
  const [keepHistory, setKeepHistory] = useState(initialPreferences.keepHistory ?? true);

  // Modal Planos state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (typeof user?.name === 'string' && user.name !== 'Carregando...') setName(user.name);
    if (typeof user?.phone === 'string') setPhone(user.phone);
    if (typeof user?.email === 'string') setEmail(user.email);
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSaveProfile = async () => {
    try {
      await UserService.updateUser({
        name,
        email: (user?.email as string) || email,
        phone,
      });
      await reloadUserProfile();
      showToast('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('Não foi possível atualizar o perfil. Tente novamente.');
    }
  };

  const handleSaveEmail = async () => {
    try {
      await UserService.updateUser({
        name: (user?.name as string) || name,
        email,
        phone: (user?.phone as string) || phone,
      });
      await reloadUserProfile();
      showToast('Endereço de e-mail atualizado!');
    } catch (err) {
      console.error(err);
      showToast('Não foi possível atualizar o e-mail. Tente novamente.');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      showToast('Preencha a senha atual e a nova senha.');
      return;
    }
    try {
      await UserService.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      showToast('Senha alterada com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('Não foi possível alterar a senha. Confira a senha atual e tente novamente.');
    }
  };

  const handleSavePreferences = () => {
    const preferences: SavedPreferences = {
      notifyCompleted,
      notifyTips,
      notifyNews,
      allowDataAnalysis,
      keepHistory,
    };
    localStorage.setItem('lenos-settings-preferences', JSON.stringify(preferences));
    showToast('Preferências salvas neste navegador.');
  };

  const handleExportData = async () => {
    try {
      const profile = await UserService.getUserProfile();
      const file = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(file);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'lenos-ia-meus-dados.json';
      downloadLink.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Seus dados foram exportados.');
    } catch (error) {
      console.error(error);
      showToast('Não foi possível exportar seus dados. Tente novamente.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Deseja excluir permanentemente sua conta?')) return;

    try {
      await UserService.deleteUserAccount();
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
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
          className={`settings-tab-btn ${activeTab === 'preferencias' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferencias')}
        >
          <FiBell /> <span>Preferências</span>
        </button>

        <button
          className={`settings-tab-btn ${activeTab === 'privacidade' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacidade')}
        >
          <FiLock /> <span>Privacidade</span>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <button className="settings-save-btn" onClick={handleSaveProfile}>
              Salvar
            </button>
          </div>

          <div className="settings-card">
            <h3><FiPhone /> Telefone</h3>
            <p className="card-desc">Seu telefone. Alterações exigem verificação.</p>

            <div className="field-group">
              <label>Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            <button className="settings-save-btn" onClick={handleSaveProfile}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
              />
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>

            <button className="settings-save-btn" onClick={handleChangePassword}>
              <FiLock /> Alterar senha
            </button>
          </div>

        </div>
      )}

      {/* Tab 4: Preferências */}
      {activeTab === 'preferencias' && (
        <div className="settings-content-wrapper">
          <div className="settings-card">
            <h3><FiBell /> Notificações</h3>
            <p className="card-desc">Escolha o que você deseja receber por e-mail.</p>

            <div className="switches-list">
              <div className="switch-row">
                <div>
                  <strong>Análises concluídas</strong>
                  <p>Receber um aviso quando uma análise for finalizada.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifyCompleted}
                    onChange={(e) => setNotifyCompleted(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="switch-row">
                <div>
                  <strong>Dicas de conteúdo</strong>
                  <p>Sugestões baseadas nos seus relatórios.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifyTips}
                    onChange={(e) => setNotifyTips(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="switch-row">
                <div>
                  <strong>Novidades do produto</strong>
                  <p>Atualizações e novos recursos da Lenos IA.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifyNews}
                    onChange={(e) => setNotifyNews(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
            <button className="settings-save-btn" onClick={handleSavePreferences}>
              Salvar preferências
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Privacidade */}
      {activeTab === 'privacidade' && (
        <div className="settings-content-wrapper">
          <div className="settings-card">
            <h3><FiShield /> Controle de dados</h3>
            <p className="card-desc">Gerencie como seus dados são utilizados.</p>

            <div className="switches-list">
              <div className="switch-row">
                <div>
                  <strong>Permitir análise de dados para melhorias</strong>
                  <p>Usamos dados anonimizados para melhorar a qualidade das análises.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={allowDataAnalysis}
                    onChange={(e) => setAllowDataAnalysis(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="switch-row">
                <div>
                  <strong>Manter histórico de análises</strong>
                  <p>Armazena seus relatórios para consulta futura.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={keepHistory}
                    onChange={(e) => setKeepHistory(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h3>Exportar dados</h3>
            <p className="card-desc">Baixe uma cópia dos seus dados em formato legível.</p>

            <button className="settings-secondary-btn" onClick={handleExportData}>
              <FiDownload /> Exportar meus dados
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

            <button
              className="settings-save-btn"
              onClick={() => setIsPlanModalOpen(true)}
            >
              Alterar plano
            </button>
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

      {/* Plans Comparison Modal matching planos.png */}
      {isPlanModalOpen && (
        <div className="plans-modal-overlay" onClick={() => setIsPlanModalOpen(false)}>
          <div className="plans-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="plans-modal-header">
              <div>
                <h2>Comparar planos</h2>
                <p>Escolha o plano ideal para você. Você pode alterar a qualquer momento.</p>
              </div>
              <button className="close-modal-btn" onClick={() => setIsPlanModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <div className="plans-grid">
              {/* Gratuito */}
              <div className="plan-column-card">
                <div className="plan-card-top">
                  <div className="plan-head-row">
                    <h3>Gratuito</h3>
                    <span className="current-plan-pill">Plano atual</span>
                  </div>
                  <div className="plan-price">
                    <strong>R$ 0</strong><span>/mês</span>
                  </div>
                  <small className="plan-specs">5 análises/mês · 500 comentários</small>
                </div>

                <ul className="plan-features-check-list">
                  <li className="yes"><FiCheck /> Análise de sentimentos</li>
                  <li className="yes"><FiCheck /> Visualização de temas</li>
                  <li className="yes"><FiCheck /> Histórico limitado</li>
                  <li className="yes"><FiCheck /> 1 usuário</li>
                  <li className="no"><FiX /> Exportação de relatórios</li>
                  <li className="no"><FiX /> Insights avançados de IA</li>
                  <li className="no"><FiX /> Oportunidades de conteúdo</li>
                </ul>
              </div>

              {/* Pro */}
              <div className="plan-column-card highlight">
                <div className="plan-card-top">
                  <h3>Pro</h3>
                  <div className="plan-price">
                    <strong>R$ 49</strong><span>/mês</span>
                  </div>
                  <small className="plan-specs">50 análises/mês · 10.000 comentários</small>
                </div>

                <ul className="plan-features-check-list">
                  <li className="yes"><FiCheck /> Análise de sentimentos</li>
                  <li className="yes"><FiCheck /> Visualização de temas</li>
                  <li className="yes"><FiCheck /> Histórico completo</li>
                  <li className="yes"><FiCheck /> Exportação de relatórios</li>
                  <li className="yes"><FiCheck /> Insights avançados de IA</li>
                  <li className="yes"><FiCheck /> Oportunidades de conteúdo</li>
                  <li className="no"><FiX /> Múltiplos usuários</li>
                  <li className="no"><FiX /> Colaboração em equipe</li>
                </ul>

                <button
                  className="select-plan-btn"
                  onClick={() => {
                    setIsPlanModalOpen(false);
                    navigate('/suporte?plano=Pro');
                  }}
                >
                  Selecionar
                </button>
              </div>

              {/* Equipe */}
              <div className="plan-column-card">
                <div className="plan-card-top">
                  <h3>Equipe</h3>
                  <div className="plan-price">
                    <strong>R$ 149</strong><span>/mês</span>
                  </div>
                  <small className="plan-specs">200 análises/mês · 50.000 comentários</small>
                </div>

                <ul className="plan-features-check-list">
                  <li className="yes"><FiCheck /> Análise de sentimentos</li>
                  <li className="yes"><FiCheck /> Visualização de temas</li>
                  <li className="yes"><FiCheck /> Histórico completo</li>
                  <li className="yes"><FiCheck /> Exportação de relatórios</li>
                  <li className="yes"><FiCheck /> Insights avançados de IA</li>
                  <li className="yes"><FiCheck /> Oportunidades de conteúdo</li>
                  <li className="yes"><FiCheck /> Múltiplos usuários</li>
                  <li className="yes"><FiCheck /> Colaboração em equipe</li>
                  <li className="yes"><FiCheck /> Suporte prioritário</li>
                </ul>

                <button
                  className="select-plan-btn"
                  onClick={() => {
                    setIsPlanModalOpen(false);
                    navigate('/suporte?plano=Equipe');
                  }}
                >
                  Selecionar
                </button>
              </div>
            </div>

            <div className="plans-modal-footer">
              <button className="footer-close-btn" onClick={() => setIsPlanModalOpen(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default Settings;