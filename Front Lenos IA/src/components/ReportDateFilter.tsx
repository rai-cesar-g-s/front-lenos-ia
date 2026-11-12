import { useId, useRef, useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { ReportDateRange } from '../api/report';
import './style/ReportDateFilter.css';

const displayDate = (iso: string) => iso ? iso.split('-').reverse().join('/') : '';
const parseDate = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return '';
  const [, day, month, year] = match;
  const iso = year + '-' + month + '-' + day;
  const date = new Date(iso + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : '';
};
function DateField({ id, label, value, onChange, invalid, errorId }: {
  id: string; label: string; value: string; onChange: (value: string) => void; invalid: boolean; errorId?: string;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const days = new Date(year, month + 1, 0).getDate();
  const offset = new Date(year, month, 1).getDay();
  const isoDay = (day: number) => String(year).padStart(4, '0') + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  const close = () => { setOpen(false); trigger.current?.focus(); };
  const moveMonth = (direction: number) => {
    const next = new Date(year, month + direction, 1);
    if (next.getFullYear() < 100 || next.getFullYear() > 9999) return;
    setMonth(next.getMonth()); setYear(next.getFullYear());
  };
  return <div>
    <label htmlFor={id}>{label}</label>
    <div className="brazilian-date-field" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); close(); } }}>
      <input id={id} type="text" inputMode="numeric" placeholder="dd/mm/aaaa" maxLength={10} value={value}
        onChange={event => onChange(event.target.value)} required aria-invalid={invalid} aria-describedby={errorId} />
      <button ref={trigger} className="date-picker-button" type="button" aria-expanded={open} aria-controls={id + '-calendar'} aria-label={'Abrir calendário de ' + label.toLowerCase()} onClick={() => {
        if (!open) {
          const iso = parseDate(value);
          const date = iso ? new Date(iso + 'T12:00:00') : new Date();
          setMonth(date.getMonth()); setYear(date.getFullYear());
        }
        setOpen(!open);
      }}><FiCalendar aria-hidden="true" /></button>
      {open && <div id={id + '-calendar'} className="portuguese-calendar" role="dialog" aria-label={'Calendário de ' + label.toLowerCase()} lang="pt-BR">
        <div className="calendar-heading">
          <button type="button" aria-label="Mês anterior" onClick={() => moveMonth(-1)}><FiChevronLeft aria-hidden="true" /></button>
          <span aria-live="polite">{months[month]} de {year}</span>
          <button type="button" aria-label="Próximo mês" onClick={() => moveMonth(1)}><FiChevronRight aria-hidden="true" /></button>
        </div>
        <div className="calendar-selectors">
          <select aria-label="Mês" value={month} onChange={event => setMonth(Number(event.target.value))}>{months.map((name, index) => <option key={name} value={index}>{name}</option>)}</select>
          <input type="number" aria-label="Ano" min={100} max={9999} value={year} onChange={event => { const next = Number(event.target.value); if (next >= 100 && next <= 9999) setYear(next); }} />
        </div>
        <div className="calendar-days">
          {weekdays.map(day => <span key={day} className="calendar-weekday">{day}</span>)}
          {Array.from({ length: offset }, (_, index) => <span key={'empty-' + index} />)}
          {Array.from({ length: days }, (_, index) => {
            const day = index + 1;
            const selected = isoDay(day) === parseDate(value);
            return <button key={day} type="button" aria-pressed={selected} className={selected ? 'calendar-selected' : undefined} aria-label={day + ' de ' + months[month].toLowerCase() + ' de ' + year} onClick={() => { onChange(displayDate(isoDay(day))); close(); }}>{day}</button>;
          })}
        </div>
        <div className="calendar-footer">
          <button type="button" onClick={() => { const today = new Date(); onChange(displayDate(String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'))); close(); }}>Hoje</button>
          <button type="button" onClick={() => { onChange(''); close(); }}>Limpar</button>
          <button type="button" onClick={close}>Fechar</button>
        </div>
      </div>}
    </div>
  </div>;
}
export function ReportDateFilter({ range, onApply }: { range: ReportDateRange; onApply: (range: ReportDateRange) => void }) {
  const id = useId();
  const [start, setStart] = useState(displayDate(range.start_date));
  const [end, setEnd] = useState(displayDate(range.end_date));
  const startIso = parseDate(start);
  const endIso = parseDate(end);
  const invalidDate = Boolean((start && !startIso) || (end && !endIso));
  const invalidOrder = Boolean(startIso && endIso && startIso > endIso);
  const invalid = invalidDate || invalidOrder;
  return <form className="report-date-filter" onSubmit={event => {
    event.preventDefault();
    if (startIso && endIso && !invalid) onApply({ start_date: startIso, end_date: endIso });
  }}>
    <DateField id={id + '-start'} label="Data início" value={start} onChange={setStart} invalid={invalid} errorId={invalid ? id + '-error' : undefined} />
    <DateField id={id + '-end'} label="Data fim" value={end} onChange={setEnd} invalid={invalid} errorId={invalid ? id + '-error' : undefined} />
    <button type="submit" disabled={!startIso || !endIso || invalid}>Aplicar intervalo</button>
    {invalid && <small id={id + '-error'} role="alert">{invalidDate ? 'Informe uma data válida no formato dia/mês/ano.' : 'A data fim deve ser igual ou posterior à data início.'}</small>}
  </form>;
}
