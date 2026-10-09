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
          update="Última atualização: 6 de outubro de 2026. Estes documentos podem ser atualizados periodicamente."
        >
          <Terms
            title="1. Aceitação dos termos"
            description="Ao utilizar a Lenos IA, você concorda com estes Termos de Uso. Se não concordar, não utilize a plataforma."
          />

          <Terms
            title="2. Descrição do serviço"
            description="A Lenos IA é uma plataforma de análise de comentários do YouTube que utiliza Inteligência Artificial para gerar relatórios de inteligência de audiência."
          />

          <Terms
            title="3. Responsabilidades do usuário"
            description="Você é responsável pela precisão das URLs fornecidas e pelo uso adequado dos relatórios gerados. É proibido utilizar a plataforma para fins ilegais."
          />

          <Terms
            title="4. Limites de uso"
            description="O uso está sujeito aos limites do plano contratado. O uso excessivo ou abusivo pode resultar em restrições temporárias."
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
            title="7. Dados tratados no atendimento"
            description="O formulário de suporte utiliza nome, e-mail de contato, assunto e mensagem para preparar o e-mail no navegador. Ele não envia esse conteúdo ao servidor de suporte nem o registra em um sistema de chamados da Lenos IA. Ao concluir o envio no aplicativo de e-mail, os provedores envolvidos processam a comunicação e a empresa recebe seu conteúdo na caixa de suporte. As informações recebidas são utilizadas para compreender e responder à solicitação."
          />

          <Terms
            title="8. Privacidade e segurança das comunicações"
            description="Compartilhe somente as informações necessárias para descrever sua dúvida. Não envie links, anexos, senhas, códigos de verificação, tokens, dados bancários ou informações sensíveis suas ou de terceiros. Não há verificação de identidade pelo formulário público. Por isso, uma mensagem recebida não autoriza alterações na conta nem a divulgação de dados pessoais ou relatórios."
          />

          <Terms
            title="9. Solicitações de privacidade pelo suporte"
            description="O endereço exibido na página de Suporte pode ser utilizado para solicitar orientações sobre privacidade e o exercício de direitos sobre dados pessoais. Quando necessário, a resposta ou execução do pedido depende de verificação segura de identidade, sem solicitar senhas ou códigos de autenticação. A indisponibilidade de alterações de conta por canais externos não elimina os direitos previstos na legislação."
          />
        </Section>}

        {activePolicy === "privacy" && <Section
          image={<LuShield />}
          title="Política de Privacidade"
          update="Última atualização: 6 de outubro de 2026. Estes documentos podem ser atualizados periodicamente."
        >
          <Terms
            title="1. Dados coletados"
            description="Coletamos nome, e-mail, telefone (quando fornecido) e dados de uso da plataforma. Não solicitamos informações desnecessárias."
          />

          <Terms
            title="2. Uso dos dados"
            description="Utilizamos seus dados para fornecer e melhorar o serviço, processar pagamentos e enviar comunicações relevantes."
          />

          <Terms
            title="3. Compartilhamento"
            description="Durante as análises, os comentários selecionados e as instruções preparadas pela Lenos IA são enviados ao Google para processamento. As comunicações de suporte enviadas pelo usuário são processadas pelos provedores de e-mail envolvidos. Dados também podem ser fornecidos quando exigido por lei."
          />

          <Terms
            title="4. Segurança"
            description="Aplicamos medidas técnicas e organizacionais para proteger seus dados. Apenas você tem acesso às suas análises."
          />

          <Terms
            title="5. Seus direitos"
            description="Você pode acessar, corrigir ou excluir seus dados a qualquer momento nas Configurações da conta."
          />

          <Terms
            title="6. Retenção"
            description="Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão, os dados são removidos em até 30 dias."
          />
        </Section>}
      </main>

      <Footer />
    </div>
  );
};

export default Policies;