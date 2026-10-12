import config from '@urapps/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig(config, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
