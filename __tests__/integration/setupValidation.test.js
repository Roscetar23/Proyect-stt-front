/**
 * Integration Tests - Setup Validation
 * 
 * Validates that all infrastructure components work together correctly:
 * - Zustand Store can be imported and used
 * - Mock API Service can be invoked and returns data
 * - Storage Service can persist and retrieve data
 * - Mock Data is accessible from anywhere
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

describe('Setup Validation - Integration Tests', () => {
  
  // Requirement 10.1: Can import and use Zustand Store without errors
  describe('Zustand Store Integration', () => {
    it('should import Zustand Store without errors', () => {
      expect(() => {
        const { useGameStore } = require('../../src/stores');
        expect(useGameStore).toBeDefined();
      }).not.toThrow();
    });

    it('should access store state without errors', () => {
      const { useGameStore } = require('../../src/stores');
      const state = useGameStore.getState();
      
      expect(state).toBeDefined();
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('streak');
      expect(state).toHaveProperty('dailyPillar');
      expect(state).toHaveProperty('achievements');
    });

    it('should have all required actions', () => {
      const { useGameStore } = require('../../src/stores');
      const state = useGameStore.getState();
      
      expect(typeof state.updateStreak).toBe('function');
      expect(typeof state.rotatePillar).toBe('function');
      expect(typeof state.addExperience).toBe('function');
      expect(typeof state.unlockAchievement).toBe('function');
      expect(typeof state.initializeUser).toBe('function');
      expect(typeof state.resetState).toBe('function');
    });

    it('should execute store actions without errors', () => {
      const { useGameStore } = require('../../src/stores');
      
      expect(() => {
        useGameStore.getState().initializeUser({
          id: 'test-user',
          name: 'Test User',
          level: 1,
          experience: 0,
          currentStreak: 0,
          longestStreak: 0,
          selectedRoute: 'beginner',
          completedAchievements: [],
          stats: { nutrition: 0, sleep: 0, movement: 0 }
        });
      }).not.toThrow();
      
      expect(() => {
        useGameStore.getState().addExperience(50);
      }).not.toThrow();
      
      expect(() => {
        useGameStore.getState().rotatePillar();
      }).not.toThrow();
      
      // Cleanup
      useGameStore.getState().resetState();
    });
  });

  // Requirement 10.2: Can invoke Mock API methods and receive data
  describe('Mock API Service Integration', () => {
    it('should import Mock API Service without errors', () => {
      expect(() => {
        const mockAPI = require('../../src/services/mockAPI').default;
        expect(mockAPI).toBeDefined();
      }).not.toThrow();
    });

    it('should invoke getUserData and receive valid data', async () => {
      const mockAPI = require('../../src/services/mockAPI').default;
      
      const userData = await mockAPI.getUserData('user-001');
      
      expect(userData).toBeDefined();
      expect(userData.id).toBe('user-001');
      expect(userData).toHaveProperty('name');
      expect(userData).toHaveProperty('level');
      expect(userData).toHaveProperty('experience');
      expect(userData).toHaveProperty('currentStreak');
      expect(userData).toHaveProperty('longestStreak');
      expect(userData).toHaveProperty('selectedRoute');
      expect(userData).toHaveProperty('completedAchievements');
      expect(userData).toHaveProperty('stats');
    });

    it('should invoke getAchievements and receive valid data', async () => {
      const mockAPI = require('../../src/services/mockAPI').default;
      
      const achievements = await mockAPI.getAchievements('user-001');
      
      expect(achievements).toBeDefined();
      expect(Array.isArray(achievements)).toBe(true);
      expect(achievements.length).toBeGreaterThan(0);
      
      // Verify first achievement has required properties
      const firstAchievement = achievements[0];
      expect(firstAchievement).toHaveProperty('id');
      expect(firstAchievement).toHaveProperty('title');
      expect(firstAchievement).toHaveProperty('description');
      expect(firstAchievement).toHaveProperty('icon');
      expect(firstAchievement).toHaveProperty('category');
      expect(firstAchievement).toHaveProperty('requirement');
    });

    it('should invoke getLevelRoutes and receive valid data', async () => {
      const mockAPI = require('../../src/services/mockAPI').default;
      
      const routes = await mockAPI.getLevelRoutes();
      
      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
      expect(routes.length).toBe(4); // beginner, intermediate, advanced, expert
      
      // Verify first route has required properties
      const firstRoute = routes[0];
      expect(firstRoute).toHaveProperty('id');
      expect(firstRoute).toHaveProperty('name');
      expect(firstRoute).toHaveProperty('description');
      expect(firstRoute).toHaveProperty('levels');
    });

    it('should invoke updateStreak and receive valid response', async () => {
      const mockAPI = require('../../src/services/mockAPI').default;
      
      const result = await mockAPI.updateStreak('user-001', { currentCount: 5 });
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('streak');
      expect(result.streak).toHaveProperty('currentCount');
      expect(result.streak).toHaveProperty('lastCompletedDate');
    });

    it('should simulate network delay', async () => {
      const mockAPI = require('../../src/services/mockAPI').default;
      
      const startTime = Date.now();
      await mockAPI.getUserData('user-001');
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      
      // Should take at least 400ms (allowing some margin for 500ms delay)
      expect(duration).toBeGreaterThanOrEqual(400);
    });
  });

  // Requirement 10.3: Can persist and retrieve data with Storage Service
  describe('Storage Service Integration', () => {
    const storageService = require('../../src/services/storageService').default;
    
    beforeEach(async () => {
      // Clean up before each test
      await storageService.clear();
    });

    afterAll(async () => {
      // Clean up after all tests
      await storageService.clear();
    });

    it('should import Storage Service without errors', () => {
      expect(() => {
        const storage = require('../../src/services/storageService').default;
        expect(storage).toBeDefined();
      }).not.toThrow();
    });

    it('should persist and retrieve simple data', async () => {
      const testData = { test: 'value', number: 123 };
      
      await storageService.setItem('test-key', testData);
      const retrieved = await storageService.getItem('test-key');
      
      expect(retrieved).toEqual(testData);
    });

    it('should persist and retrieve complex data', async () => {
      const complexData = {
        user: {
          id: 'user-001',
          name: 'Test User',
          level: 5,
          experience: 2500,
          stats: {
            nutrition: 75,
            sleep: 60,
            movement: 80
          },
          achievements: ['first_week', 'level_5']
        },
        timestamp: new Date().toISOString()
      };
      
      await storageService.setItem('complex-key', complexData);
      const retrieved = await storageService.getItem('complex-key');
      
      expect(retrieved).toEqual(complexData);
    });

    it('should return null for non-existent keys', async () => {
      const result = await storageService.getItem('non-existent-key');
      expect(result).toBeNull();
    });

    it('should remove items correctly', async () => {
      await storageService.setItem('remove-test', { data: 'test' });
      
      let retrieved = await storageService.getItem('remove-test');
      expect(retrieved).not.toBeNull();
      
      await storageService.removeItem('remove-test');
      
      retrieved = await storageService.getItem('remove-test');
      expect(retrieved).toBeNull();
    });

    it('should clear all items with prefix', async () => {
      await storageService.setItem('key1', { data: 'test1' });
      await storageService.setItem('key2', { data: 'test2' });
      await storageService.setItem('key3', { data: 'test3' });
      
      await storageService.clear();
      
      const key1 = await storageService.getItem('key1');
      const key2 = await storageService.getItem('key2');
      const key3 = await storageService.getItem('key3');
      
      expect(key1).toBeNull();
      expect(key2).toBeNull();
      expect(key3).toBeNull();
    });

    it('should get all keys with prefix', async () => {
      await storageService.setItem('test-key-1', { data: 'test1' });
      await storageService.setItem('test-key-2', { data: 'test2' });
      
      const keys = await storageService.getAllKeys();
      
      expect(Array.isArray(keys)).toBe(true);
      expect(keys.length).toBeGreaterThanOrEqual(2);
      
      // All keys should have the prefix
      keys.forEach(key => {
        expect(key).toMatch(/^@gamification:/);
      });
    });
  });

  // Requirement 10.4: Can access Mock Data from anywhere
  describe('Mock Data Accessibility', () => {
    it('should import mock users without errors', () => {
      expect(() => {
        const { mockUsers } = require('../../src/data');
        expect(mockUsers).toBeDefined();
        expect(Array.isArray(mockUsers)).toBe(true);
      }).not.toThrow();
    });

    it('should import mock achievements without errors', () => {
      expect(() => {
        const { mockAchievements } = require('../../src/data');
        expect(mockAchievements).toBeDefined();
        expect(Array.isArray(mockAchievements)).toBe(true);
      }).not.toThrow();
    });

    it('should import mock routes without errors', () => {
      expect(() => {
        const { mockRoutes } = require('../../src/data');
        expect(mockRoutes).toBeDefined();
        expect(Array.isArray(mockRoutes)).toBe(true);
      }).not.toThrow();
    });

    it('should access mock users with complete data', () => {
      const { mockUsers } = require('../../src/data');
      
      expect(mockUsers.length).toBeGreaterThanOrEqual(2);
      
      mockUsers.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('level');
        expect(user).toHaveProperty('experience');
        expect(user).toHaveProperty('currentStreak');
        expect(user).toHaveProperty('longestStreak');
        expect(user).toHaveProperty('selectedRoute');
        expect(user).toHaveProperty('completedAchievements');
        expect(user).toHaveProperty('stats');
      });
    });

    it('should access mock achievements with complete data', () => {
      const { mockAchievements } = require('../../src/data');
      
      expect(mockAchievements.length).toBeGreaterThanOrEqual(10);
      
      mockAchievements.forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('title');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('icon');
        expect(achievement).toHaveProperty('category');
        expect(achievement).toHaveProperty('requirement');
        expect(achievement).toHaveProperty('unlockedAt');
      });
    });

    it('should access mock routes with complete data', () => {
      const { mockRoutes } = require('../../src/data');
      
      expect(mockRoutes.length).toBe(4);
      
      mockRoutes.forEach(route => {
        expect(route).toHaveProperty('id');
        expect(route).toHaveProperty('name');
        expect(route).toHaveProperty('description');
        expect(route).toHaveProperty('levels');
        expect(Array.isArray(route.levels)).toBe(true);
      });
    });
  });

  // End-to-end integration test
  describe('End-to-End Integration', () => {
    it('should complete a full user flow without errors', async () => {
      const { useGameStore } = require('../../src/stores');
      const mockAPI = require('../../src/services/mockAPI').default;
      const storageService = require('../../src/services/storageService').default;
      
      // 1. Fetch user data from Mock API
      const userData = await mockAPI.getUserData('user-001');
      expect(userData).toBeDefined();
      
      // 2. Initialize store with user data
      useGameStore.getState().initializeUser(userData);
      const state = useGameStore.getState();
      expect(state.user).toEqual(userData);
      
      // 3. Perform some actions
      useGameStore.getState().addExperience(50);
      useGameStore.getState().rotatePillar();
      
      // 4. Verify state updated
      const updatedState = useGameStore.getState();
      expect(updatedState.user.experience).toBe(userData.experience + 50);
      expect(updatedState.dailyPillar).not.toBeNull();
      
      // 5. Persist data manually
      await storageService.setItem('test-game-state', updatedState);
      
      // 6. Retrieve persisted data
      const persistedState = await storageService.getItem('test-game-state');
      expect(persistedState).toBeDefined();
      expect(persistedState.user.experience).toBe(userData.experience + 50);
      
      // Cleanup
      useGameStore.getState().resetState();
      await storageService.removeItem('test-game-state');
    });
  });
});
