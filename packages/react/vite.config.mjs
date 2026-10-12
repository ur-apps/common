import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';

import pkg from './package.json' with { type: 'json' };

const peerDependencies = Object.keys(pkg.peerDependencies);

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
      external: (id) => peerDependencies.some((name) => id === name || id.startsWith(`${name}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/index.{ts,tsx}'],
    },
  },
});
