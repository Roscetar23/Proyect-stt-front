// Jest setup file for additional configuration

// Mock Expo modules
jest.mock('expo', () => ({
  __ExpoImportMetaRegistry: {}
}));

// Mock AsyncStorage with in-memory storage for testing
const mockStorage = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((key, value) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  getItem: jest.fn((key) => {
    return Promise.resolve(mockStorage[key] || null);
  }),
  removeItem: jest.fn((key) => {
    delete mockStorage[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve(Object.keys(mockStorage));
  }),
  multiRemove: jest.fn((keys) => {
    keys.forEach(key => delete mockStorage[key]);
    return Promise.resolve();
  })
}));

// Suppress console warnings during tests (optional)
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn()
};
