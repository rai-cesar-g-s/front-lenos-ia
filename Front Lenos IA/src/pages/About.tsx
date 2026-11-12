import Card_Type_Two from "../components/Card_Type_Two";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Title_Page_Left from "../components/Title_Page_Left";
import Card_Type_Four from "../components/Card_Type_Four";

// Estilização
import "./style/About.css";

// Icons
import { RxTarget } from "react-icons/rx";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import { RxPeople } from "react-icons/rx";

const About = () => {
  return (
    <div className="page about-page">
      <Header />
      <main className="content">
        <Title_Page_Left
          title="Sobre a Lenos IA"
          subtitle="Nascemos de uma observação simples: criadores de conteúdo e equipes de marketing produzem vídeos que geram milhares de comentários, mas quase ninguém consegue ler tudo. As melhores ideias, críticas e oportunidades ficam enterradas em meio ao volume."
        />

        <Card_Type_Two
          image={<RxTarget />}
          title="Nossa missão"
          text="Transformar comentários dispersos em decisões claras, democratizando o acesso à inteligência de audiência para qualquer criador ou equipe."
        />

        <Card_Type_Two
          image={<IoEyeOutline />}
          title="Nossa visão"
          text="Ser a plataforma de referência em compreensão de audiência, onde dados complexos se tornam informações simples e acionáveis."
        />

        <Card_Type_Two
          image={<IoIosHeartEmpty />}
          title="Nossos valores"
          text="Clareza acima de complexidade. Transparência acima de caixa-preta. O usuário no centro de cada decisão de produto."
        />

        <Card_Type_Two
          image={<RxPeople />}
          title="Para quem"
          text="Criadores de conteúdo, YouTubers, profissionais de social media, analistas e equipes que precisam compreender a reação da audiência."
        />

        <Card_Type_Four
          title="Por que existimos"
          text="Vídeos com milhares de comentários tornam inviável a leitura manual. A
          Lenos IA utiliza Inteligência Artificial e Processamento de Linguagem
          Natural para ler, classificar e interpretar cada comentário -
          entregando a você o que realmente importa: o que sua audiência sentiu,
          pediu e sugeriu."
        />
      </main>
      <Footer />
    </div>
  );
};

export default About;
