import React, { useState } from 'react';
import { FiSearch, FiLoader, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import AppShell from '../components/AppShell';
import { useDashboard } from '../hooks/useDashboard';
import { ReportDetailModal, type ReportItem } from '../components/ReportDetailModal';
import { ReportService } from '../api/report';
import { toReportItem } from '../utils/reportMetrics';
import './style/Analyze.css';

export const Analyze: React.FC = () => {
  const [link, setLink] = useState('');
  const {
    generateReport,
    quota,
    quotaError,
    isLoadingQuota,
    reloadQuota,
    isGenerating,
    generationStatus,
    generatedReportId,
    errorMsg,
    setErrorMsg,
    reports,
    renameReport,
    deleteReport,
    downloadReportPDF,
  } = useDashboard();

  const [activeReportModal, setActiveReportModal] = useState<ReportItem | null>(null);

  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(link);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (link.trim()) {
      generateReport(link.trim());
    }
  };

  const handleOpenLatestReport = async () => {
    const latestReport = reports.find((report) => report.id === generatedReportId) || reports[0];
    if (latestReport) {
      setActiveReportModal(latestReport);
      return;
    }

    if (!generatedReportId) {
      setErrorMsg('Não foi possível abrir o relatório agora. Consulte o Histórico ou tente novamente.');
      return;
    }

    try {
      const report = await ReportService.getReportById(generatedReportId);
      setActiveReportModal(toReportItem(report));
    } catch {
      setErrorMsg('Não foi possível carregar o relatório gerado. Tente novamente.');
    }
  };

  return (
    <AppShell>
      <div className="page-heading">
        <h1>Analisar vídeo</h1>
        <p>Cole o link de um vídeo do YouTube para iniciar a análise.</p>
      </div>

      <div className="analyze-container">
        {isLoadingQuota ? <p role="status">Consultando cota mensal...</p> : quotaError ? <p role="alert">{quotaError} <button type="button" onClick={() => void reloadQuota()}>Tentar novamente</button></p> : quota && <p>{quota.used} de {quota.limit} análises utilizadas neste mês · {quota.remaining} disponíveis</p>}
        <form onSubmit={handleSubmit} className="analyze-form">
          <label className="url-field-label">
            <span>URL do vídeo do YouTube</span>
            <div className="url-input-wrapper">
              <FiSearch className="input-search-icon" />
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isGenerating}
                required
              />
              <button
                type="submit"
                className="submit-analysis-btn"
                disabled={isGenerating || !link.trim()}
              >
                {isGenerating ? (
                  <>
                    <FiLoader className="spin-icon" /> Processando...
                  </>
                ) : (
                  'Iniciar análise'
                )}
              </button>
            </div>
          </label>
        </form>

        {errorMsg && (
          <div className="analyze-alert error">
            <FiAlertCircle /> <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Processing Card */}
        {isGenerating && (
          <div className="processing-card">
            <div className="processing-header">
              <FiLoader className="spin-icon large" />
              <div>
                <h3>A IA está processando os comentários do vídeo</h3>
                <p>Aguarde enquanto verificamos e processamos sua solicitação.</p>
              </div>
            </div>

            {thumbnailUrl && (
              <div className="processing-video-preview">
                <img src={thumbnailUrl} alt="Preview do Vídeo" />
              </div>
            )}

            <div className="progress-bar-container">
              <div className="progress-bar-fill animated" />
            </div>

            <ul className="processing-steps">
              <li className="pending">Coleta de comentários do YouTube</li>
              <li className="active">⚙ Processando análises de sentimentos com IA</li>
              <li className="pending">⏱ Gerando relatório executivo e tópicos...</li>
            </ul>
          </div>
        )}

        {/* Success State */}
        {generationStatus === 'done' && !isGenerating && (
          <div className="analyze-alert success">
            <FiCheckCircle className="alert-icon" />
            <div className="success-content">
              <strong>Análise concluída com sucesso!</strong>
              <p>O relatório do seu vídeo já foi gerado e está pronto para consulta.</p>
              <button className="view-result-btn" onClick={handleOpenLatestReport}>
                Visualizar Relatório <FiArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Initial Empty State matching mockup */}
        {!isGenerating && generationStatus !== 'done' && !errorMsg && (
          <div className="empty-analysis-box">
            <div className="empty-icon-wrapper">
              <FiSearch />
            </div>
            <p>Cole um link do YouTube para visualizar as informações do vídeo.</p>
          </div>
        )}
      </div>

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

export default Analyze;