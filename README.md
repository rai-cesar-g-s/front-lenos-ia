# Lenos IA

O Lenos IA ajuda criadores de conteúdo a entender o que o público diz sobre seus vídeos no YouTube. A plataforma organiza os comentários analisados em relatórios com indicadores de sentimento, temas recorrentes e recomendações.

Este repositório contém o **front-end** da plataforma. A interface apresenta os dados e os resultados; o processamento dos comentários e a geração dos relatórios acontecem no backend.

[Acessar o Lenos IA](https://app.lenos-ia.com.br/)

## O que você pode fazer

- **Analisar um vídeo:** conectar a conta do YouTube, informar o link e acompanhar a geração do relatório.
- **Entender os resultados:** consultar o resumo executivo, a distribuição de comentários positivos, neutros e negativos, os temas recorrentes e as recomendações.
- **Consultar o histórico:** filtrar os relatórios por período e status, abrir detalhes e baixar o PDF.
- **Gerenciar a conta:** atualizar o perfil, acompanhar a cota e usar os fluxos de recuperação de senha e confirmação de e-mail.
- **Escolher o tema:** alternar entre claro e escuro em uma interface responsiva.

## Tecnologias e arquitetura

| Tecnologia | Uso |
| --- | --- |
| React e TypeScript | Componentes, estado e tipagem da interface e dos dados |
| Vite | Servidor de desenvolvimento e build da aplicação |
| React Router | Navegação entre páginas públicas e privadas |
| Axios | Requisições HTTP por meio de um cliente compartilhado |
| React Markdown e Remark GFM | Apresentação dos textos e tabelas dos relatórios |
| React Icons e CSS | Ícones, layout responsivo e temas |
| ESLint e Node Test Runner | Verificação do código e testes automatizados |

O front-end é uma **aplicação de página única (SPA)**. Em um fluxo típico, a página aciona um hook, o hook chama um serviço em `src/api/` e o serviço usa o cliente HTTP compartilhado. A interface recebe o resultado e apresenta os estados de carregamento, sucesso ou erro.

O modal de relatório usa componentes para organizar os indicadores e seções de conteúdo. A miniatura e o link do vídeo são montados a partir do identificador do YouTube. Os percentuais de sentimento são calculados a partir das contagens retornadas; o PDF é fornecido pelo backend.

## Estrutura do projeto

O código da aplicação fica na pasta [Front Lenos IA](Front%20Lenos%20IA/). Os caminhos da tabela abaixo são relativos a essa pasta.

| Caminho dentro da pasta da aplicação | Responsabilidade |
| --- | --- |
| `src/pages/` | Telas como análise, dashboard, histórico e configurações |
| `src/components/` | Navegação, formulários, filtros e modais |
| `src/routes/` e `src/context/` | Navegação e estado de autenticação |
| `src/hooks/` | Fluxos de tela, carregamento de dados e ações |
| `src/api/` e `src/utils/` | Serviços HTTP, validação, formatação e métricas |
| `src/assets/` e `public/` | Recursos visuais e arquivos estáticos |
| `tests/` | Testes de fluxos, filtros, validações e relatórios |

## Desenvolvimento local

Use **Node.js 24** e **npm**. A partir da raiz do repositório:

```sh
cd "Front Lenos IA"
npm ci
```

Crie o arquivo `.env` na pasta da aplicação seguindo a estrutura de `.env.example`. A variável `VITE_API_URL` define o endereço do backend autorizado para o seu ambiente. O `.env` é ignorado pelo Git, e variáveis `VITE_*` são públicas no navegador: use-as apenas para configuração pública.

```sh
npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run build` | Verifica os tipos e gera o build em `dist/` |
| `npm run preview` | Serve o build localmente para conferência |
| `npm run lint` | Executa a análise estática |
| `node --test tests/*.test.mjs tests/*.test.cjs` | Executa a suíte de testes |

## Publicação e manutenção

A aplicação é publicada na Vercel. O diretório raiz do projeto é `Front Lenos IA`. Antes de abrir uma alteração, rode o build e os testes relevantes e verifique a interface nas larguras afetadas.

Ao relatar problemas, descreva o comportamento esperado, o que aconteceu e como reproduzir, usando dados fictícios. Para questões de segurança, prefira um canal privado e não publique credenciais, tokens ou dados de usuários.
