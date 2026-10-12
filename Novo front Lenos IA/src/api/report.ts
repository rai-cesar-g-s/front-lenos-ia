import { logSafeError } from '../utils/safeLogger';
import api from './api';
import { API_BASE_URL } from './config';

export type RecurringTheme = { theme: string; description: string; percentage_relevance: number };
export type ReportRecommendation = { recommendation: string; justification: string };

export type ApiReport = {
  id: string;
  title: string;
  url: string;
  report: string;
  status: string;
  created_at?: string;
  comments_processed: number | null;
  comments_positive: number | null;
  comments_negative: number | null;
  recurring_themes: RecurringTheme[];
  recommendations: ReportRecommendation[];
};

export type ReportFilterStatus = 'done' | 'pending' | 'failed';
export type ReportDateRange = { start_date: string; end_date: string };
export const currentMonthRange = (): ReportDateRange => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  return { start_date: part('year') + '-' + part('month') + '-01', end_date: part('year') + '-' + part('month') + '-' + part('day') };
};

export type ReportQuota = { used: number; limit: number; remaining: number; comments_processed: number };
export type ReportStats = { count: number; comments_processed: number; comments_positive: number; comments_negative: number };
export type ReportList = { result: ApiReport[]; stats: ReportStats };

/**
 * Serviços relacionados às requisições de "Relatórios" / "Vídeos"
 * Integrados com os endpoints autenticados da API FastAPI
 */

export const ReportService = {
  /**
   * Busca relatórios do usuário autenticado pelo endpoint documentado.
   */
  async getReports(range: ReportDateRange = currentMonthRange(), status?: ReportFilterStatus): Promise<ReportList> {
    const response = await api.get<ReportList>('/v1/user/reports', { params: { ...range, ...(status ? { status } : {}) } });
    return response.data;
  },

  async getQuota(): Promise<ReportQuota> {
    const response = await api.get<ReportQuota>('/v1/user/reports/quota');
    return response.data;
  },

  /**
   * Gera um relatório processando através da URL do input
   */
  async generateReport(link: string | { link: string }) {
    const videoUrl = typeof link === 'string' ? link : link.link;
    const response = await api.post('/v1/user/generate-report', { video_url: videoUrl });
    return response.data;
  },

  /**
  * Busca um relatório específico do usuário autenticado.
   */
  async getReportById(id: string | { id: string }) {
    const reportId = typeof id === 'string' ? id : id.id;
    const response = await api.get<ApiReport>(`/v1/user/report/${reportId}`);
    return response.data;
  },

  /**
   * Renomeia relatório pela API.
   */
  async renameReport(id: string | { id: string; newTitle: string }, newTitle?: string) {
    const reportId = typeof id === 'string' ? id : id.id;
    const titleToUpdate = typeof id === 'object' ? id.newTitle : newTitle;
    const response = await api.put(`/v1/user/report/${reportId}`, {
      new_title: titleToUpdate,
    });
    return response.data;
  },

  /**
   * Deleta um relatório pela API.
   */
  async deleteReport(id: string | { id: string }) {
    const reportId = typeof id === 'string' ? id : id.id;
    const response = await api.delete(`/v1/user/report/${reportId}`);
    return response.data;
  },

  /**
   * Retorna a URL para download do PDF do relatório.
   */
  getReportPdfUrl(id: string | { id: string }) {
    const reportId = typeof id === 'string' ? id : id.id;
    return `${API_BASE_URL}/v1/user/report/${encodeURIComponent(reportId)}/pdf`;
  },

  /**
   * Realiza o download do arquivo PDF do relatório como um Blob.
   */
  async downloadReportPdf(id: string | { id: string }) {
    const reportId = typeof id === 'string' ? id : id.id;
    try {
      const response = await api.get(`/v1/user/report/${reportId}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      logSafeError("ReportService: Erro ao baixar PDF como Blob", error);
      throw error;
    }
  }
};
