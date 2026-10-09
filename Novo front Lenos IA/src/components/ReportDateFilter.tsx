import { useId, useState } from 'react';
import type { ReportDateRange } from '../api/report';
import './style/ReportDateFilter.css';

export function ReportDateFilter({ range, onApply }: { range: ReportDateRange; onApply: (range: ReportDateRange) => void }) {
  const id = useId();
  const [start, setStart] = useState(range.start_date);
  const [end, setEnd] = useState(range.end_date);
  const invalid = Boolean(start && end && start > end);
  return <form className="report-date-filter" onSubmit={event => {
    event.preventDefault();
    if (start && end && !invalid) onApply({ start_date: start, end_date: end });
  }}>
    <div><label htmlFor={`${id}-start`}>Data início</label><input id={`${id}-start`} type="date" value={start} onChange={event => setStart(event.target.value)} required aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} /></div>
    <div><label htmlFor={`${id}-end`}>Data fim</label><input id={`${id}-end`} type="date" value={end} onChange={event => setEnd(event.target.value)} required aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} /></div>
    <button type="submit" disabled={!start || !end || invalid}>Aplicar intervalo</button>
    {invalid && <small id={`${id}-error`} role="alert">A data fim deve ser igual ou posterior à data início.</small>}
  </form>;
}

