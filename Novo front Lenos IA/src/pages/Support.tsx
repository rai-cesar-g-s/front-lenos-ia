import React, { useEffect, useState } from 'react';
import { FiMail, FiHelpCircle, FiSend, FiCheckCircle } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import './style/Support.css';

export const Support: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState(
    typeof user?.name === 'string' && user.name !== 'Carregando...' ? user.name : '',
  );
  const [email, setEmail] = useState(typeof user?.email === 'string' ? user.email : '');
  const [subject, setSubject] = useState(() => {
    const requestedPlan = searchParams.get('plano');
    return searchParams.get('assunto') || (requestedPlan ? `Alteração do plano ${requestedPlan}` : '');
  });
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof user?.name === 'string' && user.name && user.name !== 'Carregando...') {
      setName((currentName) => currentName || user.name as string);
    }
    if (typeof user?.email === 'string' && user.email) {
      setEmail((currentEmail) => currentEmail || user.email as string);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const body = [`Nome: ${name}`, `E-mail: ${email}`, '', message].join('\n');
      const mailto = `mailto:suporte@lenosia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
            <p>Resposta em até 24h</p>
            <a className="support-contact-detail" href="mailto:suporte@lenosia.com">suporte@lenosia.com</a>
          </div>
        </div>

        <div className="support-card-item">
          <div className="support-icon-wrapper">
            <FiHelpCircle />
          </div>
          <div className="support-card-content">
            <h3>Central de ajuda</h3>
            <p>Artigos e tutoriais</p>
            <Link className="support-contact-detail" to="/faq">Acesse a base de conhecimento</Link>
          </div>
        </div>
      </div>

      {/* Message Form Box */}
      <section className="support-form-panel">
        <h2>Envie uma mensagem</h2>
        <p className="form-panel-desc">Descreva sua dúvida ou problema. Respondemos por e-mail.</p>

        <form onSubmit={handleSubmit} className="support-form">
            <div className="support-field">
              <label htmlFor="support-name">Nome</label>
              <input
                id="support-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="support-field">
              <label htmlFor="support-email">E-mail</label>
              <input
                id="support-email"
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva sua dúvida ou problema..."
                rows={6}
                minLength={10}
                required
              />
            </div>

            <button type="submit" className="send-support-btn">
              <FiSend aria-hidden="true" /> Preparar mensagem
            </button>
          </form>

        {isSubmitted && (
          <div className="support-success-alert" role="status">
            <FiCheckCircle className="success-icon" aria-hidden="true" />
            <div>
              <strong>Mensagem preparada para envio</strong>
              <p>
                Confirme o envio no seu aplicativo de e-mail. Se ele não abrir, escreva para{' '}
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
