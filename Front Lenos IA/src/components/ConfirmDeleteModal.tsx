import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import './style/ConfirmDeleteModal.css';

export function ConfirmDeleteModal({ title, description, confirmLabel, onCancel, onConfirm }: {
  title: string; description: string; confirmLabel: string;
  onCancel: () => void; onConfirm: () => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => { element?.close(); previous?.focus(); };
  }, []);
  return createPortal(
    <dialog ref={dialog} className="confirm-delete-modal" aria-labelledby={titleId} aria-describedby={descriptionId}
      onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}
      onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget && !busy) onCancel(); }}>
      <div className="confirm-delete-content">
        <button className="confirm-delete-close" aria-label="Fechar confirmação" disabled={busy} onClick={onCancel}><FiX /></button>
        <div className="confirm-delete-icon"><FiAlertTriangle /></div>
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
        {error && <p className="confirm-delete-error" role="alert">{error}</p>}
        <div className="confirm-delete-actions">
          <button className="confirm-delete-cancel" autoFocus disabled={busy} onClick={onCancel}>Cancelar</button>
          <button className="confirm-delete-submit" disabled={busy} onClick={async () => {
            setBusy(true); setError('');
            try { await onConfirm(); }
            catch { setError('Não foi possível excluir. Tente novamente.'); setBusy(false); }
          }}>{busy ? 'Excluindo...' : confirmLabel}</button>
        </div>
      </div>
    </dialog>, document.body
  );
}
