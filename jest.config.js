const {createDefaultPreset} = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  transform: {
    ...tsJestTransformCfg,
  }
};
