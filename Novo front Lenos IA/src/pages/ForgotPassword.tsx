import Title_Page_Middle from "../components/Title_Page_Middle";
import Card_Forgot_Password from "../components/Card_Forgot_Password";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import "./style/ForgotPassword.css";

const ForgotPassword = () => {
  return (
    <div className="page forgot-page">
      <main className="forgot-main">
        <Link to="/" className="auth-brand" aria-label="Lenos IA, página inicial">
          <img className="official-brand-logo official-brand-logo--auth" src="/logo.png" alt="Lenos IA" />
        </Link>
        <div className="auth-icon"><FiMail /></div>
        <Title_Page_Middle title="Recuperar senha" subtitle="Enviaremos um link para redefini-la" />

        <Card_Forgot_Password email="" />
      </main>
    </div>
  );
};

export default ForgotPassword;
