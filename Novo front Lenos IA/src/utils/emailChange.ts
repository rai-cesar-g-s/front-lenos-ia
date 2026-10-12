export function validateNewEmail(value: string, currentEmail: string) {
  const email = value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Informe um e-mail válido.';
  if (email.toLowerCase() === currentEmail.trim().toLowerCase()) return 'Informe um endereço diferente do seu e-mail atual.';
  return '';
}
export function emailChangeError(error: unknown, confirming = false) {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } })?.response;
  if (response?.status === 401 || response?.status === 403) return 'Entre na conta que solicitou a alteração para continuar.';
  if (response?.status === 429) return 'Aguarde um momento antes de tentar novamente.';
  if (confirming && response?.status === 400) return 'Este link é inválido ou expirou. Solicite uma nova alteração em Configurações.';
  if (response?.status === 409) return 'Este e-mail já está sendo usado por outra conta.';
  if (response?.status === 422) return confirming ? 'O link de confirmação não é válido. Solicite uma nova alteração em Configurações.' : 'Confira o novo endereço de e-mail e tente novamente.';
  return confirming ? 'Não foi possível confirmar a alteração. Tente novamente em alguns instantes.' : 'Não foi possível enviar a confirmação. Tente novamente em alguns instantes.';
}
