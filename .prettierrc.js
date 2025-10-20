// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    "arrowParens": "always",
    "bracketSameLine": true,
    "objectWrap": "preserve",
    "bracketSpacing": false,
    "semi": true,
    "experimentalOperatorPosition": "end",
    "experimentalTernaries": false,
    "singleQuote": false,
    "jsxSingleQuote": false,
    "quoteProps": "as-needed",
    "trailingComma": "all",
    "singleAttributePerLine": false,
    "htmlWhitespaceSensitivity": "css",
    "vueIndentScriptAndStyle": false,
    "proseWrap": "preserve",
    "insertPragma": false,
    "printWidth": 80,
    "requirePragma": false,
    "tabWidth": 2,
    "useTabs": false,
    "embeddedLanguageFormatting": "auto"
  };
  
  module.exports = config;