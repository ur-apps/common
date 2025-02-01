import { baseConfigs } from '@ur-apps/common/eslint';
import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(jseslint.configs.recommended, tseslint.configs.recommended, baseConfigs, {
  languageOptions: { globals: globals.node },
});
