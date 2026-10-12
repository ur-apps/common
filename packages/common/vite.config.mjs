import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'emit-declarations',
      apply: 'build',
      writeBundle() {
        execFileSync('tsc', ['-p', 'tsconfig.build.json', '--noEmit', 'false', '--emitDeclarationOnly'], {
          stdio: 'inherit',
        });
      },
    },
  ],
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rolldownOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,js}'],
      exclude: ['**/index.{ts,js}', '**/*.test.data.{ts,js}'],
    },
  },
});
