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
    },
    deps: {
      fallbackCJS: true // https://github.com/chakra-ui/chakra-ui/issues/6783
    }
  },
  ssr: {
    // https://github.com/chakra-ui/chakra-ui/issues/6783
    // required while deps.fallbackCJS is required
    noExternal: ['@chakra-ui/react']
  }
})
