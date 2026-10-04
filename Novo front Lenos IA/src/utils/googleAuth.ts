import { supabase } from '../lib/supabase';

/**
 * Função utilitária para iniciar a autenticação com Google (OAuth)
 */
export async function triggerGoogleAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Tenta autenticação através do Supabase OAuth
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.warn('Google Auth via Supabase:', error.message);
      return {
        success: false,
        error: 'O login com Google via Supabase não está configurado. Verifique as credenciais no painel do Supabase.',
      };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Erro ao acionar login com Google:', err);
    return {
      success: false,
      error: 'Não foi possível se conectar ao serviço de autenticação com Google.',
    };
  }
}
