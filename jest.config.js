'use strict';
/**
  * @file jest.config.js
  * @tldr This config should get picked up automatically with default naming and
  *       in the root project directory. I have specified the --config path
  *       within the npm run script for 'test' to make it obvious what config
  *       is being used.
  * @see https://jestjs.io/docs/configuration#defaults
  */
/** @type {import('@jest/types').Config.InitialOptions} */

/** @ref https://github.com/nrwl/nx/issues/812 */
const esModules = ['fs', 'yargs', 'yargs-parser'].join('|');

const config = {
  verbose: true,
  bail: 1,
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js"
  ],
  displayName: {
    color: 'blue',
    name: 'unit tests',
  },
  testPathIgnorePatterns: [
    '/_ref/',
    '/lib/',
    '/assets/',
    '/bin/',
    '/docs/',
    '/node_modules/',
    '/utils/',
    '/src/config/'
  ],
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
  moduleNameMapper: {
    "^node-hid$": "<rootDir>/__mocks__/node-hid.js",
    //"^fs$": "<rootDir>/__mocks__/fs.js",
    //"^yargs$": "<rootDir>/__mocks__/yargs.js",
  },
};

module.exports = config;
