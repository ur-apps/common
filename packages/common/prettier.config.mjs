/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  endOfLine: 'lf',
  quoteProps: 'preserve',
  trailingComma: 'es5',
  arrowParens: 'always',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrderCaseSensitive: false,
  importOrder: [
    '',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '^(constants|helpers|types|utils)(/.*)?$',
    '',
    '^\\.\\./',
    '',
    '^\\./',
  ],
};

export default config;
