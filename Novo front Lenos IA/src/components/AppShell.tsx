import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiSearch,
  FiClock,
  FiCompass,
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
  { label: 'Analisar vídeo', path: '/analise', icon: FiSearch },
  { label: 'Histórico', path: '/historico', icon: FiClock },
  { label: 'Insights', path: '/insights', icon: FiCompass },
  { label: 'Configurações', path: '/settings', icon: FiSettings },
  { label: 'Suporte', path: '/suporte', icon: FiHelpCircle },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = typeof user?.name === 'string' && user.name ? user.name : 'Usuário';
  const userEmail = typeof user?.email === 'string' ? user.email : '';
  const initial = userName.charAt(0).toUpperCase();

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
          onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
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
            path === '/suporte' ? (
              <a
                key={path}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
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
            onClick={() => navigate('/analise')}
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
    </div>
  );
};

export default AppShell;