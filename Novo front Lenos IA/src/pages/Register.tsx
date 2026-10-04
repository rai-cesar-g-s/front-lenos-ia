import Title_Page_Middle from "../components/Title_Page_Middle";
import Card_Register from "../components/Card_Register";
import { Link } from "react-router-dom";
import "./style/Register.css";

const Register = () => {
  return (
    <div className="page registration-page">
      <main className="registration-main">
        <Link to="/" className="registration-brand">
          <img className="official-brand-logo official-brand-logo--auth" src="/logo.png" alt="Lenos IA" />
        </Link>
        <div className="registration-icon" aria-hidden="true">♙</div>
        <Title_Page_Middle
          title="Criar sua conta"
          subtitle="Comece a analisar a audiência dos seus vídeos"
        />

        <Card_Register
          name=""
          email=""
          phone=""
          password=""
          confirmation_password=""
        />
        <p className="registration-login">Já tem uma conta? <Link to="/login">Entrar</Link></p>
      </main>
    </div>
  );
};

export default Register;
