const statuses: Record<string, [string, string]> = {
  done: ['Concluído', 'done'], completed: ['Concluído', 'done'],
  pending: ['Pendente', 'pending'], queued: ['Na fila', 'pending'],
  processing: ['Em processamento', 'pending'], in_progress: ['Em processamento', 'pending'],
  failed: ['Falhou', 'failed'], error: ['Falhou', 'failed'],
};
export const getReportStatus = (status?: string) => statuses[status?.toLowerCase() || ''] || ['Outro status', 'unknown'];
export const reportFilterOptions = [
  { value: 'done', label: 'Concluídas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'failed', label: 'Falhas' },
] as const;
