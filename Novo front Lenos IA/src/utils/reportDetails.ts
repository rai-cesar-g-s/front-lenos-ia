import type { ApiReport } from '../api/report';

export async function completeReportDetails(report: ApiReport, fetchDetails: (id: string) => Promise<ApiReport>): Promise<ApiReport> {
  const hasCounts = [report.comments_processed, report.comments_positive,
    report.comments_negative].every(value => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0);
  const hasDate = typeof report.created_at === 'string' && Number.isFinite(Date.parse(report.created_at));
  if (hasDate && (hasCounts || !['done', 'completed'].includes(report.status))) return report;
  const details = await fetchDetails(report.id);
  return { ...report, ...details, created_at: details.created_at || report.created_at };
}
