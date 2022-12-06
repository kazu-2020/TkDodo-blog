/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined'
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  },
  // @ts-ignore
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/vitest.setup.ts',
    clearMocks: true,
    coverage: {
      enabled: false,
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage/vitest'
    },
    deps: {
      fallbackCJS: true // https://github.com/chakra-ui/chakra-ui/issues/6783
    },
    includeSource: ['./src/**/*.{ts,tsx,js}']
  },
  ssr: {
    // https://github.com/chakra-ui/chakra-ui/issues/6783
    // required while deps.fallbackCJS is required
    noExternal: ['@chakra-ui/react']
  }
})
