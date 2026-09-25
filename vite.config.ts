import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'

const APP_VERSION = '2.4.5'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/admin': 'http://127.0.0.1:8000',
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/persqft-app-v${APP_VERSION}.js`,
        chunkFileNames: `assets/persqft-chunk-[name]-v${APP_VERSION}.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return `assets/persqft-styles-v${APP_VERSION}.css`
          }
          return `assets/[name]-[hash].[ext]`
        }
      }
    }
  }
})

