import path from 'path';
import { fileURLToPath } from 'url';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import analyze from 'rollup-plugin-analyzer';
import del from 'rollup-plugin-delete';
import peerDeps from 'rollup-plugin-peer-deps-external';
import tscAlias from 'rollup-plugin-tsc-alias';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    alias({
      entries: {
        constants: path.resolve(__dirname, 'src', 'constants'),
        contexts: path.resolve(__dirname, 'src', 'contexts'),
        data: path.resolve(__dirname, 'src', 'data'),
        hooks: path.resolve(__dirname, 'src', 'hooks'),
        services: path.resolve(__dirname, 'src', 'services'),
        types: path.resolve(__dirname, 'src', 'types'),
        utils: path.resolve(__dirname, 'src', 'utils'),
      },
    }),
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: 'tsconfig.json' }),
    tscAlias(),
    analyze({ 'summaryOnly': true }),
  ],
};
