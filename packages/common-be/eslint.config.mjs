import { coreConfig } from '@ur-apps/common/eslint';
import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  jseslint.configs.recommended,
  tseslint.configs.recommended,
  coreConfig
);
