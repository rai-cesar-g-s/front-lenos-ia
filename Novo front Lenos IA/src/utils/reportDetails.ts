import type { ApiReport } from '../api/report';

export async function completeReportDetails(report: ApiReport, fetchDetails: (id: string) => Promise<ApiReport>): Promise<ApiReport> {
  const hasCounts = [report.processed_comments, report.processed_comments_positive,
    report.processed_comments_negative].every(value => Number.isSafeInteger(value) && value >= 0);
  const hasDate = typeof report.created_at === 'string' && Number.isFinite(Date.parse(report.created_at));
  if (hasDate && (hasCounts || !['done', 'completed'].includes(report.status))) return report;
  const details = await fetchDetails(report.id);
  return { ...report, ...details, created_at: details.created_at || report.created_at };
}
