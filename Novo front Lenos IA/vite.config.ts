import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: process.env.VITE_API_PROXY || 'https://api.lenos-ia.com.br',
        changeOrigin: true,
        secure: true,
        bypass: (request) => {
          const pagePaths = ['/v1/verify-email', '/v1/reset-password', '/v1/user/reset-password']
          if (request.method === 'GET' && pagePaths.includes(request.url?.split('?')[0] || '')) {
            return '/index.html'
          }
        },
      },
    },
  },
})
