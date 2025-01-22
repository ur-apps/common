import baseConfig from "@ur-apps/common/prettier";

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  ...baseConfig,
  jsxBracketSameLine: true,
  jsxSingleQuote: false,
};

export default config;
