import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    // Jalankan test secara sequential — penting untuk integration tests yang share DB
    sequence: {
      concurrent: false,
    },
    // Timeout lebih panjang untuk DB operations
    testTimeout: 30000,
    hookTimeout: 30000,
    // Hanya file dalam __tests__ folder
    include: ['src/__tests__/**/*.test.ts'],
    // Load env vars
    env: {
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/invit_db?schema=public',
    },
  },
})
