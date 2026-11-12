import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_API_URL')
  if (!env.VITE_API_URL) throw new Error('Configure VITE_API_URL no arquivo .env.')
  const target = new URL(env.VITE_API_URL.trim());
  if (command === 'build' && mode === 'production' && (target.origin !== 'https://api.lenos-ia.com.br' || target.pathname !== '/' || target.username || target.password || target.search || target.hash)) {
    throw new Error('O build de produção exige a origem oficial da API, sem caminhos ou credenciais.');
  }
  return {
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
        bypass: (request) => {
          const pagePaths = ['/v1/verify-email', '/v1/user/verify-email', '/v1/reset-password', '/v1/user/reset-password', '/v1/confirm-email', '/v1/user/confirm-email']
          if (request.method === 'GET' && pagePaths.includes(request.url?.split('?')[0] || '')) {
            return '/index.html'
          }
        },
      },
    },
  },
  }
})
