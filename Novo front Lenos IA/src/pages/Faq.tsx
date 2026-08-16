import React from "react";
import Header from "../components/Header";
import Card_Wrapper from "../components/Card_Wrapper";
import Footer from "../components/Footer";
import Title_Page from "../components/Title_Page";

const Faq = () => {
  return (
    <div className="page">
      <Header />

      <Title_Page
        title="Perguntas frequentes"
        subtitle="Tudo o que você precisa saber sobre a Lenos IA."
      />

      <Card_Wrapper
        title="Como a Lenos IA analisa os comentários?"
        text="Nossa tecnologia utiliza Inteligência Artificial e Processamento de Linguagem Natural para ler, classificar e interpretar cada comentário. O sistema identifica sentimentos, agrupa temas recorrentes e separa elogios, críticas, dúvidas e sugestões automaticamente."
      />

      <Card_Wrapper
        title="Preciso ter conhecimento técnico para usar?"
        text="Não. A interface foi desenhada para criadores de conteúdo e profissionais de marketing, sem exigir conhecimento em IA ou análise de dados. Tudo é traduzido em linguagem simples e acionável."
      />

      <Card_Wrapper
        title="Quantos comentários a Lenos IA consegue analisar?"
        text="Depende do seu plano. O plano gratuito analisa vídeos com até 500 comentários por análise. Planos pagos suportam até 50.000 comentários por análise."
      />

      <Card_Wrapper
        title="Posso exportar os relatórios?"
        text="Sim. Os planos Pro e Equipe incluem exportação de relatórios em PDF, permitindo compartilhar os resultados com sua equipe."
      />

      <Card_Wrapper
        title="A análise é em tempo real?"
        text="Após informar o vídeo, o processamento leva de alguns segundos a alguns minutos, dependendo do volume de comentários. Você acompanha cada etapa do processamento em tempo real."
      />

      <Card_Wrapper
        title="Meus dados estão seguros?"
        text="Sim. Apenas você tem acesso às suas análises. Não compartilhamos seus dados com terceiros. Você pode excluir sua conta e todos os dados associados a qualquer momento."
      />

      <Card_Wrapper
        title="Posso cancelar a minha assinatura?"
        text="Sim. Você pode cancelar a qualquer momento nas Configurações. Os benefícios do plano permanecem ativos até o fim do período já pago."
      />

      <Card_Wrapper
        title="Como funciona o período gratuito?"
        text="O plano gratuito permite até 5 análises por mês, com limite de 500 comentários por análise. Não é necessário cartão de crédito para começar."
      />

      <Footer />
    </div>
  );
};

export default Faq;
