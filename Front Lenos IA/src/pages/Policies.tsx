import { useState } from "react";
import Header from "../components/Header.tsx";
import Title_Page_Left from "../components/Title_Page_Left.tsx";
import Section from "../components/Section.tsx";
import Terms from "../components/Terms.tsx";
import Footer from "../components/Footer.tsx";

// Estilização
import "./style/Policies.css";

// Icons
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuShield } from "react-icons/lu";

const Policies = () => {
  const [activePolicy, setActivePolicy] = useState<"terms" | "privacy">("terms");

  return (
    <div className="page policies-page">
      <Header />
      
      <main className="content">

        <Title_Page_Left
          title="Políticas"
          subtitle="Transparência em como tratamos seu uso e seus dados."
        />

        <div className="policy-tabs" role="tablist" aria-label="Documentos legais">
          <button
            className={activePolicy === "terms" ? "active" : ""}
            onClick={() => setActivePolicy("terms")}
            role="tab"
            aria-selected={activePolicy === "terms"}
          >
            <IoDocumentTextOutline />
            Termos de Uso
          </button>
          <button
            className={activePolicy === "privacy" ? "active" : ""}
            onClick={() => setActivePolicy("privacy")}
            role="tab"
            aria-selected={activePolicy === "privacy"}
          >
            <LuShield />
            Política de Privacidade
          </button>
        </div>

        {activePolicy === "terms" && <Section
          image={<IoDocumentTextOutline />}
          title="Termos de Uso"
          update="Última atualização: 11 de outubro de 2026. Estes documentos podem ser atualizados periodicamente."
        >
          <Terms
            title="1. Aceitação dos termos"
            description="Ao utilizar a Lenos IA, você concorda com estes Termos de Uso. Se não concordar, não utilize a plataforma."
          />

          <Terms
            title="2. Descrição do serviço"
            description="A Lenos IA é uma prova de conceito acadêmica que utiliza IA para analisar uma amostra de comentários. Seus autores são responsáveis pelo projeto e por seus aspectos legais e éticos. Não há previsão atual de comercialização. Os testes destinam-se aos criadores e, excepcionalmente, a participantes convidados."
          />

          <Terms
            title="3. Responsabilidades do usuário"
            description="Você é responsável pela precisão das URLs fornecidas e pelo uso adequado dos relatórios gerados. É proibido utilizar a plataforma para fins ilegais."
          />

          <Terms
            title="4. Limites de uso"
            description="A modalidade gratuita permite até cinco análises concluídas por mês e até 200 comentários por análise. Apenas o status done consome a cota; análises pendentes ou com falha não contam. A exclusão de um relatório concluído não devolve a cota. O limite de solicitações não garante um prazo de processamento."
          />

          <Terms
            title="5. Propriedade intelectual"
            description="A tecnologia, marcas e conteúdos da Lenos IA são protegidos por direitos autorais. Os relatórios gerados pertencem ao usuário que os solicitou."
          />
          <Terms
            title="6. Atendimento por e-mail"
            description="O suporte atual é destinado a dúvidas, orientações e relatos de problemas. Na página de Suporte, o formulário prepara a mensagem e solicita a abertura do aplicativo de e-mail do usuário. O usuário deve revisar e confirmar o envio nesse aplicativo. A abertura não comprova envio ou recebimento e depende da configuração do dispositivo. O endereço também pode ser copiado para envio manual. Não há protocolo automático, prazo fixo de resposta ou atendimento 24 horas estabelecido."
          />

          <Terms
            title="7. Conteúdo das mensagens de suporte"
            description="Envie somente texto pertinente ao atendimento. Não envie links, anexos, códigos executáveis, senhas, códigos de verificação, tokens de acesso, dados bancários ou outras informações sensíveis. O suporte nunca solicita senhas ou códigos de autenticação. Respeite os limites do formulário: nome até 50 caracteres, e-mail até 200, assunto até 100 e mensagem entre 10 e 1.000 caracteres. Ao finalizar o envio no aplicativo de e-mail, mantenha essas orientações."
          />

          <Terms
            title="8. Solicitações de alterações e confirmação de identidade"
            description="Atualmente, não realizamos alterações de conta, e-mail, senha, canal vinculado ou dados cadastrais a partir de solicitações recebidas por e-mail ou qualquer outro canal externo. Utilize as funções disponíveis na plataforma autenticada. Solicitações externas de alteração dependerão da implementação de um procedimento seguro de autenticação e confirmação de identidade. O endereço do remetente ou informações sobre a conta não são, por si só, comprovação de identidade. Essa limitação não afasta os direitos legais dos titulares de dados."
          />
          <Terms
            title="9. Dados tratados no atendimento"
            description="O formulário de suporte utiliza nome, e-mail de contato, assunto e mensagem para preparar o e-mail no navegador. Ele não envia esse conteúdo ao servidor de suporte nem o registra em um sistema de chamados da Lenos IA. Ao concluir o envio no aplicativo de e-mail, os provedores envolvidos processam a comunicação e a empresa recebe seu conteúdo na caixa de suporte. As informações recebidas são utilizadas para compreender e responder à solicitação."
          />

          <Terms
            title="10. Privacidade e segurança das comunicações"
            description="Compartilhe somente as informações necessárias para descrever sua dúvida. Não envie links, anexos, senhas, códigos de verificação, tokens, dados bancários ou informações sensíveis suas ou de terceiros. Não há verificação de identidade pelo formulário público. Por isso, uma mensagem recebida não autoriza alterações na conta nem a divulgação de dados pessoais ou relatórios."
          />

          <Terms
            title="11. Solicitações de privacidade pelo suporte"
            description="O endereço exibido na página de Suporte pode ser utilizado para solicitar orientações sobre privacidade e o exercício de direitos sobre dados pessoais. Quando necessário, a resposta ou execução do pedido depende de verificação segura de identidade, sem solicitar senhas ou códigos de autenticação. A indisponibilidade de alterações de conta por canais externos não elimina os direitos previstos na legislação."
          />
          <Terms
            title="12. Inteligência artificial e participação nos testes"
            description="Utilizamos o Gemini 2.5 Flash-Lite, fornecido pelo Google. Os testes de análise destinam-se exclusivamente a adultos com 18 anos ou mais. A finalidade acadêmica não afasta as regras do Google e do YouTube, e a disponibilidade de cadastro não autoriza qualquer pessoa a participar dos testes. Os resultados são interpretações automáticas sujeitas a erros, não representam todos os comentários e devem ser avaliados no contexto. A Lenos IA não apresenta seus resultados como métricas oficiais do YouTube nem declara aprovação do projeto pelo Google."
          >
            <p><a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">Termos da API Gemini</a> e <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">Termos de Serviço do YouTube</a>.</p>
          </Terms>
        </Section>}

        {activePolicy === "privacy" && <Section
          image={<LuShield />}
          title="Política de Privacidade"
          update="Última atualização: 11 de outubro de 2026. Estes documentos podem ser atualizados periodicamente."
        >
          <Terms
            title="1. Dados coletados"
            description="O cadastro atual coleta nome, e-mail, telefone e senha, armazenada como hash. Também são tratados respostas sobre o canal, dados de conexão Google, tokens de autorização, dados dos vídeos, relatórios e registros técnicos. O telefone é mantido no cadastro, mas não oferece atualmente recuperação de acesso por telefone."
          />

          <Terms
            title="2. Uso dos dados"
            description="Tratamos os dados para autenticação, conexão ao canal, geração e consulta de relatórios e comunicações de conta no contexto da demonstração acadêmica. Não processamos pagamentos. As respostas iniciais sobre o canal ainda não personalizam a análise. O fluxo atual utiliza temporariamente os textos dos comentários, sem gravar comentários individuais ou a identificação dos comentaristas no banco. O próprio texto pode conter dados pessoais."
          />

          <Terms
            title="3. Compartilhamento"
            description="Os textos selecionados e as instruções de análise são enviados ao Google Gemini. Conforme a configuração informada pelos responsáveis, o projeto da API tem faturamento ativo: os termos do serviço pago preveem que prompts e respostas não sejam usados para melhorar os produtos do Google, mas permitem registros limitados para segurança e obrigações legais. Utilizamos Supabase para o banco PostgreSQL, Redis para cache, Vercel para hospedagem e logs e Resend para e-mails transacionais. Comunicações de suporte também passam pelos provedores de e-mail envolvidos. Esses serviços podem processar dados fora do Brasil, conforme sua infraestrutura e termos."
          />

          <Terms
            title="4. Segurança"
            description="O sistema utiliza autenticação e controle de acesso aos relatórios da conta. Os responsáveis técnicos administram a infraestrutura. Nenhum sistema oferece garantia absoluta de segurança; não inclua informações sensíveis nos comentários de teste ou nas mensagens de suporte."
          />

          <Terms
            title="5. Seus direitos"
            description="Utilize as funções disponíveis nas Configurações para consultar, corrigir ou excluir a conta. Para outras solicitações sobre dados pessoais, inclusive de comentaristas, contate o suporte sem enviar senhas ou documentos sensíveis. O atendimento poderá exigir verificação segura de identidade e não autoriza acesso a relatórios ou dados de outras pessoas. O fluxo atual não mantém uma associação entre comentaristas e relatórios."
          />

          <Terms
            title="6. Retenção"
            description="A exclusão da conta remove seus registros e os dados relacionados do banco principal. Caches, logs, mensagens e eventuais cópias mantidas pelos fornecedores estão sujeitos a procedimentos próprios e às suas regras de retenção; não prometemos eliminação instantânea de todos esses registros. PDFs baixados pelos usuários e comentários publicados no YouTube não são apagados por essa operação."
          />
          <Terms
            title="7. Revogação do acesso Google"
            description="Você pode remover o acesso da Lenos IA nas conexões de sua Conta Google. Essa ação revoga a autorização para novos acessos e é distinta da exclusão da conta na plataforma."
          >
            <p><a href="https://myaccount.google.com/connections" target="_blank" rel="noopener noreferrer">Gerenciar conexões da Conta Google</a> e <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade do Google</a>.</p>
          </Terms>
        </Section>}
      </main>

      <Footer />
    </div>
  );
};

export default Policies;
