import React, { useState } from 'react';
import { FiX, FiDownload, FiEdit3, FiTrash2, FiExternalLink, FiMessageSquare, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  topics?: Array<{ name: string; count: number; percentage?: number }>;
  recommendations?: string[];
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
  const topicsList = report.topics || [];
  const recommendationsList = report.recommendations || [];

  const handleStartRename = () => {
    setEditedTitle(title);
    setIsEditingTitle(true);
  };

  const handleSaveRename = () => {
    if (onRename && editedTitle.trim()) {
      onRename(report.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="report-modal-overlay" onClick={() => { if (!confirmDelete) onClose(); }}>
      {confirmDelete && onDelete && <ConfirmDeleteModal title="Excluir relatório?" description={`O relatório “${title}” será excluído permanentemente. Esta ação não pode ser desfeita.`} confirmLabel="Excluir relatório" onCancel={() => setConfirmDelete(false)} onConfirm={async () => { await onDelete(report.id); onClose(); }} />}
      <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal-header">
          <div className="report-modal-title-area">
            {isEditingTitle ? (
              <div className="title-edit-box">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  autoFocus
                />
                <button className="save-btn" onClick={handleSaveRename}>Salvar</button>
                <button className="cancel-btn" onClick={() => setIsEditingTitle(false)}>Cancelar</button>
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
              {topicsList.length === 0 && <p>Temas não fornecidos pela API.</p>}
              {topicsList.map((topic, index) => (
                <div className="topic-item-row" key={index}>
                  <div className="topic-info">
                    <span className="topic-name">{topic.name}</span>
                    <span className="topic-count">{topic.count} comentários</span>
                  </div>
                  <div className="topic-progress-bg">
                    <div
                      className="topic-progress-fill"
                      style={{ width: `${topic.percentage ?? (Number(commentsCount) > 0 ? Math.min(100, (topic.count / Number(commentsCount)) * 100) : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="report-section-box">
            <h3><FiCheckCircle /> Recomendações Estratégicas para seu Canal</h3>
            <ul className="recommendations-list">
              {recommendationsList.length === 0 && <li>Recomendações não fornecidas pela API.</li>}
              {recommendationsList.map((rec, index) => (
                <li key={index}>
                  <span className="rec-bullet">✓</span>
                  <span>{rec}</span>
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
