import { reportFilterOptions } from '../utils/reportStatus';
import type { ReportFilterStatus } from '../api/report';
import { ReportDateFilter } from '../components/ReportDateFilter';
import React, { useState } from 'react';
import {
  FiSearch,
  FiFilter,
  FiArrowRight,
} from 'react-icons/fi';
import { ReportRowTitle, ReportStatus } from '../components/ReportRowActions';
import AppShell from '../components/AppShell';
import { useDashboard } from '../hooks/useDashboard';
import { ReportDetailModal, type ReportItem } from '../components/ReportDetailModal';
import './style/History.css';

export const History: React.FC = () => {
  const {
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    reports,
    reportsError,
    isLoadingReports,
    renameReport,
    deleteReport,
    downloadReportPDF,
  } = useDashboard();

  const [selectedReportModal, setSelectedReportModal] = useState<ReportItem | null>(null);

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <AppShell>
      <div className="page-heading">
        <h1>Histórico de análises</h1>
        <p>Consulte e revise análises anteriores.</p>
      </div>

      <div className="history-filters-row">
      <ReportDateFilter range={dateRange} onApply={setDateRange} />

      {/* Rótulos em português; os valores do contrato são enviados à API. */}
      <div className="history-controls-bar">
        <div className="filter-group">
          <div className="select-wrapper">
            <FiFilter className="select-icon" />
            <select
              aria-label="Filtrar por status da análise"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReportFilterStatus | '')}
            >
              <option value="">Todos os status</option>
              {reportFilterOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>

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
        ) : reports.length === 0 ? (
          <div className="history-empty">
            <FiSearch className="empty-icon" />
            <h3>Nenhuma análise encontrada</h3>
            <p>Tente ajustar o período ou o status ou inicie uma nova análise de vídeo.</p>
          </div>
        ) : (
          reports.map((report: ReportItem) => {
            const ytId = getYouTubeId(report.video_url);

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
                  <ReportRowTitle report={report} onRename={renameReport} />
                  <div className="history-meta">
                    <span className="history-video-url">{report.video_url}</span>
                  </div>
                </div>

                <div className="history-badges-actions">

                  <ReportStatus status={report.status} /><FiArrowRight className="history-row-arrow" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedReportModal && (
        <ReportDetailModal
          report={reports.find(item => item.id === selectedReportModal.id) || selectedReportModal}
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
