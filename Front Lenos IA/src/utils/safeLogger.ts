// Erros Axios incluem corpo da requisição, cookies e tokens; registre apenas o evento e status.
export const logSafeError = (...values: unknown[]) => {
  const message = values.find((value) => typeof value === 'string') || 'Falha ao processar a solicitação.';
  const failure = values.find((value) => value && typeof value === 'object' && 'response' in value) as
    { response?: { status?: number } } | undefined;
  console.error(message, { status: failure?.response?.status });
};
