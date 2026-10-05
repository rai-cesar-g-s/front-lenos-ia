import { FiThumbsUp, FiThumbsDown, FiBarChart2 } from 'react-icons/fi';
import AppShell from '../components/AppShell';
import { useDashboard } from '../hooks/useDashboard';
import { getCommentPercentage, isCompletedReport } from '../utils/reportMetrics';
import './style/Insights.css';

export const Insights: React.FC = () => {
  const { reports, reportsError, isLoadingReports, totals } = useDashboard();
  const completed = reports.filter(isCompletedReport);
  const formatCount = (value: number | undefined) => isLoadingReports
    ? '...' : reportsError || value === undefined ? '—' : value.toLocaleString('pt-BR');

  const formatPercentage = (part: number | undefined) => {
    const percentage = getCommentPercentage(part, totals.comments);
    return isLoadingReports ? '...' : reportsError || percentage === undefined
      ? '—' : `${percentage.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
  };

  return (
    <AppShell>
      <div className="page-heading">
        <h1>Insights globais</h1>
        <p>{isLoadingReports ? 'Carregando suas análises...' : `Dados de ${totals.analyses} relatórios concluídos.`}</p>
      </div>
      <section className="insights-stats-grid">
        <div className="insight-stat-card positive">
          <div className="stat-card-icon pos"><FiThumbsUp /></div>
          <strong className="stat-card-num">{formatPercentage(totals.positive)}</strong>
          <span className="stat-card-label">Sentimento positivo ({formatCount(totals.positive)} comentários)</span>
        </div>
        <div className="insight-stat-card total">
          <div className="stat-card-icon neut"><FiBarChart2 /></div>
          <strong className="stat-card-num">{formatCount(totals.comments)}</strong>
          <span className="stat-card-label">Comentários processados</span>
        </div>
        <div className="insight-stat-card negative">
          <div className="stat-card-icon neg"><FiThumbsDown /></div>
          <strong className="stat-card-num">{formatPercentage(totals.negative)}</strong>
          <span className="stat-card-label">Sentimento negativo ({formatCount(totals.negative)} comentários)</span>
        </div>
      </section>
      <section className="insights-panel">
        <h2>Análises da sua audiência</h2>
        {reportsError ? <p role="alert">{reportsError}</p>
          : isLoadingReports ? <p>Carregando relatórios...</p>
          : completed.length === 0 ? <p>Você ainda não tem relatórios concluídos.</p>
          : completed.map(report => (
            <article className="impact-card-item" key={report.id}>
              <h4>{report.title || 'Análise de vídeo'}</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{report.report || 'Análise não fornecida pela API.'}</p>
            </article>
          ))}
      </section>
    </AppShell>
  );
};

export default Insights;
