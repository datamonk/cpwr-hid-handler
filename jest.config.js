'use strict';
/**
  * @file jest.config.js
  * @ref https://jestjs.io/docs/configuration#defaults
  * @tldr This config should get picked up automatically with default naming and
  *       in the root project directory. I have specified the --config path
  *       within the npm run script for 'test' to make it obvious what config
  *       is being used.
*/

// Sync object
///** @type {import('jest').Config} */
/** @type {import('@jest/types').Config.InitialOptions} */

// transform pattern pulled from => https://github.com/nrwl/nx/issues/812
//const esModules = ['fs', 'child_process'].join('|');
const esModules = ['yargs', 'yargs-parser'].join('|');

const config = {
  verbose: true,
  bail: 1,
  setupFilesAfterEnv: [
    './jest.setup.js'
  ],
  displayName: {
    color: 'blue',
    name: 'unit tests',
  },
  testPathIgnorePatterns: [
    '/assets/',
    '/bin/',
    '/docs/',
    '/node_modules/',
    '/utils/'
  ],
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
  //extensionsToTreatAsEsm: [
  //  '.ts', '.tsx', '.mjs'
  //],
  moduleNameMapper: {
    "^node-hid$": "<rootDir>/__mocks__/node-hid.js",
    //"^yargs$": "<rootDir>/__mocks__/yargs.js",
  },
};

module.exports = config;
