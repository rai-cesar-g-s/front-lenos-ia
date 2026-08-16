import React from "react";
import Card_Type_One from "../components/Card_Type_One";
import Card_Type_Two from "../components/Card_Type_Two";
import Footer from "../components/Footer"
import Header from "../components/Header"

const Home = () => {
  return(
  <div className="page">

    <Header/>

    <div className="top">
      <div className="message">
        <img></img>
        <p>Inteligência de audiência com IA</p>
      </div>
      <h1>Entenda o que sua audiência realmente pensa</h1>
      <h3>
        A Lenos IA transforma centenas de comentários do YouTUbe em insights
        claros - sentimentos, temas elogios, críticas e oportunidades - para
        você to,ar decisões com confiança.
      </h3>
      <div className="btn">
        <button>Começar agora</button>
        <button>Saber mais</button>
      </div>
    </div>

    <div className="middle">
      <div className="first">
        <h2>Como funciona</h2>
        <p>Três passos para transformar comentários em decisões</p>

        <Card_Type_One
          image=""
          step="Passo 1"
          title="Informe o vídeo"
          text="Cole o link de qualquer vídeo do YouTube. A Lenos IA válida e
              identifica o conteúdo automaticamente."
        />

        <Card_Type_One
          image=""
          step="Passo 2"
          title="A IA analisa"
          text="Nossa tecnlogia processa todos os comentários identificando
              sentimentos, temas e padrões que o olho humano não enxergaria."
        />

        <Card_Type_One
          image=""
          step="Passo 3"
          title="Receba o relatório"
          text="Acesse um relatório completo com insights, oportunidades e
              recomendações acionáveis para o seu conteúdo."
        />
      </div>

      <div className="second">
        <h2>O que você descobre</h2>
        <p>Informações que importam, sem ruído.</p>

        <Card_Type_Two
          image=""
          title="Análise de sentimento"
          text="Positivo, neutro e negativo - com porcentagens e quantidades reais."
        ></Card_Type_Two>

        <Card_Type_Two
          image=""
          title="Temas recorrentes"
          text="Os assuntos mais mencionados pela sua audiência, agrupados
            automaticamente."
        ></Card_Type_Two>

        <Card_Type_Two
          image=""
          title="Elogios"
          text="O que sua audiência mais valoriza no seu conteúdo."
        ></Card_Type_Two>

        <Card_Type_Two
          image=""
          title="Críticas"
          text="Pontos negativos recorrentes que precisam de atenção."
        ></Card_Type_Two>

        <Card_Type_Two
          image=""
          title="Insights e oportunidades"
          text="Interprtações e sugestões de novos contepudos baseados nos
            comentários."
        ></Card_Type_Two>

        <Card_Type_Two
          image=""
          title="Relatório exportável"
          text="Baixe e compartilhe o relatório completo em PDF com sua equipe."
        ></Card_Type_Two>
      </div>
    </div>

    <div className="bottom">
      <h2>Pronto para entender sua audiência?</h2>
      <p>Crie sua conta gratuita e analise seu primeiro vídeo em minutos.</p>
      <div className="btn">
        <button>Criar conta gratuita</button>
      </div>
    </div>

    <Footer/>
  </div>
  );
};

export default Home;
