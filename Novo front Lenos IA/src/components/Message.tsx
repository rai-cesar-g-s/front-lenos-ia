import React from 'react';

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
        <div className="message">
            <h3>{title}</h3>
            <h4>{subtitle}</h4>

            <h5>Nome</h5>
            <label>{name}</label>
            
            <h5>E-mail</h5>
            <label>{email}</label>

            <h5>Assunto</h5>
            <label>{subject}</label>

            <h5>Mensagem</h5>
            <label>{message}</label>

            <div className="btn">
                <p>Enviar mensagem</p>
            </div>
            {children}

        </div>
    );
};


export default Message;