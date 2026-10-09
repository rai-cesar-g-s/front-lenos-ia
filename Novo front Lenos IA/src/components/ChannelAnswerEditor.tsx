import { useId, useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';

type EditorProps = {
  answer: string; question: string; onSave: (value: string) => Promise<void>;
  type?: 'text' | 'email' | 'tel'; maxLength?: number;
  validate?: (value: string) => string; normalize?: (value: string) => string;
  displayValue?: string; successMessage?: string;
};

export function ChannelAnswerEditor({ answer, question, onSave, type = 'text', maxLength = 50,
  validate, normalize, displayValue, successMessage = 'Resposta atualizada com sucesso.' }: EditorProps) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(answer);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // A API documenta respostas como strings; contagens aceitam somente inteiros não negativos.
  const numeric = !validate && /inscrit|quantos?\s+v[ií]deos|v[ií]deos.*seman|frequ[eê]ncia.*post/i.test(question);
  const validateValue = (draft: string) => validate ? validate(draft) :
    !draft.trim() ? 'Informe uma resposta.' : draft.trim().length > maxLength ? `Use no máximo ${maxLength} caracteres.` :
    numeric && !/^\d+$/.test(draft) ? 'Informe um número inteiro não negativo, usando apenas dígitos.' : '';
  return (
    <>
      {editing ? (
        <form noValidate onSubmit={async event => {
          event.preventDefault();
          if (saving) return;
          const failure = validateValue(value);
          setError(failure);
          if (failure) return;
          setSaving(true);
          try { await onSave(value.trim()); setEditing(false); setMessage(successMessage); }
          catch { setError('Não foi possível salvar. Tente novamente.'); }
          finally { setSaving(false); }
        }}>
          <div className="field-group">
            <label htmlFor={id}>{question}</label>
            <input id={id} type={type} inputMode={numeric || type === 'tel' ? 'numeric' : undefined}
              pattern={numeric ? '[0-9]+' : undefined} value={value} maxLength={maxLength}
              onChange={event => {
                const next = event.target.value;
                if (numeric && !/^\d*$/.test(next)) { setError('Use apenas dígitos (0–9).'); return; }
                setValue(normalize ? normalize(next) : next); setError('');
              }} required disabled={saving} autoFocus aria-invalid={Boolean(error)} aria-describedby={`${id}-feedback`} />
            <small id={`${id}-feedback`} className={error ? 'settings-field-error' : undefined} role={error ? 'alert' : undefined}>
              {error || (numeric ? `Número inteiro não negativo · até ${maxLength} dígitos` : `${value.length}/${maxLength} caracteres`)}
            </small>
          </div>
          <div className="channel-answer-actions">
            <button className="settings-save-btn" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            <button className="settings-secondary-btn" type="button" disabled={saving} onClick={() => { setValue(answer); setError(''); setEditing(false); }}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="channel-answer-view">
          <span>{displayValue ?? (answer || 'Não informado')}</span>
          <button className="settings-secondary-btn" type="button" aria-label={`Editar: ${question}`} onClick={() => { setValue(answer); setError(''); setMessage(''); setEditing(true); }}><FiEdit3 /> Editar</button>
        </div>
      )}
      {message && <small className="settings-field-success" role="status">{message}</small>}
    </>
  );
}
