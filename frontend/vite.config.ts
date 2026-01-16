import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const hashResolvePlugin = {
  name: 'hash-resolve',
  enforce: 'pre' as const,
  async resolveId(source: string) {
    // Handle special case where # in path might cause issues
    if (source.includes('%23') || (source.startsWith('/') && source.includes('#'))) {
      const decoded = decodeURIComponent(source)
      const resolved = path.resolve(__dirname, './src', decoded.replace(/^\/src\//, ''))
      return resolved
    }
  },
}

export default defineConfig({
  plugins: [hashResolvePlugin, react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    middlewareMode: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
    fs: {
      allow: ['..'],
      strict: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
