import React, { useState, useMemo } from 'react';
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiArrowRight,
} from 'react-icons/fi';
import AppShell from '../components/AppShell';
import { useDashboard } from '../hooks/useDashboard';
import { ReportDetailModal, type ReportItem } from '../components/ReportDetailModal';
import './style/History.css';

export const History: React.FC = () => {
  const {
    reports,
    reportsError,
    isLoadingReports,
    renameReport,
    deleteReport,
    downloadReportPDF,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'done' | 'pending' | 'failed'
  const [selectedReportModal, setSelectedReportModal] = useState<ReportItem | null>(null);

  // Filter & Search Logic
  const filteredReports = useMemo(() => {
    return reports.filter((item: ReportItem) => {
        const titleMatch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());

        if (!titleMatch) return false;
        if (statusFilter === 'done') return item.status === 'done' || item.status === 'completed' || !item.status;
        if (statusFilter === 'pending') return item.status === 'pending';
        if (statusFilter === 'failed') return item.status === 'failed';
        return true;
      });
  }, [reports, searchTerm, statusFilter]);

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <AppShell>
      <div className="page-heading">
        <h1>Histórico de análises</h1>
        <p>Consulte e revise análises anteriores.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="history-controls-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título ou canal..."
          />
        </div>

        <div className="filter-group">
          <div className="select-wrapper">
            <FiFilter className="select-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos status</option>
              <option value="done">Concluídas</option>
              <option value="pending">Em processamento</option>
              <option value="failed">Falhas</option>
            </select>
          </div>

        </div>
      </div>

      {/* History List */}
      <div className="history-list-container">
        {isLoadingReports ? (
          <div className="history-loading">
            <p>Carregando histórico de relatórios...</p>
          </div>
        ) : reportsError ? (
          <div className="history-empty" role="alert">
            <h3>Falha ao carregar histórico</h3>
            <p>{reportsError}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="history-empty">
            <FiSearch className="empty-icon" />
            <h3>Nenhuma análise encontrada</h3>
            <p>Tente ajustar os filtros de busca ou inicie uma nova análise de vídeo.</p>
          </div>
        ) : (
          filteredReports.map((report: ReportItem) => {
            const ytId = getYouTubeId(report.video_url);
            const status = report.status?.toLowerCase();
            const isPending = status === 'pending' || status === 'processing';
            const isFailed = status === 'failed';
            const isCompleted = status === 'done' || status === 'completed';

            return (
              <div
                key={report.id}
                className="history-card-item"
                onClick={() => setSelectedReportModal(report)}
              >
                {ytId ? (
                  <img
                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                    alt={report.title}
                    className="history-thumb"
                  />
                ) : (
                  <div className="history-thumb-placeholder" aria-hidden="true"><FiSearch /></div>
                )}

                <div className="history-main-info">
                  <h3 className="history-title">{report.title || 'Análise sem título'}</h3>
                  <div className="history-meta">
                    <span className="channel-name">{report.status}</span>
                    <span className="meta-separator">·</span>
                    <span className="history-video-url">{report.video_url}</span>
                  </div>
                </div>

                <div className="history-badges-actions">
                  {isPending ? (
                    <span className="status-badge pending">
                      <FiClock /> Em fila
                    </span>
                  ) : isFailed ? (
                    <span className="status-badge failed">
                      <FiAlertCircle /> Erro
                    </span>
                  ) : isCompleted ? (
                    <span className="status-badge completed">
                      <FiCheckCircle /> Concluída
                    </span>
                  ) : (
                    <span className="status-badge">{report.status}</span>
                  )}

                  <FiArrowRight className="history-row-arrow" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedReportModal && (
        <ReportDetailModal
          report={selectedReportModal}
          onClose={() => setSelectedReportModal(null)}
          onRename={renameReport}
          onDelete={deleteReport}
          onDownloadPdf={downloadReportPDF}
        />
      )}
    </AppShell>
  );
};

export default History;