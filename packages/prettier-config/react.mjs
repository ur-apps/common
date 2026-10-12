import baseConfig from './base.mjs';

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  ...baseConfig,
  bracketSameLine: true,
  jsxSingleQuote: false,
  importOrder: [
    '',
    '^react$',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '^(@/.*|(actions|api|app|assets|components|config|configs|constants|contexts|data|DI|entities|features|fonts|helpers|hooks|i18n|icons|images|layouts|lib|locales|modules|pages|providers|queries|routes|schemas|services|shared|store|stores|styles|theme|types|ui|utils|widgets)(/.*)?)$',
    '',
    '^\\.\\./',
    '',
    '^(?!.*[.](css|scss|sass|less)$)[./].*$',
    '[.](css|scss|sass|less)$',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
};

export default config;
