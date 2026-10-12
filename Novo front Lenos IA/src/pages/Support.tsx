import React, { useState } from 'react';
import { FiMail, FiHelpCircle, FiSend, FiMail as FiMailStatus, FiCopy } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import './style/Support.css';

const SUPPORT_EMAIL = 'suporte@lenosia.com';

export const Support: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [nameDraft, setName] = useState<string | null>(null);
  const [emailDraft, setEmail] = useState<string | null>(null);
  const name = nameDraft ?? (typeof user?.name === 'string' && user.name !== 'Carregando...' ? user.name : '');
  const email = emailDraft ?? (typeof user?.email === 'string' ? user.email : '');
  const [subject, setSubject] = useState(() => searchParams.get('assunto') || '');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [copyFeedback, setCopyFeedback] = useState('');
  const [formError, setFormError] = useState('');
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopyFeedback('Endereço copiado. Cole no destinatário do seu e-mail.');
    } catch {
      setCopyFeedback('Não foi possível copiar automaticamente. Selecione e copie o endereço acima.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitted(false);
    if (!name.trim() || !subject.trim() || message.trim().length < 10) {
      setFormError('Informe seu nome, o assunto e uma mensagem com pelo menos 10 caracteres.');
      return;
    }
    const content = [name, subject, message].join(' ');
    const hasControlCharacters = Array.from(content).some(character => {
      const code = character.charCodeAt(0);
      return (code < 32 && ![9, 10, 13].includes(code)) || code === 127;
    });
    if (/(?:https?:\/\/|www\.|(?:javascript|data|file|mailto):|\b[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.(?:com|org|net|br|io|dev|app|gov|edu)\b)/i.test(content) || hasControlCharacters || /[\r\n]/.test(subject)) {
      setFormError('Envie apenas texto, sem links ou caracteres de controle. Descreva a tela e o erro sem incluir endereços de sites.');
      return;
    }
    if (message.trim()) {
      const body = [`Nome: ${name.trim()}`, `E-mail de contato: ${email.trim()}`, '', message.trim()].join('\n');
      const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setIsSubmitted(true);
    }
  };

  return (
    <div className="page support-public-page">
      <Header />
      <main className="support-page-content">
        <div className="page-heading">
          <h1>Suporte</h1>
          <p>Estamos aqui para ajudar. Escolha a melhor forma de contato.</p>
        </div>

      <div className="support-cards-grid">
        <div className="support-card-item">
          <div className="support-icon-wrapper">
            <FiMail />
          </div>
          <div className="support-card-content">
            <h3>E-mail</h3>
            <p>Entre em contato pelo seu aplicativo de e-mail.</p>
            <a className="support-contact-detail" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            <button type="button" className="support-copy-btn" onClick={copyAddress}><FiCopy aria-hidden="true" /> Copiar endereço</button>
            {copyFeedback && <p className="support-copy-feedback" role="status">{copyFeedback}</p>}
          </div>
        </div>

        <div className="support-card-item">
          <div className="support-icon-wrapper">
            <FiHelpCircle />
          </div>
          <div className="support-card-content">
            <h3>Central de ajuda</h3>
            <p>Perguntas e respostas sobre a plataforma</p>
            <Link className="support-contact-detail" to="/faq">Acesse a base de conhecimento</Link>
          </div>
        </div>
      </div>

      {/* Message Form Box */}
      <section className="support-form-panel">
        <h2>Envie uma mensagem</h2>
        <p className="form-panel-desc">Preencha os campos para abrir seu aplicativo de e-mail com a mensagem pronta. Revise e confirme o envio nele.</p>

        <p className="support-safety-notice" id="support-safety-notice">Envie apenas texto, sem links, anexos ou códigos executáveis. Não inclua senhas, códigos de verificação, tokens, dados bancários ou informações sensíveis. Nosso suporte nunca solicita sua senha.</p>
        <p className="support-safety-notice">Atualmente, não realizamos alterações de conta por e-mail ou outros canais externos. Utilize as funções disponíveis na plataforma autenticada. <Link to="/policies-and-terms">Consulte os Termos e a Política de Privacidade.</Link></p>
        <form aria-describedby="support-safety-notice" onSubmit={handleSubmit} className="support-form">
            <div className="support-field">
              <label htmlFor="support-name">Nome</label>
              <input
                id="support-name"
                maxLength={50}
                autoComplete="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="support-field">
              <label htmlFor="support-email">E-mail de contato</label>
              <input
                id="support-email"
                maxLength={200}
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="support-field">
              <label htmlFor="support-subject">Assunto</label>
              <input
                id="support-subject"
                maxLength={100}
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Como podemos ajudar?"
                required
              />
            </div>

            <div className="support-field">
              <label htmlFor="support-message">Mensagem</label>
              <textarea
                id="support-message"
                maxLength={1000}
                aria-describedby="support-message-hint"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva sua dúvida ou problema..."
                rows={6}
                minLength={10}
                required
              />
              <small id="support-message-hint">{message.length}/1.000 caracteres · mínimo de 10</small>
            </div>

            {formError && <p className="support-form-error" role="alert">{formError}</p>}
            <button type="submit" className="send-support-btn">
              <FiSend aria-hidden="true" /> Abrir e-mail para enviar
            </button>
          </form>

        {isSubmitted && (
          <div className="support-success-alert" role="status">
            <FiMailStatus className="success-icon" aria-hidden="true" />
            <div>
              <strong>Conclua o envio no seu aplicativo de e-mail</strong>
              <p>
                A abertura do aplicativo foi solicitada; isso não confirma o envio da mensagem. Se ele não abrir, copie o endereço acima e escreva para{' '}
                <a href="mailto:suporte@lenosia.com">suporte@lenosia.com</a>.
              </p>
            </div>
          </div>
        )}
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
