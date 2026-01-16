import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Get the current working directory
const cwd = process.cwd()
const srcDir = path.join(cwd, 'src')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
    fs: {
      allow: ['.'],
      strict: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
