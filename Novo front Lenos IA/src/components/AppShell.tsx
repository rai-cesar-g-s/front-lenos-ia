import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiSearch,
  FiClock,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import './style/AppShell.css';
import './style/AppShellExtras.css';

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { label: 'Analisar vídeo', path: '/analyze', icon: FiSearch },
  { label: 'Histórico', path: '/history', icon: FiClock },
  { label: 'Configurações', path: '/settings', icon: FiSettings },
  { label: 'Suporte', path: '/support', icon: FiHelpCircle },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => {
      if (typeof window === 'undefined') return false;

      try {
        const savedState = window.localStorage.getItem('lenos-sidebar-collapsed');
        if (savedState !== null) return savedState === 'true';
      } catch {
        // Use the viewport default when browser storage is unavailable.
      }

      return window.matchMedia('(max-width: 820px)').matches;
  },
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supportDialogRef = useRef<HTMLDialogElement>(null);

  const userName = typeof user?.name === 'string' && user.name ? user.name : 'Usuário';
  const userEmail = typeof user?.email === 'string' ? user.email : '';
  const initial = userName.charAt(0).toUpperCase();

  const toggleSidebar = () => {
    const nextState = !isSidebarCollapsed;
    try {
      window.localStorage.setItem('lenos-sidebar-collapsed', String(nextState));
    } catch {
      // The current page can still toggle when browser storage is unavailable.
    }
    setIsSidebarCollapsed(nextState);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`app-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="app-sidebar">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          aria-expanded={!isSidebarCollapsed}
          title={isSidebarCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        >
          {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
        <NavLink to="/dashboard" className="app-brand">
          <img
            className="official-brand-logo official-brand-logo--sidebar"
            src={isSidebarCollapsed ? '/icon-logo.png' : '/logo.png'}
            alt="Lenos IA"
          />
        </NavLink>

        <nav className="app-nav">
          {navigation.map(({ label, path, icon: Icon }) => (
            path === '/support' ? (
              <a
                key={path}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.preventDefault();
                  supportDialogRef.current?.showModal();
                }}
                aria-label={label}
                title={isSidebarCollapsed ? label : undefined}
              >
                <Icon />
                <span>{label}</span>
              </a>
            ) : (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => (isActive ? 'active' : '')}
                aria-label={label}
                title={isSidebarCollapsed ? label : undefined}
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            )
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="new-analysis-btn"
            onClick={() => navigate('/analyze')}
            aria-label="Nova análise"
            title={isSidebarCollapsed ? 'Nova análise' : undefined}
          >
            <FiSearch /> <span>Nova análise</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-left" />

          {/* User Menu Dropdown */}
          <div className="user-menu-wrapper" ref={dropdownRef}>
            <button
              className="user-menu-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              <span className="user-avatar">{initial}</span>
              <span className="user-name">{userName}</span>
              <FiChevronDown className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <strong>{userName}</strong>
                  {userEmail && <small>{userEmail}</small>}
                </div>
                <hr className="dropdown-divider" />
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/settings');
                  }}
                >
                  <FiUser /> <span>Perfil & Configurações</span>
                </button>
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <FiLogOut /> <span>Sair da conta</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="app-content">{children}</main>
      </div>
      <dialog ref={supportDialogRef} className="support-confirm-dialog" aria-labelledby="support-confirm-title" aria-describedby="support-confirm-description">
        <FiHelpCircle className="support-confirm-icon" aria-hidden="true" />
        <h2 id="support-confirm-title">Abrir página de suporte?</h2>
        <p id="support-confirm-description">Você será direcionado à página de suporte em uma nova aba. Sua página atual permanecerá aberta.</p>
        <div className="support-confirm-actions">
          <button type="button" autoFocus onClick={() => supportDialogRef.current?.close()}>Cancelar</button>
          <a href="/support" target="_blank" rel="noopener noreferrer" onClick={() => supportDialogRef.current?.close()}>Ir para o suporte</a>
        </div>
      </dialog>
    </div>
  );
};

export default AppShell;
