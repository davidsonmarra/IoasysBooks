module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    './node_modules',
    './example',
    './lib/',
    '<rootDir>/__tests__/jest.setup.ts',
    '<rootDir>/__tests__/test-utils.test.tsx'
  ],
  moduleDirectories: ['node_modules', 'utils', 'src'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  collectCoverageFrom: ['src/**/*.[jt]s?(x)', '!src/**/*.d.[jt]s?(x)', '!src/@types/**'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js'
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
    '<rootDir>/__tests__/jest.setup.ts',
    '@testing-library/jest-native/extend-expect'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@react-native|react-native|@react-native-community|@react-navigation|redux-persist|)'
  ]
};
