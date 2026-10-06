import type { ReportItem } from '../components/ReportDetailModal';

export function getSentimentStats(report: ReportItem) {
  const text = report.report || report.summary || '';
  const totalMatch = text.match(/Total de coment[áa]rios analisados\s*:\s*([\d.]+)/i);
  const total = Math.max(0, Number(report.comments_count ?? totalMatch?.[1]?.replace(/\./g, '') ?? 0) || 0);
  const percentage = (field: number | undefined, label: string) => {
    const match = text.match(new RegExp(`\\|\\s*${label}\\s*\\|\\s*([\\d.,]+)\\s*%`, 'i'));
    return Math.min(100, Math.max(0, Number(field ?? match?.[1]?.replace(',', '.') ?? 0) || 0));
  };
  const positive = Math.min(total, report.comments_positive ?? Math.round(total * percentage(report.sentiment_positive, 'Positivo') / 100));
  const negative = Math.min(total - positive, report.comments_negative ?? Math.round(total * percentage(report.sentiment_negative, 'Negativo') / 100));
  const neutral = Math.max(0, total - positive - negative);
  return { total, positive, negative, neutral, percent: (count: number) => total ? count / total * 100 : 0 };
}

export const formatPercent = (value: number) => `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
