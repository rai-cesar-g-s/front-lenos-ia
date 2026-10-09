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
    "category": "como-funciona",
    "title": "Como a Lenos IA analisa os comentários?",
    "text": "A Lenos IA utiliza inteligência artificial para interpretar uma amostra dos comentários do vídeo, identificar sentimentos e temas recorrentes e gerar um relatório sobre a percepção do público. Os resultados devem ser avaliados considerando o contexto do conteúdo."
  },
  {
    "category": "como-funciona",
    "title": "Preciso ter conhecimento técnico para usar?",
    "text": "Não. A plataforma apresenta as análises em linguagem acessível, sem exigir conhecimento em inteligência artificial ou análise de dados."
  },
  {
    "category": "como-funciona",
    "title": "O que preciso ter para gerar os relatórios?",
    "text": "Você precisa ter uma conta com e-mail confirmado na Lenos IA, vincular a conta Google que possui acesso ao seu canal do YouTube e informar o link de um vídeo público desse canal."
  },
  {
    "category": "como-funciona",
    "title": "Como posso melhorar a qualidade dos relatórios?",
    "text": "Responda corretamente às perguntas iniciais sobre seu canal e mantenha essas informações atualizadas em Configurações > Detalhes do canal. Elas ajudam a contextualizar a análise realizada pela inteligência artificial."
  },
  {
    "category": "como-funciona",
    "title": "Qual IA analisa os comentários? Ela é própria da Lenos IA?",
    "text": "O modelo utilizado para analisar os comentários é o Gemini 2.5 Flash-Lite, fornecido pelo Google. A Lenos IA prepara as instruções de análise e organiza os resultados nos relatórios."
  },
  {
    "category": "suporte",
    "title": "Como entro em contato com o suporte?",
    "text": "Acesse a página pública de Suporte, preencha os dados solicitados, informe o assunto e descreva sua dúvida ou problema. Clique em Abrir e-mail para enviar para solicitar a abertura do seu aplicativo com a mensagem preenchida. Revise o conteúdo e confirme o envio nele."
  },
  {
    "category": "analises",
    "title": "Quantos comentários a Lenos IA consegue analisar?",
    "text": "Atualmente, o único plano disponível é o gratuito, que permite até 5 análises por mês e até 200 comentários por análise. Isso corresponde a um máximo de 1.000 comentários mensais."
  },
  {
    "category": "analises",
    "title": "Posso analisar um vídeo com mais de 200 comentários?",
    "text": "Sim. O vídeo pode ter mais de 200 comentários, mas apenas uma amostra de até 200 será selecionada e processada em cada análise."
  },
  {
    "category": "analises",
    "title": "Como são escolhidos os comentários analisados?",
    "text": "Os comentários são selecionados de forma aleatória, respeitando o limite de até 200 comentários por análise."
  },
  {
    "category": "analises",
    "title": "O relatório inclui todos os comentários do vídeo?",
    "text": "Não. O relatório representa a amostra de comentários selecionada para aquela análise e não deve ser interpretado como uma avaliação de todos os comentários ou de toda a audiência do vídeo."
  },
  {
    "category": "analises",
    "title": "Posso analisar vídeos de outras pessoas ou canais?",
    "text": "Não. Atualmente, você pode gerar análises apenas de vídeos públicos pertencentes ao canal vinculado à sua conta."
  },
  {
    "category": "analises",
    "title": "Posso exportar os relatórios?",
    "text": "Sim. Você pode baixar seus relatórios em PDF, inclusive no plano gratuito."
  },
  {
    "category": "analises",
    "title": "Quanto tempo demora uma análise?",
    "text": "O tempo pode variar conforme a complexidade do vídeo, o tamanho dos comentários selecionados e a disponibilidade do serviço de inteligência artificial. A conexão com a internet também pode afetar o envio da solicitação e a visualização do resultado. Não há um prazo fixo para a conclusão."
  },
  {
    "category": "analises",
    "title": "O relatório se atualiza quando chegam novos comentários?",
    "text": "Não. O relatório considera os comentários coletados no momento da análise e não é atualizado automaticamente quando o vídeo recebe novos comentários."
  },
  {
    "category": "analises",
    "title": "Por que não consigo analisar um vídeo?",
    "text": "Verifique se o canal está vinculado à sua conta, se o vídeo é público e se há comentários disponíveis. Vídeos privados, comentários desativados ou excluídos, o limite mensal atingido e falhas de processamento podem impedir a análise."
  },
  {
    "category": "analises",
    "title": "A inteligência artificial pode interpretar um comentário incorretamente?",
    "text": "Sim. A IA pode interpretar incorretamente gírias, expressões específicas da comunidade, ironia, sarcasmo ou comentários ambíguos e sem contexto. Use o relatório como apoio e confira os comentários antes de tomar decisões."
  },
  {
    "category": "planos",
    "title": "Como funciona o plano gratuito?",
    "text": "O plano gratuito é o padrão para todas as contas e o único disponível atualmente. Ele permite até 5 análises por mês, com até 200 comentários por análise. Não é necessário cartão de crédito para começar."
  },
  {
    "category": "planos",
    "title": "Quando meu limite mensal é renovado?",
    "text": "Seu limite de análises é renovado no dia 1 de cada mês, independentemente da data em que você criou sua conta."
  },
  {
    "category": "planos",
    "title": "Uma análise que falhou consome meu limite?",
    "text": "Não. Apenas análises concluídas com sucesso, com status done (concluído), entram no cálculo da quota mensal de vídeos. Análises que falharam ou ainda estão em processamento não consomem essa quota."
  },
  {
    "category": "planos",
    "title": "Excluir um relatório devolve uma análise disponível?",
    "text": "Não. Excluir um relatório remove o item do seu histórico, mas não recupera a análise consumida nem aumenta seu limite disponível no mês."
  },
  {
    "category": "planos",
    "title": "Haverá planos pagos?",
    "text": "Há previsão de oferecer planos pagos com novos recursos e limites de uso. Ainda não há uma data de lançamento confirmada."
  },
  {
    "category": "planos",
    "title": "Quais recursos poderão ser adicionados futuramente?",
    "text": "Estamos avaliando os seguintes recursos:",
    "topics": [
      "Análise de comentários de outras redes sociais, como Instagram, Facebook e TikTok.",
      "Conexão de múltiplos canais e redes sociais.",
      "Ampliação da capacidade de análise de comentários.",
      "Suporte 24 horas na plataforma.",
      "Compartilhamento de relatórios com outros aplicativos e sistemas.",
      "Viabilidade de analisar vídeos privados."
    ],
    "note": "Essas possibilidades ainda não têm lançamento ou data confirmados."
  },
  {
    "category": "seguranca",
    "title": "Meus dados estão seguros?",
    "text": "A Lenos IA utiliza medidas de segurança para proteger o acesso à sua conta. Durante a análise, os comentários selecionados e as instruções preparadas pela Lenos IA são enviados ao Google para processamento. Consulte a Política de Privacidade para conhecer o tratamento dos dados. Você também pode solicitar a exclusão da conta em Configurações > Segurança."
  },
  {
    "category": "seguranca",
    "title": "Quais dados são enviados ao Google durante a análise?",
    "text": "São enviados os comentários selecionados e o prompt, ou seja, as instruções de análise preparadas pela Lenos IA. Esses dados são utilizados pelo serviço de inteligência artificial do Google para gerar o resultado."
  },
  {
    "category": "seguranca",
    "title": "Como excluo minha conta?",
    "text": "Entre na Lenos IA, acesse Configurações > Segurança e clique em Excluir conta. Leia o aviso e confirme a exclusão. Essa ação é permanente e exclui sua conta e os dados associados."
  },
{
  "category": "suporte",
  "title": "Clicar no botão do suporte já envia minha mensagem?",
  "text": "Não. O formulário apenas solicita a abertura do aplicativo de e-mail com a mensagem pronta. A Lenos IA não confirma o envio ou o recebimento nesse momento. Você precisa concluir o envio no seu aplicativo."
},
{
  "category": "suporte",
  "title": "O que faço se meu aplicativo de e-mail não abrir?",
  "text": "Use Copiar endereço na página de Suporte e cole o destinatário no aplicativo ou serviço de e-mail de sua preferência. Se a cópia automática falhar, selecione e copie o endereço exibido. O funcionamento da abertura depende da configuração do seu dispositivo."
},
{
  "category": "suporte",
  "title": "O que posso incluir na mensagem de suporte?",
  "text": "Envie apenas texto descrevendo a dúvida ou o problema, com seu nome, e-mail de contato e assunto. Não inclua links, anexos, códigos executáveis, senhas, códigos de verificação, tokens de acesso, dados bancários ou outras informações sensíveis. Para identificar um problema, descreva a tela e a mensagem de erro sem expor dados de outras pessoas."
},
{
  "category": "suporte",
  "title": "Quais são os limites do formulário de suporte?",
  "text": "O formulário aceita nome com até 50 caracteres, e-mail de contato com até 200, assunto com até 100 e mensagem entre 10 e 1.000 caracteres. Não há campo para anexos. As mesmas orientações de segurança devem ser respeitadas ao concluir o envio no aplicativo de e-mail."
},
{
  "category": "suporte",
  "title": "Posso pedir alterações na minha conta por e-mail?",
  "text": "Não. Atualmente, não realizamos alterações de conta, e-mail, senha, canal vinculado ou dados cadastrais por solicitações recebidas por e-mail ou qualquer outro canal externo. Use as funções disponíveis na plataforma autenticada. Pedidos externos de alteração só poderão ser atendidos quando houver um procedimento seguro de autenticação e confirmação de identidade."
},
{
  "category": "suporte",
  "title": "O suporte pode pedir minha senha ou um código de verificação?",
  "text": "Não. Nosso suporte nunca solicita senhas, códigos de verificação ou tokens de acesso. Não compartilhe essas informações, mesmo que a mensagem pareça ter sido enviada pela Lenos IA. Use o endereço exibido na página de Suporte para relatar contatos suspeitos, sem encaminhar informações sensíveis."
},
{
  "category": "suporte",
  "title": "Existe um prazo garantido para resposta do suporte?",
  "text": "Ainda não há prazo fixo ou atendimento 24 horas estabelecido. O contato é feito por e-mail e não gera um protocolo automático pela plataforma."
},
{
  "category": "suporte",
  "title": "O formulário de suporte armazena minha mensagem na plataforma?",
  "text": "O formulário atual não envia a mensagem ao servidor de suporte nem a salva em um sistema de chamados da Lenos IA. Ele prepara o conteúdo no navegador para o aplicativo de e-mail. Se você concluir o envio, a mensagem será processada pelos provedores de e-mail envolvidos e recebida na caixa de suporte da empresa."
},
{
  "category": "suporte",
  "title": "Como faço uma solicitação sobre privacidade e meus dados?",
  "text": "Você pode entrar em contato pelo endereço exibido na página de Suporte para pedir orientações sobre privacidade e seus dados. Não envie senhas ou documentos sensíveis. Receber a solicitação não autoriza alterações ou divulgação de dados: quando necessário, o atendimento dependerá de um procedimento seguro de verificação de identidade. As limitações do suporte não afastam os direitos previstos na legislação."
}
];

const faqCategories = [
  { id: "todos", label: "Todos os temas", icon: FiGrid },
  { id: "como-funciona", label: "Como funciona", icon: FiHelpCircle },
  { id: "analises", label: "Análises", icon: FiBarChart2 },
  { id: "planos", label: "Planos", icon: FiCreditCard },
  { id: "suporte", label: "Suporte", icon: FiHelpCircle },
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
            <Card_Dropdown key={item.title} title={item.title} text={item.text} topics={"topics" in item ? item.topics : undefined} note={"note" in item ? item.note : undefined} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faq;
