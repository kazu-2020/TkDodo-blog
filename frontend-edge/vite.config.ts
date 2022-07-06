/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/vitest.setup.ts',
    clearMocks: true,
    coverage: {
      enabled: true,
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage/vitest'
    }
  }
})
