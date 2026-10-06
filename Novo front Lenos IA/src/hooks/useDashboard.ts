import { logSafeError } from '../utils/safeLogger';
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { ReportService } from '../api/report';
import { toReportItem, getReportTotals } from '../utils/reportMetrics';
import type { ReportItem } from '../components/ReportDetailModal';

export function useDashboard() {
  const { user } = useAuth();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [reportsError, setReportsError] = useState('');

  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'pending' | 'done' | 'failed'>('idle');
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setIsLoadingReports(true);
    setReportsError('');
    try {
      const data = await ReportService.getReports();
      setReports(data.map(toReportItem));
    } catch (err) {
      logSafeError('useDashboard: Erro ao buscar relatórios:', err);
      setReports([]);
      setReportsError('Não foi possível carregar seus relatórios. Tente novamente.');
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const getRecentReportsCount = useCallback(() => {
    return reports.filter((report: ReportItem) => report.status === 'done' || report.status === 'completed').length;
  }, [reports]);

  const canGenerateReport = getRecentReportsCount() < 5;

  const generateReport = async (link: string) => {
    if (!link.trim()) {
      setErrorMsg('Por favor, insira um link de vídeo válido.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);
    setGenerationStatus('pending');
    setGeneratedReportId(null);

    try {
      // Cast parameter to match ReportService signature if needed
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
            setGenerationStatus('done');
            setIsGenerating(false);
          } else if (report && report.status === 'failed') {
            clearInterval(pollInterval);
            setGenerationStatus('failed');
            setIsGenerating(false);
            setErrorMsg('Falha ao processar os comentários do vídeo. Tente outro link.');
          }
        } catch (pollErr) {
          logSafeError('Polling error:', pollErr);
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          await loadReports();
          setGenerationStatus('failed');
          setIsGenerating(false);
          setErrorMsg('A API ainda não confirmou a conclusão. Consulte o Histórico mais tarde.');
        }
      }, 2000);
    } catch (error: unknown) {
      logSafeError('Erro ao gerar relatório:', error);
      const errObj = error as { response?: { data?: { detail?: string } } };
      setGenerationStatus('failed');
      setIsGenerating(false);
      setErrorMsg(errObj?.response?.data?.detail || 'Erro ao conectar ao servidor de processamento.');
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
    if (trimmed.length < 2) {
      alert('O título do relatório deve conter pelo menos 2 caracteres.');
      return;
    }
    if (trimmed.length > 50) {
      alert('O título do relatório não pode ter mais de 50 caracteres.');
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
    reports,
    reportsError,
    totals: getReportTotals(reports),
    reloadReports: loadReports,
    selectedReportId,
    errorMsg,
    canGenerateReport,
    recentReportsCount: getRecentReportsCount(),
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
