// @ts-check

import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config} */
export const coreConfig = {
  name: 'eslint-urapps-core-config',
  files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  rules: {
    'camelcase': [
      'warn',
      { properties: 'always', ignoreDestructuring: false, ignoreImports: true, ignoreGlobals: true },
    ],
    'complexity': ['warn', { max: 18 }], // temprorary 18, need to think about it
    'default-case': 'warn',
    'dot-notation': 'warn',
    'eqeqeq': 'warn',
    'grouped-accessor-pairs': ['warn', 'getBeforeSet'],
    'max-depth': ['warn', { max: 4 }],
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'no-else-return': 'warn',
    'no-empty-function': 'warn',
    'no-eq-null': 'warn',
    'no-return-assign': ['warn', 'except-parens'],
    'no-self-compare': 'warn',
    'no-unneeded-ternary': 'warn',
    'no-useless-rename': 'warn',
    'no-useless-return': 'warn', // need to think about it https://eslint.org/docs/latest/rules/no-useless-return
    'prefer-const': 'warn',
    'require-await': 'warn',
    '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': 'allow-with-description' }],
    '@typescript-eslint/default-param-last': 'warn',
    '@typescript-eslint/max-params': ['warn', { max: 4 }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  ignores: ['node_modules', 'dist', 'build', 'lib'],
};

export default tseslint.config(jseslint.configs.recommended, tseslint.configs.recommended, coreConfig);
