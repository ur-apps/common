import { rmSync } from 'fs';
import typescript from '@rollup/plugin-typescript';
import analyze from 'rollup-plugin-analyzer';

const OUTPUT_DIR = 'lib';

/** @type {(import('rollup').MergedRollupOptions)} */
export default {
  input: ['src/index.ts'],
  output: [
    {
      dir: OUTPUT_DIR,
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: [
    {
      name: 'clean-output',
      buildStart() {
        rmSync(OUTPUT_DIR, { recursive: true, force: true });
      },
    },
    typescript({ tsconfig: 'tsconfig.build.json' }),
    analyze({ 'summaryOnly': true }),
  ],
};
