import { defineConfig } from 'eslint/config';

import config from './base.mjs';

export default defineConfig(config, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
