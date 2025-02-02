import baseConfig from '@ur-apps/common/prettier';

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
    '^(api|assets|components|constants|contexts|data|DI|fonts|hooks|icons|images|layouts|modules|pages|routes|services|store|styles|types|utils)/?',
    '',
    '^\\.\\./',
    '',
    '^(?!.*[.](css|scss|sass|less)$)[./].*$',
    '[.](css|scss|sass|less)$',
  ],
};

export default config;
