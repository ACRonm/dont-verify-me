import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './apps/web',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@dont-verify-me/ui/(.*)$': '<rootDir>/packages/ui/src/$1',
    '^@dont-verify-me/shared-logic/(.*)$': '<rootDir>/packages/shared-logic/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/apps/', '<rootDir>/packages/'],
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
  },
};

export default createJestConfig(customJestConfig);
