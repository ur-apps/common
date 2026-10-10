import { rmSync } from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import analyze from 'rollup-plugin-analyzer';
import peerDeps from 'rollup-plugin-peer-deps-external';

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
    peerDeps(),
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: 'tsconfig.build.json' }),
    analyze({ 'summaryOnly': true }),
  ],
};
