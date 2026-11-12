import { useId, useRef, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';
import Button from './Button';

import "./style/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <header className="public-header" onKeyDown={event => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }}>
      <button ref={menuButton} className="public-menu-toggle" type="button"
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls={navigationId}
        onClick={() => setMenuOpen(open => !open)}>
        {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
      </button>
      <Link to="/" className="logo-link" aria-label="Lenos IA, página inicial">
        <img className="official-brand-logo official-brand-logo--header" src="/logo.png" alt="Lenos IA" />
      </Link>

      <div className="btn">
        <div className="public-theme-inline"><ThemeToggle /></div>
        <Button type={1} text="Entrar" link="/login" />
        <Button type={2} text="Criar conta" link="/register" />
      </div>

      <nav id={navigationId} aria-label="Navegação principal" data-open={menuOpen} onClick={event => { if (event.target instanceof Element && event.target.closest('a')) setMenuOpen(false); }}>
        <ul>
          <li><Link to="/">Início</Link></li>
          <li><Link to="/about">Sobre Nós</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/support">Suporte</Link></li>
          <li><Link to="/policies-and-terms">Políticas</Link></li>
          <li className="public-theme-menu"><span>Tema</span><ThemeToggle /></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
