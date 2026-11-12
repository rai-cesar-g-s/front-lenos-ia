import { EMAIL_MAX_LENGTH } from '../utils/emailValidation';
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { UserService } from "../api/user";

import "./style/Card_Forgot_Password.css";

interface CardForgotPasswordProps {
  email: string;
  children?: React.ReactNode;
}

const Card_Forgot_Password: React.FC<CardForgotPasswordProps> = ({ email }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState(email);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim().length > EMAIL_MAX_LENGTH) { setError('O e-mail deve ter no máximo 200 caracteres.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Informe um e-mail válido.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await UserService.requestPasswordReset({ email: value.trim() });
      setMessage("Se o e-mail estiver cadastrado, enviaremos um link de recuperação.");
    } catch (requestError: unknown) {
      const response = (requestError as { response?: { data?: { message?: string; detail?: string } } }).response?.data;
      setError(response?.message || response?.detail || "Não foi possível solicitar a recuperação agora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot_password-card">
      <form onSubmit={handleSubmit} noValidate>
        <div className="card">
          <h3>E-mail</h3>
          <label className={error ? "has-error" : ""}>
            <FiMail aria-hidden="true" />
            <input type="email" maxLength={EMAIL_MAX_LENGTH} required value={value} onChange={(event) => { setValue(event.target.value); setError(""); }} placeholder="voce@email.com" />
          </label>
          {error && <small className="forgot-error">{error}</small>}
        </div>

        {message && <p className="forgot-success">{message}</p>}
        <button type="submit" className="forgot-submit" disabled={loading}>{loading ? "Enviando..." : "Enviar link de recuperação"}</button>
      </form>

      <button type="button" className="forgot-back" onClick={() => navigate("/login")}>← &nbsp;Voltar para login</button>
    </div>
  );
};

export default Card_Forgot_Password;
