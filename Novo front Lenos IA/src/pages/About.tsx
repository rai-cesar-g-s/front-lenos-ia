import React from "react";
import Card_Type_Two from "../components/Card_Type_Two";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Title_Page from "../components/Title_Page";
import Card_Type_Four from "../components/Card_Type_Four";

const About = () => {
  return (
    <div className="page">
      <Header />

      <Title_Page
        title="Sobre a Lenos IA"
        subtitle="ascemos de uma obsergvação simples: criadores de conteúdo e quipes e marketing produzem vídeos que geram milhares de comentários - mas quase ninguém consegue ler tudo. As melhores ideiass, críticas e oportunidades estão enterradas em meio ao volume."
      />

      <Card_Type_Two
        image=""
        title="Nossa missão"
        text="Transformar comentários despersos em decisões claras, democratizando o acesso à inteligência de audiência para qualquer criador ou equipe."
      />

      <Card_Type_Two
        image=""
        title="Nossa visão"
        text="Ser a plataforma de referência em compreensão de audiência, onde dados complexos se tornam informações simples e acionáveis."
      />

      <Card_Type_Two
        image=""
        title="Nossos valores"
        text="Clareza acima de complexidade. Transparência acima de caixa-preta. O usuário no centro de cada decisão de produto."
      />

      <Card_Type_Two
        image=""
        title="Para quem"
        text="Craidores de conteúdo, YouTubers, social media, analistas e euipes que precisam compreender a reação da audiência."
      />

      <Card_Type_Four
        title="Por que existimos"
        text="Vídeos com milhares de comentários tornam inviável a leitura manual. A
          Lenos IA utiliza Inteligência Artificial e Processamento de Linguagem
          Natural para ler, classificar e interpretar cada comentário -
          entregando a você o que realmente importa: o que sua audiência sentiu,
          pediu e sugeriu."
      />

      <Footer />
    </div>
  );
};

export default About;
