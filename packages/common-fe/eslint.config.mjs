import { baseConfigs } from '@ur-apps/common/eslint';
import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reacteslint from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  jseslint.configs.recommended,
  tseslint.configs.recommended,
  reacteslint.configs.flat.recommended,
  baseConfigs,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-alert': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': ['error', { 'extensions': ['.jsx', '.tsx'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      react: {
        version: '19',
      },
    },
  }
);
