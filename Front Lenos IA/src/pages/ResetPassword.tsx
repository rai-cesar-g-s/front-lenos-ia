import ThemeToggle from '../components/ThemeToggle';

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { UserService } from "../api/user";
import { validatePassword, validatePasswordConfirmation } from "../utils/passwordValidation";
import "./style/ResetPassword.css";

type ResetStatus = "form" | "success" | "invalid";

const ResetPassword = () => {
    const [params] = useSearchParams();
    const token = params.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({ password: false, confirmation: false });
    const passwordError = touched.password ? validatePassword(password) : "";
    const confirmationError = touched.confirmation ? validatePasswordConfirmation(password, confirmation) : "";
    const [linkStatus, setStatus] = useState<ResetStatus>('form');
    const status = token ? linkStatus : 'invalid';

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading) return;
        setTouched({ password: true, confirmation: true });
        setError("");
        if (validatePassword(password) || validatePasswordConfirmation(password, confirmation)) return;

        setLoading(true);
        setError("");

        try {
            await UserService.resetPassword({ token, password });
            setStatus("success");
        } catch (requestError: unknown) {
            const response = (requestError as { response?: { data?: { message?: string; detail?: string } } })?.response?.data;
            setError(
                response?.message ||
                response?.detail ||
                "Este link é inválido ou expirou.",
            );
        } finally {
            setLoading(false);
        }
    };

        return <div className="page reset-page"><main className="reset-main">
                <div className="auth-theme-nav"><Link to="/" className="auth-brand" aria-label="Lenos IA, página inicial">
                    <img className="official-brand-logo official-brand-logo--auth" src="/logo.png" alt="Lenos IA" />
                </Link><ThemeToggle /></div>
        {status === "invalid" ? <>
            <div className="auth-icon reset-alert reset-alert--danger"><FiAlertTriangle /></div>
            <h1>Link inválido</h1><h2>Este link de recuperação está ausente, expirou ou já foi utilizado.</h2>
            <div className="invalid-card">Para recuperar o acesso, solicite um novo e-mail de recuperação e abra o link pelo navegador em que você fez a solicitação.</div>
            <Link className="reset-link" to="/forgot-password">Solicitar novo link</Link>
        </> : status === "success" ? <>
            <div className="auth-icon reset-alert reset-alert--success"><FiCheckCircle /></div><h1>Senha redefinida</h1><h2>Sua senha foi atualizada com sucesso. Já pode entrar na sua conta.</h2>
            <Link className="reset-link" to="/login">Entrar</Link>
        </> : <>
            <div className="auth-icon"><FiLock /></div><h1>Redefinir senha</h1><h2>Escolha uma nova senha para sua conta</h2>
            <form className="reset-card" onSubmit={submit} noValidate>
                <label htmlFor="reset-password">Nova senha<input id="reset-password" type={showPassword ? "text" : "password"} minLength={8} maxLength={20} required disabled={loading} aria-invalid={Boolean(passwordError)} aria-describedby={`reset-password-hint${passwordError ? " reset-password-error" : ""}`} value={password} onBlur={() => setTouched((current) => ({ ...current, password: true }))} onChange={(event) => { setPassword(event.target.value); setTouched((current) => ({ ...current, password: true })); setError(""); }} placeholder="Entre 8 e 20 caracteres" autoComplete="new-password" /></label>
                <small id="reset-password-hint" className="reset-hint">A senha deve conter entre 8 e 20 caracteres.</small>
                {passwordError && <small id="reset-password-error" className="reset-error" role="alert">{passwordError}</small>}
                <label htmlFor="reset-confirmation">Confirmar senha<input id="reset-confirmation" type={showPassword ? "text" : "password"} minLength={8} maxLength={20} required disabled={loading} aria-invalid={Boolean(confirmationError)} aria-describedby={confirmationError ? "reset-confirmation-error" : undefined} value={confirmation} onBlur={() => setTouched((current) => ({ ...current, confirmation: true }))} onChange={(event) => { setConfirmation(event.target.value); setTouched((current) => ({ ...current, confirmation: true })); setError(""); }} placeholder="Repita sua senha" autoComplete="new-password" /></label>
                {confirmationError && <small id="reset-confirmation-error" className="reset-error" role="alert">{confirmationError}</small>}
                <button type="button" className="show-password" onClick={() => setShowPassword((visible) => !visible)} aria-pressed={showPassword}>{showPassword ? <FiEyeOff /> : <FiEye />} {showPassword ? "Ocultar senhas" : "Mostrar senhas"}</button>
                {error && <small className="reset-error" role="alert">{error}</small>}
                <button type="submit" className="reset-submit" disabled={loading}>{loading ? "Salvando..." : "Redefinir senha"}</button>
            </form>
        </>}
    </main></div>;
};

export default ResetPassword;
