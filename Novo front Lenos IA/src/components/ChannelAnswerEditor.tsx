import { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';

export function ChannelAnswerEditor({ answer, question, onSave }: {
  answer: string; question: string; onSave: (value: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(answer);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  return editing ? (
    <form onSubmit={async event => {
      event.preventDefault();
      if (!value.trim()) { setError('Informe uma resposta.'); return; }
      setSaving(true); setError('');
      try { await onSave(value); setEditing(false); setMessage('Resposta atualizada com sucesso.'); }
      catch { setError('Não foi possível salvar a resposta. Tente novamente.'); }
      finally { setSaving(false); }
    }}>
      <div className="field-group">
        <input aria-label={question} value={value} onChange={event => setValue(event.target.value)} maxLength={50} required disabled={saving} autoFocus />
        <small>{value.length}/50 caracteres</small>
        {error && <small className="settings-field-error" role="alert">{error}</small>}
      </div>
      <div className="channel-answer-actions">
        <button className="settings-save-btn" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
        <button className="settings-secondary-btn" type="button" disabled={saving} onClick={() => setEditing(false)}>Cancelar</button>
      </div>
    </form>
  ) : (
    <>
      <div className="channel-answer-view">
        <span>{answer}</span>
        <button className="settings-secondary-btn" type="button" aria-label={`Editar resposta: ${question}`} onClick={() => { setValue(answer); setError(''); setMessage(''); setEditing(true); }}><FiEdit3 /> Editar</button>
      </div>
      {message && <small role="status">{message}</small>}
    </>
  );
}
