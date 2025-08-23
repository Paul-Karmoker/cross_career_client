/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: [
      'pdfjs-dist',
      'jspdf',
      'file-saver',
      'mammoth',
      'react-markdown',
      'rehype-highlight'
    ],
    exclude: ['pdfjs-dist/build/pdf.worker']
  },
  worker: {
    format: 'es',
    plugins: () => [react()]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
})