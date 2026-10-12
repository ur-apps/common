import baseConfig from './base.mjs';

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
    '^(@app/.*|(adapters|common|config|configs|constants|controllers|core|database|db|decorators|dtos|entities|enums|exceptions|filters|gateways|guards|helpers|interceptors|interfaces|jobs|libs|listeners|middlewares|migrations|models|modules|pipes|processors|providers|queues|repositories|schemas|seeds|services|shared|strategies|subscribers|tasks|types|utils|validators)(/.*)?)$',
    '',
    '^\\.\\./',
    '',
    '^\\./',
  ],
};

export default config;
