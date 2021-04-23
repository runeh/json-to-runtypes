module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '.*.utils.ts',
    '.*/*.fixture.*',
    '.*/*.fixtures.ts',
    '.*/dist/.*',
    '.*/fixtures.ts',
    '.*dist.*',
  ],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
