import jseslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { baseConfig } from './base.mjs';

/*
 * Shared ESLint config for NestJS projects, published as `@urapps/eslint-config/nest`.
 * A consuming project sets `languageOptions.parserOptions.tsconfigRootDir: import.meta.dirname` in its own
 * `eslint.config.mjs`: without it typescript-eslint cannot pick the tsconfig root when several projects are open.
 */

export default defineConfig(jseslint.configs.recommended, tseslint.configs.recommended, baseConfig, {
  languageOptions: {
    globals: globals.node,
  },
});
