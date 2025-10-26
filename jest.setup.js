/**
  * @file jest.setup.js
  * @tldr This setup file is specified in the Jest config to be run
  *       after the test framework has been installed in the environment
  *       but before the tests are run.
  */

/** 
  * @desc Add additional matchers to Jest
  * @see https://jest-extended.jestcommunity.dev/docs/matchers/
  * @ref https://github.com/jest-community/jest-extended
  */
require('jest-extended');

jest.setTimeout(70000); // extend runtime timeout
