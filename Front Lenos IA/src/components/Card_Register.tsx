import { EMAIL_MAX_LENGTH } from '../utils/emailValidation';
import { logSafeError } from '../utils/safeLogger';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./style/Card_Register.css";
import { FiMail, FiPhone, FiUser, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { UserService } from "../api/user";
import { formatErrorMessage } from "../utils/errorMessage";
import { validatePassword, validatePasswordConfirmation } from "../utils/passwordValidation";

interface CardRegisterProps {
    name?: string;
    email?: string;
    phone?: string | number;
    password?: string;
    confirmation_password?: string;
    children?: React.ReactNode;
}

const phoneDigits = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.startsWith("55") && digits.length > 11 ? digits.slice(2, 13) : digits.slice(0, 11);
};

const formatPhone = (value: string) => {
    const digits = phoneDigits(value);
    if (!digits) return "";
    let formatted = "+55";
    if (digits.length >= 2) formatted += ` (${digits.slice(0, 2)}`;
    if (digits.length >= 2) formatted += ")";
    if (digits.length > 2) formatted += ` ${digits.slice(2, 7)}`;
    if (digits.length > 7) formatted += `-${digits.slice(7, 11)}`;
    return formatted;
};

const Card_Register: React.FC<CardRegisterProps> = ({
    name: initialName = "",
    email: initialEmail = "",
    phone: initialPhone = "",
    password: initialPassword = "",
    confirmation_password: initialConfirmation = ""
}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: initialName,
        email: initialEmail,
        phone: formatPhone(String(initialPhone || "")),
        password: initialPassword,
        confirmation_password: initialConfirmation,
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);

    const validateField = (field: string, value: string): string => {
        if (field === "name") {
            if (!value.trim()) return "Informe seu nome completo.";
            if (value.trim().length < 3) return "Informe seu nome completo (pelo menos 3 caracteres).";
            if (value.length > 50) return "O nome deve ter no máximo 50 caracteres.";
        }
        if (field === "email") {
            if (!value.trim()) return "Informe seu e-mail.";
            if (value.length > EMAIL_MAX_LENGTH) return "O e-mail deve ter no máximo 200 caracteres.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Informe um e-mail válido (ex: seuemail@dominio.com).";
        }
        if (field === "phone") {
            if (!value) return "Informe seu telefone com DDD e 9 dígitos.";
            const digits = phoneDigits(value);
            if (digits.length !== 11) return "Informe um telefone válido com DDD e 9 dígitos.";
        }
        if (field === "password") {
            return validatePassword(value);
        }
        if (field === "confirmation_password") {
            return validatePasswordConfirmation(formData.password, value);
        }
        return "";
    };

    const updateField = (field: keyof typeof formData, value: string) => {
        const nextValue = field === "phone" ? phoneDigits(value) : value;
        const nextData = { ...formData, [field]: nextValue };
        setFormData(nextData);
        setErrors((current) => ({
            ...current,
            [field]: validateField(field, nextValue),
            ...(field === "password" ? { confirmation_password: validateField("confirmation_password", nextData.confirmation_password) } : {}),
        }));
        setServerError("");
    };

    const validateForm = (): boolean => {
        const nextErrors = {
            name: validateField("name", formData.name),
            email: validateField("email", formData.email),
            phone: validateField("phone", formData.phone),
            password: validateField("password", formData.password),
            confirmation_password: validateField("confirmation_password", formData.confirmation_password),
            terms: termsAccepted ? "" : "Aceite os Termos de Uso e Política de Privacidade para continuar.",
        };
        setErrors(nextErrors);
        return Object.values(nextErrors).every((error) => !error);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setServerError("");

        try {
            await UserService.registerUser({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone ? `+55${phoneDigits(formData.phone)}` : "",
                password: formData.password,
                terms_accepted: termsAccepted,
            });

            // Redireciona somente após o backend confirmar criação com sucesso
            navigate("/email-confirmation");
        } catch (error: unknown) {
            logSafeError("Registration Error:", error);
            const isTimeout = axios.isAxiosError(error)
                && (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT");
            const isServiceUnavailable = axios.isAxiosError(error)
                && error.response?.status === 502;
            const formattedMessage = formatErrorMessage(error, "Não foi possível criar sua conta. Tente novamente.");
            const msg = isTimeout
                ? "O servidor demorou a responder. Seu cadastro pode ter sido processado; confira seu e-mail ou tente entrar antes de enviar outro cadastro."
                : isServiceUnavailable && formattedMessage === "Erro interno no servidor. Por favor, tente novamente mais tarde."
                    ? "O serviço de cadastro está indisponível (502). Confira seu e-mail ou tente entrar antes de reenviar, pois o servidor pode ter processado a solicitação."
                    : formattedMessage;
            setServerError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card_register">
            <form onSubmit={handleSubmit} noValidate>
                {/* Nome Completo */}
                <div className="card">
                    <h3>Nome completo <span>*</span></h3>
                    <label className={errors.name ? "has-error" : ""}>
                        <FiUser aria-hidden="true" />
                        <input
                            type="text"
                            minLength={3}
                            maxLength={50}
                            value={formData.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Seu nome completo"
                            disabled={isSubmitting}
                        />
                    </label>
                    {errors.name && <small className="field-error">{errors.name}</small>}
                </div>

                {/* E-mail */}
                <div className="card">
                    <h3>E-mail <span>*</span></h3>
                    <label className={errors.email ? "has-error" : ""}>
                        <FiMail aria-hidden="true" />
                        <input
                            type="email"
                            maxLength={EMAIL_MAX_LENGTH}
                            value={formData.email}
                            onChange={(event) => updateField("email", event.target.value)}
                            placeholder="voce@email.com"
                            disabled={isSubmitting}
                        />
                    </label>
                    {errors.email && <small className="field-error">{errors.email}</small>}
                </div>

                {/* Telefone */}
                <div className="card">
                    <h3>Telefone <span>*</span></h3>
                    <label className={errors.phone ? "has-error" : ""}>
                        <FiPhone aria-hidden="true" />
                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={20}
                            value={isPhoneFocused ? formData.phone : formatPhone(formData.phone)}
                            onFocus={() => setIsPhoneFocused(true)}
                            onBlur={() => setIsPhoneFocused(false)}
                            onChange={(event) => updateField("phone", event.target.value)}
                            placeholder="(00) 00000-0000"
                            disabled={isSubmitting}
                        />
                    </label>
                    {errors.phone && <small className="field-error">{errors.phone}</small>}
                </div>

                {/* Senha */}
                <div className="card">
                    <h3>Senha <span>*</span></h3>
                    <label className={errors.password ? "has-error" : ""}>
                        <FiLock aria-hidden="true" />
                        <input
                            type={showPassword ? "text" : "password"}
                            minLength={8}
                            maxLength={20}
                            value={formData.password}
                            onChange={(event) => updateField("password", event.target.value)}
                            placeholder="Entre 8 e 20 caracteres"
                            disabled={isSubmitting}
                        />
                    </label>
                    {errors.password && <small className="field-error">{errors.password}</small>}
                </div>

                {/* Confirmar Senha */}
                <div className="card">
                    <h3>Confirmar senha <span>*</span></h3>
                    <label className={errors.confirmation_password ? "has-error" : ""}>
                        <FiLock aria-hidden="true" />
                        <input
                            type={showPassword ? "text" : "password"}
                            minLength={8}
                            maxLength={20}
                            value={formData.confirmation_password}
                            onChange={(event) => updateField("confirmation_password", event.target.value)}
                            placeholder="Repita sua senha"
                            disabled={isSubmitting}
                        />
                        <button
                            type="button"
                            className="password-eye-btn"
                            onClick={() => setShowPassword((visible) => !visible)}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </label>
                    {errors.confirmation_password && <small className="field-error">{errors.confirmation_password}</small>}
                </div>

                {/* Aceite de Termos */}
                <div className="aceppt_terms">
                    <input
                        type="checkbox"
                        id="register-terms"
                        checked={termsAccepted}
                        onChange={(event) => {
                            setTermsAccepted(event.target.checked);
                            setErrors((current) => ({
                                ...current,
                                terms: event.target.checked ? "" : "Aceite os Termos de Uso e Política de Privacidade para continuar."
                            }));
                        }}
                    />
                    <label htmlFor="register-terms">
                        Eu aceito os <a href="/policies-and-terms" target="_blank" rel="noopener noreferrer">Termos de Uso</a> e a <a href="/policies-and-terms" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.
                    </label>
                </div>
                {errors.terms && <small className="field-error terms-error">{errors.terms}</small>}

                {/* Mensagem de Erro do Servidor */}
                {serverError && (
                    <div className="server-error-box" role="alert">
                        {serverError}
                    </div>
                )}

                {/* Botão Submit */}
                <button type="submit" className="register-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <FiLoader className="spin-icon" /> Criando conta...
                        </>
                    ) : (
                        "Criar conta"
                    )}
                </button>
            </form>
        </div>
    );
};

export default Card_Register;
