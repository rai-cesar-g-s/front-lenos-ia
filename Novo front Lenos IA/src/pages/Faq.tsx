import { useState } from "react";
import { FiBarChart2, FiCreditCard, FiGrid, FiHelpCircle, FiShield } from "react-icons/fi";
import Header from "../components/Header";
import Card_Dropdown from "../components/Card_Wrapper";
import Footer from "../components/Footer";
import Title_Page_Left from "../components/Title_Page_Left";

// Estilização
import "./style/Faq.css";

const faqItems = [
  {
    category: "como-funciona",
    title: "Como a Lenos IA analisa os comentários?",
    text: "Nossa tecnologia utiliza Inteligência Artificial e Processamento de Linguagem Natural para ler, classificar e interpretar cada comentário. O sistema identifica sentimentos, agrupa temas recorrentes e separa elogios, críticas, dúvidas e sugestões automaticamente.",
  },
  {
    category: "como-funciona",
    title: "Preciso ter conhecimento técnico para usar?",
    text: "Não. A interface foi desenhada para criadores de conteúdo e profissionais de marketing, sem exigir conhecimento em IA ou análise de dados. Tudo é traduzido em linguagem simples e acionável.",
  },
  {
    category: "analises",
    title: "Quantos comentários a Lenos IA consegue analisar?",
    text: "Depende do seu plano. O plano gratuito analisa vídeos com até 500 comentários por análise. Planos pagos suportam até 50.000 comentários por análise.",
  },
  {
    category: "analises",
    title: "Posso exportar os relatórios?",
    text: "Sim. Os planos Pro e Equipe incluem exportação de relatórios em PDF, permitindo compartilhar os resultados com sua equipe.",
  },
  {
    category: "analises",
    title: "A análise é em tempo real?",
    text: "Após informar o vídeo, o processamento leva de alguns segundos a alguns minutos, dependendo do volume de comentários. Você acompanha cada etapa do processamento em tempo real.",
  },
  {
    category: "seguranca",
    title: "Meus dados estão seguros?",
    text: "Sim. Apenas você tem acesso às suas análises. Não compartilhamos seus dados com terceiros. Você pode excluir sua conta e todos os dados associados a qualquer momento.",
  },
  {
    category: "planos",
    title: "Posso cancelar a minha assinatura?",
    text: "Sim. Você pode cancelar a qualquer momento nas Configurações. Os benefícios do plano permanecem ativos até o fim do período já pago.",
  },
  {
    category: "planos",
    title: "Como funciona o período gratuito?",
    text: "O plano gratuito permite até 5 análises por mês, com limite de 500 comentários por análise. Não é necessário cartão de crédito para começar.",
  },
];

const faqCategories = [
  { id: "todos", label: "Todos os temas", icon: FiGrid },
  { id: "como-funciona", label: "Como funciona", icon: FiHelpCircle },
  { id: "analises", label: "Análises", icon: FiBarChart2 },
  { id: "planos", label: "Planos", icon: FiCreditCard },
  { id: "seguranca", label: "Privacidade", icon: FiShield },
];

const Faq = () => {
  const [activeCategory, setActiveCategory] = useState("todos");
  const visibleFaqs = faqItems.filter(
    (item) => activeCategory === "todos" || item.category === activeCategory,
  );

  return (
    <div className="page faq-page">
      <Header />

      <main className="content">
        <Title_Page_Left
          title="Perguntas frequentes"
          subtitle="Tudo o que você precisa saber sobre a Lenos IA."
        />

        <div className="faq-topic-filters" aria-label="Filtrar perguntas por tema">
          {faqCategories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={activeCategory === id ? "active" : ""}
              aria-pressed={activeCategory === id}
              onClick={() => setActiveCategory(id)}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="faq-questions" aria-live="polite">
          {visibleFaqs.map((item) => (
            <Card_Dropdown key={item.title} title={item.title} text={item.text} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faq;
