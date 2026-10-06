import Title_Page_Middle from "../components/Title_Page_Middle";
import Card_Login from "../components/Card_Login";
import { Link, useLocation } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import "./style/Login.css";

const Login = () => {
  const location = useLocation();
  const message = typeof location.state?.message === 'string' ? location.state.message : '';
  return (
    <div className="page login-page">
      <main className="login-main">
        <Link to="/" className="login-brand">
          <img className="official-brand-logo official-brand-logo--auth" src="/logo.png" alt="Lenos IA" />
        </Link>
        <div className="login-icon" aria-hidden="true"><FiLogIn /></div>
        <Title_Page_Middle
          title="Bem-vindo de volta"
          subtitle="Acesse sua conta para continuar"
        />

        {message && <p role="status">{message}</p>}
        <Card_Login email="" password="" />
      </main>
    </div>
  );
};

export default Login;
