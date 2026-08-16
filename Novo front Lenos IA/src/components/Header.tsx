import React from "react";

const Header = () => {
  return (
    <header>
      <div className="logo">
        <img></img>
        <h1>Lenos IA</h1>
        <p>Inteligência de Audiência</p>
      </div>

      <nav>
        <ul>
          <li>Início</li>
          <li>Sobre Nós</li>
          <li>FAQ</li>
          <li>Suporte</li>
          <li>Políticas</li>
        </ul>
      </nav>

      <div className="btn">
        <button>Entrar</button>
        <button>Criar conta</button>
      </div>
    </header>
  );
};

export default Header;
