import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_API_URL')
  if (!env.VITE_API_URL) throw new Error('Configure VITE_API_URL no arquivo .env.')
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
