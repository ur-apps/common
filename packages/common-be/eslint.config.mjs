import jseslint from '@eslint/js';
import { baseConfigs } from '@urapps/common/eslint';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(jseslint.configs.recommended, tseslint.configs.recommended, baseConfigs, {
  languageOptions: {
    globals: globals.node,
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
