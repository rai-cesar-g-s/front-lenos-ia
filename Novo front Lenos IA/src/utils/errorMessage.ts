/**
  Converte com segurança qualquer erro de requisição (Axios, FastAPI, Supabase, Network)
  em uma mensagem de texto simples e legível em Português.
 */
export function formatErrorMessage(error: unknown, defaultMessage = 'Ocorreu um erro ao processar sua solicitação.'): string {
  if (!error) return defaultMessage;

  if (typeof error === 'string') return error;

  const errObj = error as {
    response?: {
      status?: number;
      data?: {
        message?: string;
        detail?: string | Array<{ msg?: string; message?: string }>;
        error?: string;
      };
    };
    message?: string;
  };

  const responseData = errObj.response?.data;

  // Se o backend FastAPI retornou detail como array (erros de validação do Pydantic)
  if (Array.isArray(responseData?.detail)) {
    const messages = responseData.detail
      .map((d) => d?.msg || d?.message || '')
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join('. ');
    }
  }

  // Se o backend retornou detail como string
  if (typeof responseData?.detail === 'string' && responseData.detail.trim()) {
    const detailLower = responseData.detail.toLowerCase();
    if (detailLower.includes('already exists') || detailLower.includes('já cadastrado') || detailLower.includes('registrado')) {
      return 'Este e-mail já está cadastrado em nossa plataforma.';
    }
    if (detailLower.includes('invalid credentials') || detailLower.includes('senha incorreta') || detailLower.includes('inválidos')) {
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    }
    return responseData.detail;
  }

  // Se o backend retornou message como string
  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }

  // Se o backend retornou erro genérico
  if (typeof responseData?.error === 'string' && responseData.error.trim()) {
    return responseData.error;
  }

  // Erros de status HTTP conhecidos
  const status = errObj.response?.status;
  if (status === 401) {
    return 'E-mail ou senha incorretos.';
  }
  if (status === 403) {
    return 'Você não tem permissão para realizar esta ação.';
  }
  if (status === 404) {
    return 'Recurso não encontrado no servidor.';
  }
  if (status === 409) {
    return 'Este e-mail já está cadastrado.';
  }
  if (status === 422) {
    return 'Verifique os campos preenchidos e tente novamente.';
  }
  if (status && status >= 500) {
    return 'Erro interno no servidor. Por favor, tente novamente mais tarde.';
  }

  // Erro de rede ou sem conexão
  if (errObj.message) {
    const msgLower = errObj.message.toLowerCase();
    if (msgLower.includes('network error') || msgLower.includes('econnrefused')) {
      return 'Não foi possível se conectar ao servidor. Verifique sua conexão de internet.';
    }
    if (msgLower.includes('timeout')) {
      return 'O tempo de resposta do servidor expirou. Tente novamente.';
    }
  }

  return defaultMessage;
}

export function formatLoginError(error: unknown): string {
  const failure = error as { message?: string; code?: string; response?: { status?: number } } | null;
  if (failure?.message === 'COOKIE_REJECTED') {
    return 'O login foi aceito, mas não foi possível validar a sessão. Tente novamente pelo endereço oficial app.lenos-ia.com.br.';
  }
  if (failure?.response?.status === 401) return 'E-mail ou senha incorretos. Verifique suas credenciais.';
  if (failure?.response?.status === 429) return 'Muitas tentativas de login. Aguarde um momento e tente novamente.';
  if (failure?.code === 'ERR_NETWORK') {
    return 'Não foi possível conectar à API. Verifique sua conexão e acesse pelo endereço oficial app.lenos-ia.com.br.';
  }
  return formatErrorMessage(error, 'Não foi possível entrar. Tente novamente.');
}
