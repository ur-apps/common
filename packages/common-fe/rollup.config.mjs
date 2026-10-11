import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import analyze from 'rollup-plugin-analyzer';
import del from 'rollup-plugin-delete';
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
    del({ targets: OUTPUT_DIR }),
    peerDeps(),
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: 'tsconfig.json' }),
    analyze({ 'summaryOnly': true }),
  ],
};
