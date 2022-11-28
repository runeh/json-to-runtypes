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
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false
  }
};
