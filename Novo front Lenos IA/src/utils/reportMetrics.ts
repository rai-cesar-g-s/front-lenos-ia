import type { ApiReport } from '../api/report';
import type { ReportItem } from '../components/ReportDetailModal';

const count = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : undefined;

export const isCompletedReport = (report: ReportItem) =>
  report.status === 'done' || report.status === 'completed';

// Percentages use comment totals, so videos with more comments have their correct weight.
export function getCommentPercentage(part: number | undefined, total: number | undefined) {
  return total !== undefined && total > 0 && part !== undefined && part >= 0 && part <= total
    ? part / total * 100 : undefined;
}

// Preserve API counts: missing data must never become invented comments.
export function toReportItem(report: ApiReport): ReportItem {
  const total = count(report.comments_processed);
  const positive = count(report.comments_positive);
  const negative = count(report.comments_negative);
  return {
    id: report.id, title: report.title, video_url: report.url,
    report: report.report, status: report.status, created_at: report.created_at,
    recurring_themes: Array.isArray(report.recurring_themes) ? report.recurring_themes : [],
    recommendations: Array.isArray(report.recommendations) ? report.recommendations : [],
    comments_count: total, comments_positive: positive, comments_negative: negative,
    sentiment_positive: getCommentPercentage(positive, total),
    sentiment_negative: getCommentPercentage(negative, total),
  };
}

// Only completed analyses contribute; an incomplete count makes that total unavailable.
export function getReportTotals(reports: ReportItem[]) {
  const completed = reports.filter(isCompletedReport);
  const sum = (key: 'comments_count' | 'comments_positive' | 'comments_negative') => {
    const values = completed.map(report => count(report[key]));
    return values.some(value => value === undefined)
      ? undefined : values.reduce<number>((total, value) => total + (value ?? 0), 0);
  };
  return { analyses: completed.length, comments: sum('comments_count'),
    positive: sum('comments_positive'), negative: sum('comments_negative') };
}
