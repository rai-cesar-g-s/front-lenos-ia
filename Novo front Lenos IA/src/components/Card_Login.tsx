import { logSafeError } from '../utils/safeLogger';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/Card_Login.css";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { formatErrorMessage } from "../utils/errorMessage";

interface CardLoginProps {
  email?: string;
  password?: string;
}

const Card_Login: React.FC<CardLoginProps> = ({ email: initialEmail = "", password: initialPassword = "" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Informe um e-mail válido.";
    }

    if (!password) {
      nextErrors.password = "Informe sua senha.";
    } else if (password.length < 6) {
      nextErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await login({ email: email.trim(), password });
      navigate("/dashboard");
    } catch (err: unknown) {
      logSafeError("Login Error:", err);
      const msg = formatErrorMessage(err, "E-mail ou senha incorretos. Verifique suas credenciais.");
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card_login">
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <div className="card">
          <h3>E-mail <span>*</span></h3>
          <label className={errors.email ? "has-error" : ""}>
            <FiMail aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
                setServerError("");
              }}
              placeholder="voce@email.com"
              disabled={isSubmitting}
            />
          </label>
          {errors.email && <small className="field-error">{errors.email}</small>}
        </div>

        {/* Password Field */}
        <div className="card">
          <div className="login-label-row">
            <h3>Senha <span>*</span></h3>
            <Link to="/recuperacao-de-senha">Esqueci minha senha</Link>
          </div>
          <label className={errors.password ? "has-error" : ""}>
            <FiLock aria-hidden="true" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
                setServerError("");
              }}
              placeholder="Digite sua senha"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </label>
          {errors.password && <small className="field-error">{errors.password}</small>}
        </div>

        {/* Remember Me Checkbox */}
        <div className="aceppt_terms">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me">Lembrar de mim</label>
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="server-error-box" role="alert">
            {serverError}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <FiLoader className="spin-icon" /> Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>

        <div className="anchor-links">
          <span>
            Não tem uma conta?{" "}
            <Link to="/cadastramento" className="anchor-link">
              <span>Criar conta</span>
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Card_Login;
