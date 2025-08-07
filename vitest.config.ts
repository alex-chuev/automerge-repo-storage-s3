import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // projects: ['packages/*'],
    globals: true,
    setupFiles: ['./testSetup.ts'],
    // environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      skipFull: true,
      exclude: [
        '**/fuzz',
        '**/helpers',
        '**/coverage',
        'examples/**/*',
        'docs/**/*',
        '**/test/**/*'
      ],
    },
  },
})
