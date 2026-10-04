import api from './api';

export type ApiReport = {
  id: string;
  title: string;
  url: string;
  report: string;
  status: string;
};

/**
 * Serviços relacionados às requisições de "Relatórios" / "Vídeos"
 * Integrados com os endpoints autenticados da API FastAPI
 */

export const ReportService = {
  /**
   * Busca relatórios do usuário autenticado pelo endpoint documentado.
   */
  async getReports(): Promise<ApiReport[]> {
    const response = await api.get<ApiReport[]>('/v1/user/reports');
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
   * Renomeia relatório no Supabase / API
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
   * Deleta um relatório no Supabase / API
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
    const getBaseURL = () => {
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '';
      }
      return 'https://api.lenos-ia.com.br';
    };
    return `${getBaseURL()}/v1/user/report/${reportId}/pdf`;
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
      console.error("ReportService: Erro ao baixar PDF como Blob", error);
      throw error;
    }
  }
};
