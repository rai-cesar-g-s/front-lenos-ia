import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBarChart2,
  FiMessageSquare,
  FiThumbsUp,
  FiThumbsDown,
  FiTrendingUp,
  FiArrowRight,
} from 'react-icons/fi';
import AppShell from '../components/AppShell';
import { useDashboard } from '../hooks/useDashboard';
import { getCommentPercentage } from '../utils/reportMetrics';
import { ReportDetailModal, type ReportItem } from '../components/ReportDetailModal';
import './style/Dashboard.css';
import Card_GoogleOAuth from '../components/Card_GoogleOAuth';
import GoogleWelcome from '../components/GoogleWelcome';
export const Dashboard: React.FC = () => {
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(Boolean(location.state?.showGoogleWelcome));
  const {
    user,
    reports,
    reportsError,
    totals,
    reloadReports,
    isLoadingReports,
    renameReport,
    deleteReport,
    downloadReportPDF,
  } = useDashboard();

  const [activeReportModal, setActiveReportModal] = useState<ReportItem | null>(null);

  const formatCount = (value: number | undefined) =>
    isLoadingReports ? '...' : reportsError || value === undefined ? '—' : value.toLocaleString('pt-BR');

  const formatPercentage = (part: number | undefined) => {
    const percentage = getCommentPercentage(part, totals.comments);
    return isLoadingReports ? '...' : reportsError || percentage === undefined
      ? '—' : `${percentage.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
  };

  const userName = typeof user?.name === 'string' ? user.name.trim() : '';

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <AppShell>
      <div className="page-heading">
        <h1>{userName ? `Olá, ${userName}` : 'Dashboard'}</h1>
        <p>Veja o que sua audiência está dizendo.</p>
      </div>

      {/* Report statistics */}
      <section className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Análises realizadas</span>
            <FiBarChart2 className="stat-icon" />
          </div>
          <strong className="stat-value">{formatCount(totals.analyses)}</strong>
          <span className="stat-subtext">0 este mês</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Comentários processados</span>
            <FiMessageSquare className="stat-icon" />
          </div>
          <strong className="stat-value">{formatCount(totals.comments)}</strong>
          <span className="stat-subtext">nos relatórios concluídos</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Sentimento positivo</span>
            <FiThumbsUp className="stat-icon" />
          </div>
          <strong className="stat-value">{formatPercentage(totals.positive)}</strong>
          <span className="stat-subtext">{formatCount(totals.positive)} comentários positivos</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Sentimento negativo</span>
            <FiThumbsDown className="stat-icon" />
          </div>
          <strong className="stat-value">{formatPercentage(totals.negative)}</strong>
          <span className="stat-subtext">{formatCount(totals.negative)} comentários negativos</span>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Uso do plano</span>
            <FiTrendingUp className="stat-icon" />
          </div>
          <div className="stat-value-group">
            <strong className="stat-value">{totals.analyses}</strong>
            <span className="stat-limit">/ 5</span>
          </div>
          <div className="usage-progress-bar">
            <div
              className="usage-progress-fill"
              style={{ width: `${Math.min(100, (totals.analyses / 5) * 100)}%` }}
            />
          </div>
          <span className="stat-subtext">análises este mês</span>
        </div>
      </section>

      {/* Content Columns */}
      <div className="dashboard-content-grid">
        {/* Left Panel: Recent Analyses */}
        <section className="dashboard-panel recent-panel">
          <div className="panel-header">
            <h2>Relatórios da sua conta</h2>
            <Link to="/historico" className="view-all-link">
              Ver todas <FiArrowRight />
            </Link>
          </div>

          {isLoadingReports ? (
            <div className="loading-state">
              <p>Carregando análises...</p>
            </div>
          ) : reportsError ? (
            <div className="dashboard-empty-state" role="alert">
              <p>{reportsError}</p>
              <button type="button" className="cta-btn secondary" onClick={() => void reloadReports()}>Tentar novamente</button>
            </div>
          ) : reports.length === 0 ? (
            <p className="dashboard-empty-state">Você ainda não tem análises.</p>
          ) : (
            <div className="reports-list">
              {reports.slice(0, 4).map((report: ReportItem) => {
                const ytId = getYouTubeId(report.video_url);

                return (
                  <div
                    className="report-row-card"
                    key={report.id}
                    onClick={() => setActiveReportModal(report)}
                  >
                    {ytId ? (
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt={report.title}
                        className="report-thumb"
                      />
                    ) : (
                      <div className="report-thumb-placeholder" aria-hidden="true"><FiBarChart2 /></div>
                    )}
                    <div className="report-info">
                      <strong>{report.title || 'Análise de vídeo'}</strong>
                    </div>
                    <div className="report-action-area">
                      <FiArrowRight className="row-arrow" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Panel: Call to Action */}
        <section className="dashboard-panel action-panel">
          <Card_GoogleOAuth />
        </section>
      </div>

      {showWelcome && <GoogleWelcome onClose={() => setShowWelcome(false)} />}

      {/* Report Modal */}
      {activeReportModal && (
        <ReportDetailModal
          report={activeReportModal}
          onClose={() => setActiveReportModal(null)}
          onRename={renameReport}
          onDelete={deleteReport}
          onDownloadPdf={downloadReportPDF}
        />
      )}
    </AppShell>
  );
};

export default Dashboard;
