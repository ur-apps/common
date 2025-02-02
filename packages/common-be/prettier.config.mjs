import baseConfig from '@ur-apps/common/prettier';

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  ...baseConfig,
  importOrder: [
    '',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '^(constants|database|db|decorators|dto|exceptions|filters|guards|helpers|interceptors|interfaces|modules|pipes|types)(/.*)?$',
    '',
    '^\\.\\./',
    '',
    '^\\./',
  ],
};

export default config;
