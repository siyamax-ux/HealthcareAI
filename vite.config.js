import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In local dev, proxy /api/* to the backend running on localhost:5000.
      // The hardcoded LAN IP is removed — use VITE_API_BASE_URL for custom hosts.
      '/api': {
        target: process.env.VITE_DEV_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
