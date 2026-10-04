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
          if (request.method === 'GET' && request.url?.split('?')[0] === '/v1/verify-email') {
            return '/index.html'
          }
        },
      },
    },
  },
})
