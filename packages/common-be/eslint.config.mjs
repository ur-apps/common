import jseslint from '@eslint/js';
import { baseConfigs } from '@ur-apps/common/eslint';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(jseslint.configs.recommended, tseslint.configs.recommended, baseConfigs, {
  languageOptions: { globals: globals.node },
});
