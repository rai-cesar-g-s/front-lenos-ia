import { logSafeError } from '../utils/safeLogger';
import { validateReportTitle } from '../utils/reportTitle';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { ReportService, type ReportQuota, type ReportStats, type ReportDateRange, type ReportFilterStatus, currentMonthRange } from '../api/report';
import { toReportItem } from '../utils/reportMetrics';
import { getReportErrorMessage, quotaReachedMessage } from '../utils/reportFeedback';
import type { ReportItem } from '../components/ReportDetailModal';

export function useDashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<ReportDateRange>(currentMonthRange);
  const [statusFilter, setStatusFilter] = useState<ReportFilterStatus | ''>('');
  const reportRequest = useRef(0);
  const generationInFlight = useRef(false);

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [quota, setQuota] = useState<ReportQuota | null>(null);
  const [quotaError, setQuotaError] = useState('');
  const [isLoadingQuota, setIsLoadingQuota] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [reportsError, setReportsError] = useState('');

  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'pending' | 'done' | 'failed'>('idle');
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    const requestId = ++reportRequest.current;
    setIsLoadingReports(true);
    setReportsError('');
    try {
      const data = await ReportService.getReports(dateRange, statusFilter || undefined);
      if (requestId !== reportRequest.current) return;
      setReports(data.result.map(toReportItem));
      setStats(data.stats);
    } catch (err) {
      if (requestId !== reportRequest.current) return;
      logSafeError('useDashboard: Erro ao buscar relatórios:', err);
      setReports([]);
      setStats(null);
      setReportsError('Não foi possível carregar seus relatórios. Tente novamente.');
    } finally {
      if (requestId === reportRequest.current) setIsLoadingReports(false);
    }
  }, [dateRange, statusFilter]);

  const loadQuota = useCallback(async () => {
    setIsLoadingQuota(true);
    setQuotaError('');
    try {
      const currentQuota = await ReportService.getQuota();
      setQuota(currentQuota);
      return currentQuota;
    }
    catch (err) {
      logSafeError('Erro ao buscar cota mensal:', err);
      setQuota(null);
      setQuotaError('Não foi possível consultar sua cota mensal. Tente novamente.');
      return null;
    } finally { setIsLoadingQuota(false); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadReports(); void loadQuota(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadReports, loadQuota]);

  const canGenerateReport = quota !== null && quota.remaining > 0;

  const generateReport = async (link: string) => {
    if (generationInFlight.current) return;
    if (!link.trim()) {
      setErrorMsg('Por favor, insira um link de vídeo válido.');
      return;
    }

    generationInFlight.current = true;
    setErrorMsg('');
    setIsGenerating(true);
    setGenerationStatus('pending');
    setGeneratedReportId(null);

    try {
      // A cota precisa estar atualizada antes de afirmar que o limite foi atingido.
      const currentQuota = await loadQuota();
      if (!currentQuota || currentQuota.remaining === 0) {
        setErrorMsg(currentQuota ? quotaReachedMessage : 'Não foi possível verificar sua cota mensal. Tente novamente em alguns instantes.');
        setGenerationStatus('idle');
        setIsGenerating(false);
        generationInFlight.current = false;
        return;
      }
      const result = await ReportService.generateReport(link);
      const reportId = result?.report_id;
      if (!reportId) throw new Error('A API não retornou o identificador do relatório.');

      setGeneratedReportId(reportId);

      let attempts = 0;
      const maxAttempts = 20;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const reportData = await ReportService.getReportById(reportId);
          const report = Array.isArray(reportData) ? reportData[0] : reportData;

          if (report && (report.status === 'done' || report.report)) {
            clearInterval(pollInterval);
            await loadReports();
            await loadQuota();
            setGenerationStatus('done');
            setIsGenerating(false);
          generationInFlight.current = false;
          } else if (report && report.status === 'failed') {
            clearInterval(pollInterval);
            setGenerationStatus('failed');
            setIsGenerating(false);
      generationInFlight.current = false;
            setErrorMsg('Não foi possível concluir a análise deste vídeo. Tente novamente em alguns instantes.');
            return;
          }
        } catch (pollErr) {
          logSafeError('Polling error:', pollErr);
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          await loadReports();
          setGenerationStatus('failed');
          setIsGenerating(false);
            generationInFlight.current = false;
          setErrorMsg('Sua análise ainda não foi confirmada. Consulte o Histórico em alguns instantes antes de tentar novamente.');
        }
      }, 2000);
    } catch (error: unknown) {
      logSafeError('Erro ao gerar relatório:', error);
      const currentQuota = await loadQuota();
      setGenerationStatus('failed');
      setIsGenerating(false);
            generationInFlight.current = false;
      setErrorMsg(getReportErrorMessage(error, currentQuota));
    }
  };

  const viewReport = (id: string) => {
    setSelectedReportId(id);
    setGenerationStatus('idle');
    setGeneratedReportId(null);
  };

  const closeReportView = () => setSelectedReportId(null);

  const renameReport = async (id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    const validation = validateReportTitle(trimmed);
    if (validation) {
      alert(validation);
      return;
    }
    try {
      await ReportService.renameReport(id, trimmed);
      await loadReports();
    } catch (error) {
      logSafeError('Erro ao renomear:', error);
      setErrorMsg('Não foi possível renomear o relatório. Tente novamente.');
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await ReportService.deleteReport(id);
      await loadReports();
      await loadQuota();
      if (selectedReportId === id) setSelectedReportId(null);
    } catch (error) {
      logSafeError('Erro ao deletar:', error);
      setErrorMsg('Não foi possível excluir o relatório. Tente novamente.');
      throw error;
    }
  };

  const downloadReportPDF = async (id: string) => {
    try {
      const report = reports.find((r: ReportItem) => r.id === id);
      const filename =
        report && report.title
          ? `${report.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim()}.pdf`
          : 'relatorio.pdf';

      const blob = await ReportService.downloadReportPdf(id);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.setAttribute('download', filename);
      document.body.appendChild(anchor);
      anchor.click();

      if (anchor.parentNode) {
        anchor.parentNode.removeChild(anchor);
      }
      window.URL.revokeObjectURL(url);
    } catch (error) {
      logSafeError('Erro ao baixar PDF:', error);
      alert('Não foi possível baixar o relatório. Tente novamente.');
    }
  };

  return {
    user,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    reports,
    reportsError,
    totals: { analyses: stats?.count, comments: stats?.comments_processed,
      positive: stats?.comments_positive, negative: stats?.comments_negative },
    quota,
    quotaError,
    isLoadingQuota,
    reloadQuota: loadQuota,
    reloadReports: loadReports,
    selectedReportId,
    errorMsg,
    canGenerateReport,
    recentReportsCount: quota?.used,
    isLoadingReports,
    isGenerating,
    generationStatus,
    generatedReportId,
    generateReport,
    viewReport,
    closeReportView,
    renameReport,
    deleteReport,
    downloadReportPDF,
    setErrorMsg,
  };
}
