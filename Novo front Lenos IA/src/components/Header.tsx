import { Link } from 'react-router-dom';
import Button from './Button';

import "./style/Header.css";

const Header = () => {
  return (
    <header>
      <Link to="/" className="logo-link" aria-label="Lenos IA, página inicial">
        <img className="official-brand-logo official-brand-logo--header" src="/logo.png" alt="Lenos IA" />
      </Link>

      <nav>
        <ul>
          <li><Link to="/">Início</Link></li>
          <li><Link to="/about">Sobre Nós</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/support">Suporte</Link></li>
          <li><Link to="/policies-and-terms">Políticas</Link></li>
        </ul>
      </nav>

      <div className="btn">
        <Button type={1} text="Entrar" link="/login" />
        <Button type={2} text="Criar conta" link="/register" />
      </div>
    </header>
  );
};

export default Header;
