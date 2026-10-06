import { Link } from "react-router-dom";
import "./style/Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="logo">
        <img className="official-brand-logo official-brand-logo--footer" src="/logo.png" alt="Lenos IA" />
      </div>

      <nav>
        <ul>
          <li><Link to="/">Início</Link></li>
          <li><Link to="/about">Sobre</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/support">Suporte</Link></li>
          <li><Link to="/policies-and-terms">Políticas</Link></li>
        </ul>
      </nav>

      <div className="copyrigths">
        <p>© 2026 Lenos IA. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
