import ThemeToggle from '../components/ThemeToggle';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiMail } from 'react-icons/fi';
import { UserService } from '../api/user';
import { formatErrorMessage } from '../utils/errorMessage';
import './style/ConfirmationEmail.css';

type ConfirmationStatus = 'notice' | 'pending' | 'success' | 'error';

const pendingVerifications = new Map<string, Promise<unknown>>();

const verifyEmailOnce = (token: string) => {
    const existingRequest = pendingVerifications.get(token);
    if (existingRequest) return existingRequest;

    const request = UserService.verify_email(token);
    pendingVerifications.set(token, request);
    const clearRequest = () => {
        if (pendingVerifications.get(token) === request) {
            pendingVerifications.delete(token);
        }
    };
    void request.then(clearRequest, clearRequest);

    return request;
};

const ConfirmationEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<ConfirmationStatus>(token ? 'pending' : 'notice');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('notice');
            setErrorMessage('');
            return;
        }

        let isActive = true;
        setStatus('pending');
        setErrorMessage('');

        verifyEmailOnce(token)
            .then(() => {
                if (isActive) setStatus('success');
            })
            .catch((error: unknown) => {
                if (!isActive) return;
                const message = axios.isAxiosError(error) && error.response?.status === 400
                    ? 'O link de confirmação é inválido ou expirou. Solicite um novo e-mail de confirmação.'
                    : formatErrorMessage(error, 'Não foi possível verificar o e-mail. Tente novamente mais tarde.');
                setErrorMessage(message);
                setStatus('error');
            });

        return () => {
            isActive = false;
        };
    }, [token]);

    const statusContent = {
        notice: {
            icon: <FiMail aria-hidden="true" />,
            title: 'Verifique seu e-mail',
            description: 'Enviamos um link de confirmação para o endereço informado no cadastro. Confira também a caixa de spam.',
        },
        pending: {
            icon: <FiLoader aria-hidden="true" />,
            title: 'Confirmando seu e-mail',
            description: 'Estamos validando o link. Isso deve levar apenas alguns instantes.',
        },
        success: {
            icon: <FiCheckCircle aria-hidden="true" />,
            title: 'E-mail confirmado',
            description: 'Sua conta foi ativada. Agora você já pode entrar na Lenos IA.',
        },
        error: {
            icon: <FiAlertCircle aria-hidden="true" />,
            title: 'Não foi possível confirmar',
            description: errorMessage || 'O link é inválido ou expirou. Solicite um novo e-mail de confirmação.',
        },
    }[status];

    return (
        <main className="confirmation-email-page">
            <section className="confirmation-email-card" aria-live="polite" aria-busy={status === 'pending'}>
                <div className="auth-theme-nav"><Link to="/" className="confirmation-brand" aria-label="Lenos IA, página inicial">
                    <img className="official-brand-logo official-brand-logo--auth" src="/logo.png" alt="Lenos IA" />
                </Link><ThemeToggle /></div>

                <div className={`confirmation-status-icon confirmation-status-${status}`}>
                    {statusContent.icon}
                </div>
                <h1 className="confirmation-title">{statusContent.title}</h1>
                <p className="confirmation-description">{statusContent.description}</p>

                {status !== 'pending' && (
                    <div className="confirmation-actions">
                        {status === 'success' ? (
                            <Link to="/login" className="confirmation-primary-action">Entrar na conta</Link>
                        ) : (
                            <Link to="/" className="confirmation-primary-action">Voltar ao início</Link>
                        )}
                        {status !== 'success' && (
                            <Link to="/login" className="confirmation-secondary-action">Ir para o login</Link>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
};

export default ConfirmationEmail;