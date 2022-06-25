import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testPathIgnorePatterns: ['dist', 'node_modules'],
  moduleDirectories: ['src', 'node_modules'],
};

export default config;
