import { useEffect, useState } from "react";
import Card_Type_One from "../components/Card_Type_One";
import Card_Type_Two from "../components/Card_Type_Two";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/Button";

// Estilização
import "./style/Home.css";

// Icons
import { BiSearch } from "react-icons/bi";
import { LuBrain } from "react-icons/lu";
import { MdOutlineAutoGraph } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiBarChart2, FiFileText, FiMessageSquare, FiSearch, FiYoutube } from "react-icons/fi";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { LuLightbulb } from "react-icons/lu";

const titleEndings = [
  "realmente pensa",
  "mais valoriza",
  "mais comenta",
  "espera",
];

const carouselIcons = [
  <FiYoutube />,
  <FiSearch />,
  <FiFileText />,
  <FiBarChart2 />,
];

const Home = () => {
  const [activeTitle, setActiveTitle] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const intervalId = window.setInterval(() => {
      setActiveTitle((currentTitle) => (currentTitle + 1) % titleEndings.length);
    }, 3800);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="page home-page">
      <Header />

      <main className="content">
        <div className="top">
          <div className="message">
            <span className="message-icon" aria-hidden="true">
              ✦
            </span>
            <p>Inteligência de audiência com IA</p>
          </div>
          <h1>
            Entenda o que sua audiência{" "}
            <span className="title-ending" key={activeTitle}>
              {titleEndings[activeTitle]}
            </span>
          </h1>
          <h3>
            A Lenos IA transforma centenas de comentários do YouTube em insights
            claros - sentimentos, temas, elogios, críticas e oportunidades - para
            você tomar decisões com confiança.
          </h3>
          <div className="buttons">
            <Button type={2} text="Começar agora" link="/cadastramento" />
            <Button type={1} text="Saber mais" link="/sobre" />
          </div>
        </div>

        <div className="middle">
          <div className="first">
            <h2>Como funciona</h2>
            <p>Três passos para transformar comentários em decisões</p>

            <div className="cards">
              <Card_Type_One
                image={<BiSearch />}
                step="Passo 1"
                title="Informe o vídeo"
                text="Cole o link de qualquer vídeo do YouTube. A Lenos IA valida e
              identifica o conteúdo automaticamente."
              />

              <Card_Type_One
                image={<LuBrain />}
                step="Passo 2"
                title="A IA analisa"
                text="Nossa tecnologia processa todos os comentários, identificando
              sentimentos, temas e padrões que o olho humano não enxergaria."
              />

              <Card_Type_One
                image={<IoDocumentTextOutline />}
                step="Passo 3"
                title="Receba o relatório"
                text="Acesse um relatório completo com insights, oportunidades e
              recomendações acionáveis para o seu conteúdo."
              />
            </div>

            <div className="youtube-marquee" aria-hidden="true">
              <div className="youtube-marquee-track">
                {Array.from({ length: 4 }, (_, group) => (
                  <div className="youtube-marquee-group" key={group}>
                    {carouselIcons.map((icon, iconIndex) => (
                      <span className="youtube-marquee-icon" key={iconIndex}>
                        {icon}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="second">
            <h2>O que você descobre</h2>
            <p>Informações que importam, sem ruído.</p>

            <Card_Type_Two
              image={<MdOutlineAutoGraph />}
              title="Análise de sentimento"
              text="Positivo, neutro e negativo - com porcentagens e quantidades reais."
            ></Card_Type_Two>

            <Card_Type_Two
              image={<FiMessageSquare />}
              title="Temas recorrentes"
              text="Os assuntos mais mencionados pela sua audiência, agrupados
            automaticamente."
            ></Card_Type_Two>

            <Card_Type_Two
              image={<BiLike />}
              title="Elogios"
              text="O que sua audiência mais valoriza no seu conteúdo."
            ></Card_Type_Two>

            <Card_Type_Two
              image={<BiDislike />}
              title="Críticas"
              text="Pontos negativos recorrentes que precisam de atenção."
            ></Card_Type_Two>

            <Card_Type_Two
              image={<LuLightbulb />}
              title="Insights e oportunidades"
              text="Interpretações e sugestões de novos conteúdos baseadas nos
            comentários."
            ></Card_Type_Two>

            <Card_Type_Two
              image={<IoDocumentTextOutline />}
              title="Relatório exportável"
              text="Baixe e compartilhe o relatório completo em PDF com sua equipe."
            ></Card_Type_Two>
          </div>
        </div>

        <div className="bottom">
          <h2>Pronto para entender sua audiência?</h2>
          <p>
            Crie sua conta gratuita e analise seu primeiro vídeo em minutos.
          </p>
          <Button text="Criar conta gratuita" type={1} link="/cadastramento" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
