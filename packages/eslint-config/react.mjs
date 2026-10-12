import eslintReact from '@eslint-react/eslint-plugin';
import jseslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { baseConfig } from './base.mjs';

/*
 * Shared ESLint config for React projects, published as `@urapps/eslint-config/react`.
 * A consuming project sets `languageOptions.parserOptions.tsconfigRootDir: import.meta.dirname` in its own
 * `eslint.config.mjs`: without it typescript-eslint cannot pick the tsconfig root when several projects are open.
 */

/** Turns off the @eslint-react rules that duplicate the eslint-plugin-react-hooks ones. */
const eslintReactHooksDuplicatesOff = Object.fromEntries(
  Object.keys(eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'].rules).map((rule) => [
    rule.replace('react-hooks/', '@eslint-react/'),
    'off',
  ])
);

export default defineConfig(
  jseslint.configs.recommended,
  tseslint.configs.recommended,
  eslintReact.configs['recommended-typescript'],
  { rules: eslintReactHooksDuplicatesOff },
  reactHooks.configs.flat.recommended,
  baseConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-alert': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  }
);
