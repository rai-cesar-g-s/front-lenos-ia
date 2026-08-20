import React from "react";
import Header from "../components/Header.tsx";
import Title_Page from "../components/Title_Page.tsx";
import Section from "../components/Section.tsx";
import Terms from "../components/Terms.tsx"
import Footer from "../components/Footer.tsx"

const Policies = () => {
    return (
        <div className="page">

            <Header/>

            <Title_Page
            title="Políticas"
            subtitle="Transparência em como tratamos seu uso e seus dados."
            />

            <button>
                <img></img>
                <p>Termos de Uso</p>
            </button>

            <button>
                <img></img>
                <p>Política de Privacidade</p>
            </button>

            <Section
                img=""
                title="Termos de Uso"
                update="Última atualização: Agosto de 2026. Estes documentos podem ser atualizados periodicamente."
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

            </Section>

            <Section
                img=""
                title="Política de Privacidade"
                update="Última atualização: Agosto de 2026. Estes documentos podem ser atualizados periodicamente."
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
                    description="Não compartilhamos seus dados com terceiros, exceto quando necessário para processamento de pagamentos ou exigido por lei."
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
            </Section> 

            <Footer/>

        </div>
    );
};

export default Policies;