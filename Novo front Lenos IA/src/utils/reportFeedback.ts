import type { ReportQuota } from '../api/report';

export const quotaReachedMessage = 'Você já utilizou todas as análises disponíveis neste mês. Aguarde a renovação da sua cota para analisar outro vídeo.';

// Traduz apenas situações reconhecidas; detalhes técnicos nunca são exibidos.
export function getReportErrorMessage(error: unknown, quota: ReportQuota | null = null): string {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown; message?: unknown } } } | null)?.response;
  const detail = response?.data?.detail;
  const message = typeof detail === 'string' ? detail : typeof response?.data?.message === 'string' ? response.data.message : '';
  const normalized = message.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const status = response?.status;
  if (status === 401) return 'Sua sessão expirou. Entre novamente para continuar.';
  if (status === 429) return 'Você fez várias tentativas em pouco tempo. Aguarde um momento e tente novamente.';
  if (status !== undefined && status >= 500) return 'Não foi possível iniciar a análise agora. Tente novamente em alguns instantes.';
  if (/nao pertence.*(?:canal|channel)/.test(normalized)) return 'Este vídeo não pertence ao canal conectado à sua conta. Use um vídeo desse canal ou confira a conta Google conectada.';
  if (/(?:relatorio|report).*(?:ja gerado|ja existe|already|duplicad)/.test(normalized)) return 'Você já gerou um relatório para este vídeo. Consulte o Histórico para visualizar a análise.';
  if (/(?:limite|cota|quota).*(?:atingid|excedid|reached)/.test(normalized)) {
    return quota?.remaining === 0 ? quotaReachedMessage : 'Não foi possível iniciar a análise. Tente novamente; se o problema continuar, entre em contato com o suporte.';
  }
  if (/(?:youtube|google|conta).*(?:nao conectad|desconectad|expirad)/.test(normalized)) return 'Conecte ou reconecte sua conta Google para analisar os vídeos do seu canal.';
  if (status === 404) return 'Não foi possível encontrar esse vídeo no YouTube. Confira o link e se o vídeo está disponível.';
  if (status === 422 || /(?:url|link).*(?:invalid|invalido)/.test(normalized)) return 'Não foi possível usar esse link. Copie o endereço do vídeo no YouTube e tente novamente.';
  if (status === 403) return 'Não foi possível analisar esse vídeo com a conta conectada. Confira sua conexão Google e tente novamente.';
  if (!response) return 'Não foi possível confirmar o início da análise. Confira sua conexão e consulte o Histórico antes de tentar novamente.';
  return 'Não foi possível iniciar a análise. Tente novamente; se o problema continuar, entre em contato com o suporte.';
}
