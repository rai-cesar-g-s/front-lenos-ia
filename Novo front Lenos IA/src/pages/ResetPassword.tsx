
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiLock, FiEye, FiAlertTriangle } from "react-icons/fi";
import { UserService } from "../api/user";
import "./style/ResetPassword.css";

const ResetPassword = () => {
    const [params] = useSearchParams();
    const token = params.get("token") || "";
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password.length < 8 || password.length > 20) return setError("A senha deve ter entre 8 e 20 caracteres.");
        if (password !== confirmation) return setError("As senhas não coincidem.");
        setLoading(true);
        setError("");
        try {
            await UserService.resetPassword({ token, password });
            setSuccess(true);
        } catch (requestError: unknown) {
            const response = (requestError as { response?: { data?: { message?: string; detail?: string } } }).response?.data;
            setError(response?.message || response?.detail || "Este link é inválido ou expirou.");
        } finally {
            setLoading(false);
        }
    };

        return <div className="page reset-page"><main className="reset-main">
                <Link to="/" className="auth-brand" aria-label="Lenos IA, página inicial">
                    <img className="official-brand-logo official-brand-logo--auth" src="/logo.png" alt="Lenos IA" />
                </Link>
        {!token ? <>
            <div className="auth-icon reset-alert"><FiAlertTriangle /></div>
            <h1>Link inválido</h1><h2>Este link de recuperação está ausente ou é inválido</h2>
            <div className="invalid-card">O link utilizado parece estar incompleto. Solicite um novo e-mail de recuperação.</div>
            <Link className="reset-link" to="/recuperacao-de-senha">Solicitar novo link</Link>
        </> : success ? <>
            <div className="auth-icon"><FiLock /></div><h1>Senha redefinida</h1><h2>Sua senha foi atualizada com sucesso.</h2>
            <Link className="reset-link" to="/login">Entrar</Link>
        </> : <>
            <div className="auth-icon"><FiLock /></div><h1>Redefinir senha</h1><h2>Escolha uma nova senha para sua conta</h2>
            <form className="reset-card" onSubmit={submit} noValidate>
                <label>Nova senha<input type={showPassword ? "text" : "password"} minLength={8} maxLength={20} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 8 caracteres" /></label>
                <label>Confirmar senha<input type={showPassword ? "text" : "password"} minLength={8} maxLength={20} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Repita sua senha" /></label>
                <button type="button" className="show-password" onClick={() => setShowPassword((visible) => !visible)}><FiEye /> {showPassword ? "Ocultar senhas" : "Mostrar senhas"}</button>
                {error && <small className="reset-error">{error}</small>}
                <button type="submit" className="reset-submit" disabled={loading}>{loading ? "Salvando..." : "Redefinir senha"}</button>
            </form>
        </>}
    </main></div>;
};

export default ResetPassword;