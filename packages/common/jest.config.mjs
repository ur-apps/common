/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',
  // Options that will be passed to the testEnvironment
  testEnvironment: 'node',
  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'ts'],
  // The root directory that Jest should scan for tests and modules within
  rootDir: '.',
  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: ['.*\\.spec\\.ts$', '.*\\.test\\.ts$'],
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['index.(t|j)s$', '.test.data.(t|j)s$'],
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
};
