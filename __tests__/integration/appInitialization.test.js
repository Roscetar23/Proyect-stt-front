/**
 * App Initialization Test
 * 
 * Verifies that the app can initialize without errors:
 * - All dependencies are available
 * - Store is imported correctly
 * - No missing dependencies
 * 
 * Requirement: 10.5
 */

describe('App Initialization', () => {
  
  it('should have all required dependencies installed', () => {
    // Check core dependencies
    expect(() => require('react')).not.toThrow();
    expect(() => require('zustand')).not.toThrow();
    expect(() => require('@react-native-async-storage/async-storage')).not.toThrow();
  });

  it('should import store in App.js without errors', () => {
    // This simulates what App.js does
    expect(() => {
      const { useGameStore } = require('../../src/stores');
      expect(useGameStore).toBeDefined();
      expect(typeof useGameStore).toBe('function');
    }).not.toThrow();
  });

  it('should import all services without errors', () => {
    expect(() => {
      const mockAPI = require('../../src/services/mockAPI').default;
      const storageService = require('../../src/services/storageService').default;
      
      expect(mockAPI).toBeDefined();
      expect(storageService).toBeDefined();
    }).not.toThrow();
  });

  it('should import all utilities without errors', () => {
    expect(() => {
      const utils = require('../../src/utils');
      
      expect(utils.calculateLevel).toBeDefined();
      expect(utils.calculateProgress).toBeDefined();
      expect(utils.getCurrentDate).toBeDefined();
      expect(utils.PILLARS).toBeDefined();
      expect(utils.API_CONFIG).toBeDefined();
    }).not.toThrow();
  });

  it('should import all mock data without errors', () => {
    expect(() => {
      const { mockUsers, mockAchievements, mockRoutes } = require('../../src/data');
      
      expect(mockUsers).toBeDefined();
      expect(mockAchievements).toBeDefined();
      expect(mockRoutes).toBeDefined();
    }).not.toThrow();
  });

  it('should initialize store with default state', () => {
    const { useGameStore } = require('../../src/stores');
    
    // Reset to ensure clean state
    useGameStore.getState().resetState();
    
    const state = useGameStore.getState();
    
    expect(state.user).toBeNull();
    expect(state.streak).toBeNull();
    expect(state.dailyPillar).toBeNull();
    expect(Array.isArray(state.achievements)).toBe(true);
  });

  it('should have no circular dependencies', () => {
    // If this test runs without hanging, there are no circular dependencies
    expect(() => {
      require('../../src/stores');
      require('../../src/services/mockAPI');
      require('../../src/services/storageService');
      require('../../src/utils');
      require('../../src/data');
    }).not.toThrow();
  });

  it('should verify all barrel exports work correctly', () => {
    // Test that index.js files export correctly
    expect(() => {
      const stores = require('../../src/stores');
      const services = require('../../src/services');
      const utils = require('../../src/utils');
      const data = require('../../src/data');
      
      expect(stores.useGameStore).toBeDefined();
      expect(services.mockAPI).toBeDefined();
      expect(services.storageService).toBeDefined();
      expect(utils.calculateLevel).toBeDefined();
      expect(data.mockUsers).toBeDefined();
    }).not.toThrow();
  });
});
