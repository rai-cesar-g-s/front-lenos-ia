import type { RecurringTheme, ReportRecommendation } from '../api/report';
import React, { useState } from 'react';
import { FiX, FiDownload, FiEdit3, FiTrash2, FiExternalLink, FiMessageSquare, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { REPORT_TITLE_MIN_LENGTH, REPORT_TITLE_MAX_LENGTH, validateReportTitle } from '../utils/reportTitle';
import { getSentimentStats, formatPercent } from '../utils/reportStats';
import './style/ReportDetailModal.css';
import './style/ReportMarkdown.css';

export interface ReportItem {
  id: string;
  title?: string;
  video_url?: string;
  comments_count?: number | string;
  comments_positive?: number;
  comments_negative?: number;
  created_at?: string;
  status?: string;
  sentiment_positive?: number;
  sentiment_neutral?: number;
  sentiment_negative?: number;
  summary?: string;
  recurring_themes?: RecurringTheme[];
  recommendations?: ReportRecommendation[];
  report?: string;
}

interface ReportDetailModalProps {
  report: ReportItem | null;
  onClose: () => void;
  onRename?: (id: string, newTitle: string) => void;
  onDelete?: (id: string) => Promise<void>;
  onDownloadPdf?: (id: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onRename,
  onDelete,
  onDownloadPdf,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  if (!report) return null;

  const title = report.title || 'Análise de Vídeo';
  const videoUrl = report.video_url || '#';
  const stats = getSentimentStats(report);
  const commentsCount = stats.total;
  const commentsCountLabel = commentsCount == null
    ? 'contagem não fornecida'
    : `${Number(commentsCount).toLocaleString('pt-BR')} comentários analisados`;
  const createdDate = report.created_at ? new Date(report.created_at) : null;
  const createdAt = createdDate && !Number.isNaN(createdDate.getTime())
    ? createdDate.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'data não fornecida';

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  const posSentiment = stats.percent(stats.positive);
  const neuSentiment = stats.percent(stats.neutral);
  const negSentiment = stats.percent(stats.negative);

  const summaryText = report.summary || report.report || 'Resumo não fornecido pela API.';
  const topicsList = report.recurring_themes || [];
  const recommendationsList = report.recommendations || [];

  const handleStartRename = () => {
    setEditedTitle(title);
    setTitleError('');
    setIsEditingTitle(true);
  };

  const handleSaveRename = () => {
    const validation = validateReportTitle(editedTitle);
    setTitleError(validation);
    if (validation) return;
    if (onRename && editedTitle.trim()) {
      onRename(report.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="report-modal-overlay" onClick={() => { if (!confirmDelete) onClose(); }}>
      {confirmDelete && onDelete && <ConfirmDeleteModal title="Excluir relatório?" description={`O relatório “${title}” será removido do seu histórico.`} confirmLabel="Excluir relatório" onCancel={() => setConfirmDelete(false)} onConfirm={async () => { await onDelete(report.id); onClose(); }} />}
      <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal-header">
          <div className="report-modal-title-area">
            {isEditingTitle ? (
              <div className="title-edit-box">
                <input
                  type="text"
                  aria-label="Título do relatório"
                  minLength={REPORT_TITLE_MIN_LENGTH}
                  maxLength={REPORT_TITLE_MAX_LENGTH}
                  required
                  aria-invalid={Boolean(titleError)}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  autoFocus
                />
                <button className="save-btn" onClick={handleSaveRename}>Salvar</button>
                <button className="cancel-btn" onClick={() => setIsEditingTitle(false)}>Cancelar</button>
                {titleError && <span role="alert">{titleError}</span>}
              </div>
            ) : (
              <div className="title-view-box">
                <h2>{title}</h2>
                {onRename && (
                  <button className="icon-action-btn" title="Renomear relatório" onClick={handleStartRename}>
                    <FiEdit3 />
                  </button>
                )}
              </div>
            )}
            <p className="report-subtitle">
              Processado em: {createdAt} · {commentsCountLabel}
            </p>
          </div>

          <div className="report-modal-header-actions">
            {onDownloadPdf && (
              <button
                className="btn-modal-secondary"
                onClick={() => onDownloadPdf(report.id)}
                title="Baixar PDF"
              >
                <FiDownload /> <span>Baixar PDF</span>
              </button>
            )}

            {onDelete && (
              <button
                className="btn-modal-danger"
                onClick={() => setConfirmDelete(true)}
                title="Excluir relatório"
              >
                <FiTrash2 />
              </button>
            )}

            <button className="btn-modal-close" onClick={onClose} aria-label="Fechar">
              <FiX />
            </button>
          </div>
        </div>

        <div className="report-modal-body">
          <div className="report-preview-banner">
            <div className="report-thumbnail-wrapper">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={title} className="report-thumbnail" />
              ) : (
                <div className="report-thumbnail-placeholder">Prévia não disponível</div>
              )}
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-play-btn"
                title="Abrir no YouTube"
              >
                <FiExternalLink /> Ver no YouTube
              </a>
            </div>

            <div className="report-sentiment-cards">
              <div className="sentiment-stat-card positive">
                <span className="stat-label">Sentimento Positivo</span>
                <strong className="stat-val">{formatPercent(posSentiment)}</strong><span>{stats.positive} comentários</span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill pos" style={{ width: `${posSentiment}%` }} />
                </div>
              </div>

              <div className="sentiment-stat-card neutral">
                <span className="stat-label">Sentimento Neutro</span>
                <strong className="stat-val">{formatPercent(neuSentiment)}</strong><span>{stats.neutral} comentários</span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill neu" style={{ width: `${neuSentiment}%` }} />
                </div>
              </div>

              <div className="sentiment-stat-card negative">
                <span className="stat-label">Sentimento Negativo</span>
                <strong className="stat-val">{formatPercent(negSentiment)}</strong><span>{stats.negative} comentários</span>
                <div className="stat-bar-track">
                  <div className="stat-bar-fill neg" style={{ width: `${negSentiment}%` }} />
                </div>
              </div>
            </div>
          </div>

          <section className="report-section-box">
            <h3><FiMessageSquare /> Resumo Executivo da IA</h3>
            <div className="summary-paragraph report-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{summaryText}</ReactMarkdown></div>
          </section>

          <section className="report-section-box">
            <h3><FiTrendingUp /> Temas Mais Recorrentes nos Comentários</h3>
            <div className="topics-list-container">
              {topicsList.length === 0 && <p>Não há temas recorrentes disponíveis para esta análise.</p>}
              {topicsList.map((topic, index) => (
                <article className="topic-item-row topic-with-icon" key={index}>
                  <span className="rec-bullet" aria-hidden="true">✓</span>
                  <div className="report-insight">
                  <div className="insight-title report-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.theme}</ReactMarkdown></div>
                  <div className="insight-description report-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.description}</ReactMarkdown></div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="report-section-box">
            <h3><FiCheckCircle /> Recomendações Estratégicas para seu Canal</h3>
            <ul className="recommendations-list">
              {recommendationsList.length === 0 && <li>Não há recomendações disponíveis para esta análise.</li>}
              {recommendationsList.map((rec, index) => (
                <li key={index}>
                  <span className="rec-bullet">✓</span>
                  <div className="recommendation-content report-insight">
                    <div className="insight-title report-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{rec.recommendation}</ReactMarkdown></div>
                    <div className="insight-description report-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{rec.justification}</ReactMarkdown></div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
