import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          ui: ['lucide-react', 'clsx', 'react-hot-toast'],
          forms: ['react-dropzone', 'qrcode.react'],
          store: ['zustand', 'axios', 'date-fns'],
        },
      },
    },
  },
})
