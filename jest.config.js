module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/src/**/*.test.ts',
    '**/dist/**/*.test.js'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
