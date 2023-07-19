/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // Stop running tests after `n` failures
  bail: 0,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '<rootDir>/../src/**/*.{js,jsx}',
    '<rootDir>/../db/**/*.{js,jsx}',
    '!**/node_modules/**'
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    // 'json',
    // 'text',
    'lcov',
    // 'clover',
    // 'cobertura'
  ],

  // The root directory that Jest should scan for tests and modules within
  rootDir: '__tests__',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [
    'dotenv/config'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.spec.[jt]s?(x)',
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  // Indicates whether each individual test should be reported during the run
  verbose: true
};
