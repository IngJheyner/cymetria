/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Rutas de tests
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/index.ts',
  ],
  
  // Path aliases (matching tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Configuración de ts-jest
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        // Configuración específica para tests
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }]
  },
  
  // Timeouts
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks after each test
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

