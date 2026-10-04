import {
  FiThumbsUp,
  FiThumbsDown,
  FiBarChart2,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';
import AppShell from '../components/AppShell';
import { useDashboard } from '../hooks/useDashboard';
import './style/Insights.css';

export const Insights: React.FC = () => {
  const { reports, reportsError, isLoadingReports } = useDashboard();
  const completedCount = reports.filter((report) => report.status === 'done' || report.status === 'completed').length;

  const topicsData = [
    { name: 'Qualidade do conteúdo', count: 824, percent: 85 },
    { name: 'Áudio e som', count: 574, percent: 60 },
    { name: 'Duração do vídeo', count: 396, percent: 40 },
    { name: 'Edição e cortes', count: 312, percent: 32 },
    { name: 'Pedidos de conteúdo', count: 268, percent: 27 },
    { name: 'Equipamentos', count: 120, percent: 12 },
  ];

  const highImpactInsights = [
    {
      title: 'Audiência altamente engajada e satisfeita',
      description:
        '70% dos comentários são positivos, indicando forte aprovação do conteúdo. A audiência demonstra conexão emocional com o canal e valoriza as explicações detalhadas.',
    },
    {
      title: 'Problema recorrente com qualidade de áudio',
      description:
        'A maior parte dos comentários negativos está relacionada à qualidade do áudio, especificamente ruído de fundo e volume irregular em transições.',
    },
    {
      title: 'Alta demanda por aprofundamento prático',
      description:
        '56% dos comentários solicitam exemplos práticos e tutoriais passo a passo aplicando os conceitos apresentados no vídeo.',
    },
  ];

  const contentOpportunities = [
    {
      title: 'Série de vídeos aprofundados',
      description:
        'Transforme os temas mais solicitados em uma série de conteúdo dedicado, atendendo diretamente o que a audiência pede.',
    },
    {
      title: 'Tutorial de equipamentos e setup',
      description:
        'O alto interesse em equipamentos sugere um vídeo dedicado ao setup utilizado, com alto potencial de engajamento e parcerias.',
    },
    {
      title: 'Conteúdo interativo com a audiência (Q&A)',
      description:
        'Use as dúvidas mais frequentes da aba de comentários como base para um vídeo de Q&A, fortalecendo a conexão com a comunidade.',
    },
    {
      title: 'Parcerias com especialistas',
      description:
        'Os pedidos por convidados especialistas abrem espaço para colaborações que enriquecem o conteúdo e ampliam o alcance do canal.',
    },
  ];

  return (
    <AppShell>
      <div className="page-heading">
        <h1>Insights globais</h1>
        <p>
          {reportsError
            ? reportsError
            : isLoadingReports
              ? 'Carregando suas análises...'
              : `Padrões e tendências identificados em ${completedCount} análises.`}
        </p>
      </div>

      {/* Top 3 Stat Cards matching mock */}
      <section className="insights-stats-grid">
        <div className="insight-stat-card positive">
          <div className="stat-card-icon pos">
            <FiThumbsUp />
          </div>
          <strong className="stat-card-num">63%</strong>
          <span className="stat-card-label">Sentimento positivo médio</span>
        </div>

        <div className="insight-stat-card total">
          <div className="stat-card-icon neut">
            <FiBarChart2 />
          </div>
          <strong className="stat-card-num">2.081</strong>
          <span className="stat-card-label">Comentários processados</span>
        </div>

        <div className="insight-stat-card negative">
          <div className="stat-card-icon neg">
            <FiThumbsDown />
          </div>
          <strong className="stat-card-num">22%</strong>
          <span className="stat-card-label">Sentimento negativo médio</span>
        </div>
      </section>

      {/* Middle Grid Section */}
      <div className="insights-middle-grid">
        {/* Recurrent Topics */}
        <section className="insights-panel topics-panel">
          <h2>Temas mais recorrentes</h2>
          <div className="topics-bars-list">
            {topicsData.map((topic, idx) => (
              <div key={idx} className="topic-bar-item">
                <div className="topic-bar-header">
                  <strong className="topic-title">{topic.name}</strong>
                  <span className="topic-comment-count">{topic.count} comentários</span>
                </div>
                <div className="topic-bar-bg">
                  <div
                    className="topic-bar-fill"
                    style={{ width: `${topic.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* High Impact Insights */}
        <section className="insights-panel impact-panel">
          <div className="panel-title-with-icon">
            <FiTrendingUp className="header-icon" />
            <h2>Insights de alto impacto</h2>
          </div>

          <div className="impact-cards-list">
            {highImpactInsights.map((insight, idx) => (
              <div key={idx} className="impact-card-item">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Content Opportunities Section */}
      <section className="insights-panel opportunities-panel">
        <div className="panel-title-with-icon">
          <FiZap className="header-icon" />
          <h2>Oportunidades de conteúdo</h2>
        </div>

        <div className="opportunities-grid">
          {contentOpportunities.map((opp, idx) => (
            <div key={idx} className="opportunity-card-item">
              <h4>{opp.title}</h4>
              <p>{opp.description}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

export default Insights;