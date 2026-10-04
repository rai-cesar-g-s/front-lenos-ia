import React from 'react';
import "./style/Message.css";

interface MessageProps {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    children?: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({title, subtitle, name, email, subject, message, children}) => {
    return (
        <div className="message support-form">
            <h3>{title}</h3>
            <h4>{subtitle}</h4>

            <h5>Nome</h5>
            <input placeholder={name || "Seu nome"} aria-label="Nome" />
            
            <h5>E-mail</h5>
            <input type="email" placeholder={email || "seu@email.com"} aria-label="E-mail" />

            <h5>Assunto</h5>
            <input placeholder={subject || "Como podemos ajudar?"} aria-label="Assunto" />

            <h5>Mensagem</h5>
            <textarea placeholder={message || "Descreva sua dúvida ou problema..."} aria-label="Mensagem" />

            <div className="btn">
                <p>Enviar mensagem</p>
            </div>
            {children}

        </div>
    );
};


export default Message;