import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-office-docx': ['@vue-office/docx'],
          'vue-office-excel': ['@vue-office/excel'],
          'vue-office-pptx': ['@vue-office/pptx'],
          'vue-office-pdf': ['@vue-office/pdf']
        }
      }
    }
  }
})
