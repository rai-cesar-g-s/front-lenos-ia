import { getReportStatus } from '../utils/reportStatus';
import { useState } from 'react';
import { REPORT_TITLE_MIN_LENGTH, REPORT_TITLE_MAX_LENGTH, validateReportTitle } from '../utils/reportTitle';
import { FiEdit3 } from 'react-icons/fi';
import type { ReportItem } from './ReportDetailModal';
import './style/ReportRowActions.css';

export function ReportRowTitle({ report, onRename }: { report: ReportItem; onRename: (id: string, title: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(report.title || 'Análise de vídeo');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  return editing ? (
    <form className="title-edit-box report-row-edit" onClick={e => e.stopPropagation()} onSubmit={async e => {
      e.preventDefault();
      if (saving) return;
      const validation = validateReportTitle(title);
      if (validation) { setError(validation); return; }
      setError('');
      setSaving(true);
      try { await onRename(report.id, title.trim()); setEditing(false); } catch { setError('Não foi possível renomear. Tente novamente.'); } finally { setSaving(false); }
    }}>
      <input type="text" aria-label="Título do relatório" value={title} onChange={e => setTitle(e.target.value)} minLength={REPORT_TITLE_MIN_LENGTH} maxLength={REPORT_TITLE_MAX_LENGTH} required autoFocus />
      <button className="save-btn" disabled={saving}>Salvar</button>
      <button className="cancel-btn" type="button" onClick={() => setEditing(false)}>Cancelar</button>
      {error && <span role="alert">{error}</span>}
    </form>
  ) : (
    <div className="report-row-title">
      <strong>{report.title || 'Análise de vídeo'}</strong>
      <button className="icon-action-btn" aria-label="Renomear relatório" title="Renomear relatório" onClick={e => { e.stopPropagation(); setTitle(report.title || 'Análise de vídeo'); setEditing(true); }}><FiEdit3 /></button>
    </div>
  );
}

export function ReportStatus({ status }: { status?: string }) {
  const [label, tone] = getReportStatus(status);
  return <span className={`report-status ${tone}`}>{label}</span>;
}
