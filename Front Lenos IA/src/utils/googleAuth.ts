import { UserService } from '../api/user';

// O endpoint inicia o consentimento Google e redireciona para o provedor.
export async function triggerGoogleAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    window.location.assign(UserService.getOAuth2LoginUrl());
    return { success: true };
  } catch {
    return { success: false, error: 'Não foi possível iniciar a conexão com o Google. Tente novamente.' };
  }
}
