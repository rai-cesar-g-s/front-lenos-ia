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
          <li><Link to="/sobre">Sobre Nós</Link></li>
          <li><Link to="/perguntas-frequentes">FAQ</Link></li>
          <li><Link to="/suporte">Suporte</Link></li>
          <li><Link to="/politicas-e-termos-de-uso">Políticas</Link></li>
        </ul>
      </nav>

      <div className="btn">
        <Button type={1} text="Entrar" link="/login" />
        <Button type={2} text="Criar conta" link="/cadastramento" />
      </div>
    </header>
  );
};

export default Header;
