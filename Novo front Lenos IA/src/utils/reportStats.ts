import type { ReportItem } from '../components/ReportDetailModal';

const count = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : undefined;

// Contagens vêm da API; dados ausentes não são inferidos do texto nem de outros sentimentos.
export function getSentimentStats(report: ReportItem) {
  const total = count(typeof report.comments_count === 'string' ? Number(report.comments_count) : report.comments_count);
  const positive = count(report.comments_positive);
  const negative = count(report.comments_negative);
  const neutral = count(report.comments_neutral);
  return { total, positive, negative, neutral, percent: (value: number | undefined) =>
    total !== undefined && total > 0 && value !== undefined && value <= total ? value / total * 100 : undefined };
}

export const formatPercent = (value: number | undefined) => value === undefined ? '—' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;