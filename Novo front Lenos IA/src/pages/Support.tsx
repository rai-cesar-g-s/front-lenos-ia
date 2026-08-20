import React from 'react';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import Title_Page from "../components/Title_Page.tsx"
import Card_Type_Three from "../components/Card_Type_Three.tsx";
import Message from "../components/Message.tsx"

const Support = () =>{
    return (
        <div className="Page">
            <Header/>

            <Title_Page
                title="Suporte"
                subtitle="Estamos aqui para ajudar. Escolha a melhor forma de contato."
            />

            <Card_Type_Three
                image=""
                title="E-mail"
                subtitle="Resposta em até 24h"
                text="suporte@lenosia.com"
            />

            <Card_Type_Three
                image=""
                title="Chat"
                subtitle="Seg a Sex, 9h às 18h"
                text="Disponível no app"
            />

            <Message
                title="Envie uma mensagem"
                subtitle="Descreva sua dúvida ou problema. Respondemos por e-mail."
                name=""
                subject=""
                email=""
                message=""
            />

            <Footer/>
        </div>
    )
}

export default Support;
