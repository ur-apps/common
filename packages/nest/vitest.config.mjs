import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['**/index.ts', '**/*.test.data.ts'],
    },
  },
});
