/**
 * Integration tests for gameStore with StreakManager
 * Tests the integration between Zustand store and StreakManager module
 */

import { useGameStore } from '../../../src/stores/gameStore';
import streakManager from '../../../src/modules/streakManager';

describe('gameStore Integration with StreakManager', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGameStore.getState().resetState();
  });

  describe('updateStreak', () => {
    it('should increment currentStreak using StreakManager when pillar is completed', () => {
      // Initialize store with user and streak
      useGameStore.setState({
        user: {
          id: 'user-1',
          currentStreak: 0,
          longestStreak: 0,
          experience: 0,
          level: 1
        },
        streak: {
          currentCount: 0,
          lastCompletedDate: null,
          pillarHistory: []
        },
        dailyPillar: {
          date: new Date().toISOString(),
          pillar: 'nutrition',
          isManuallySet: false,
          target: { type: 'meals', value: 3, unit: 'comidas saludables' },
          progress: 3,
          completed: false
        }
      });

      // Complete the pillar
      useGameStore.getState().updateStreak(true);

      const state = useGameStore.getState();
      
      // Verify streak was incremented
      expect(state.user.currentStreak).toBe(1);
      expect(state.streak.currentCount).toBe(1);
      
      // Verify pillar history was updated
      expect(state.streak.pillarHistory).toHaveLength(1);
      expect(state.streak.pillarHistory[0]).toMatchObject({
        pillar: 'nutrition',
        completed: true
      });
      
      // Verify daily pillar was marked as completed
      expect(state.dailyPillar.completed).toBe(true);
    });

    it('should update longestStreak when currentStreak exceeds it', () => {
      // Create consecutive dates leading up to today
      const today = new Date();
      const dates = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      // Initialize with existing streak
      useGameStore.setState({
        user: {
          id: 'user-1',
          currentStreak: 5,
          longestStreak: 5,
          experience: 0,
          level: 1
        },
        streak: {
          currentCount: 5,
          lastCompletedDate: dates[4],
          pillarHistory: [
            { date: dates[0], pillar: 'nutrition', completed: true },
            { date: dates[1], pillar: 'sleep', completed: true },
            { date: dates[2], pillar: 'movement', completed: true },
            { date: dates[3], pillar: 'nutrition', completed: true },
            { date: dates[4], pillar: 'sleep', completed: true }
          ]
        },
        dailyPillar: {
          date: today.toISOString(),
          pillar: 'movement',
          isManuallySet: false,
          target: { type: 'minutes', value: 30, unit: 'minutos' },
          progress: 30,
          completed: false
        }
      });

      // Complete another pillar
      useGameStore.getState().updateStreak(true);

      const state = useGameStore.getState();
      
      // Verify longestStreak was updated
      expect(state.user.longestStreak).toBe(6);
      expect(state.user.currentStreak).toBe(6);
    });

    it('should add experience when pillar is completed', () => {
      // Initialize store
      useGameStore.setState({
        user: {
          id: 'user-1',
          currentStreak: 0,
          longestStreak: 0,
          experience: 0,
          level: 1
        },
        streak: {
          currentCount: 0,
          lastCompletedDate: null,
          pillarHistory: []
        },
        dailyPillar: {
          date: new Date().toISOString(),
          pillar: 'nutrition',
          isManuallySet: false,
          target: { type: 'meals', value: 3, unit: 'comidas saludables' },
          progress: 3,
          completed: false
        }
      });

      const initialExperience = useGameStore.getState().user.experience;

      // Complete the pillar
      useGameStore.getState().updateStreak(true);

      const state = useGameStore.getState();
      
      // Verify experience was added (PILLAR_COMPLETED = 50)
      expect(state.user.experience).toBe(initialExperience + 50);
    });

    it('should register pillar metrics in history', () => {
      // Initialize store
      useGameStore.setState({
        user: {
          id: 'user-1',
          currentStreak: 0,
          longestStreak: 0,
          experience: 0,
          level: 1
        },
        streak: {
          currentCount: 0,
          lastCompletedDate: null,
          pillarHistory: []
        },
        dailyPillar: {
          date: '2024-01-15T00:00:00.000Z',
          pillar: 'sleep',
          isManuallySet: false,
          target: { type: 'hours', value: 8, unit: 'horas' },
          progress: 8,
          completed: false
        }
      });

      // Complete the pillar
      useGameStore.getState().updateStreak(true);

      const state = useGameStore.getState();
      
      // Verify history entry has metrics
      expect(state.streak.pillarHistory[0]).toMatchObject({
        date: '2024-01-15T00:00:00.000Z',
        pillar: 'sleep',
        completed: true,
        metrics: {
          progress: 8,
          target: { type: 'hours', value: 8, unit: 'horas' }
        }
      });
    });
  });

  describe('rotatePillar', () => {
    it('should use StreakManager for automatic rotation', () => {
      // Initialize store
      useGameStore.setState({
        user: {
          id: 'user-1',
          stats: {
            nutrition: 50,
            sleep: 30,
            movement: 70
          }
        },
        streak: {
          pillarHistory: [
            { date: '2024-01-01', pillar: 'nutrition', completed: true }
          ]
        }
      });

      // Rotate pillar automatically (round-robin)
      useGameStore.getState().rotatePillar(false, null, 'round-robin');

      const state = useGameStore.getState();
      
      // Verify dailyPillar was set
      expect(state.dailyPillar).toBeDefined();
      expect(state.dailyPillar.pillar).toBe('sleep'); // Next in round-robin after nutrition
      expect(state.dailyPillar.isManuallySet).toBe(false);
      expect(state.dailyPillar.completed).toBe(false);
      expect(state.dailyPillar.progress).toBe(0);
    });

    it('should use StreakManager for manual rotation', () => {
      // Initialize store
      useGameStore.setState({
        user: {
          id: 'user-1'
        },
        streak: {
          pillarHistory: []
        }
      });

      // Rotate pillar manually
      useGameStore.getState().rotatePillar(true, 'movement');

      const state = useGameStore.getState();
      
      // Verify dailyPillar was set to selected pillar
      expect(state.dailyPillar.pillar).toBe('movement');
      expect(state.dailyPillar.isManuallySet).toBe(true);
    });

    it('should pass user stats to StreakManager for stats-based strategy', () => {
      // Initialize store with stats
      useGameStore.setState({
        user: {
          id: 'user-1',
          stats: {
            nutrition: 80,
            sleep: 40,
            movement: 90
          }
        },
        streak: {
          pillarHistory: []
        }
      });

      // Rotate using stats-based strategy
      useGameStore.getState().rotatePillar(false, null, 'stats-based');

      const state = useGameStore.getState();
      
      // Verify pillar with lowest stat was selected (sleep = 40)
      expect(state.dailyPillar.pillar).toBe('sleep');
    });

    it('should set correct target based on pillar type', () => {
      // Initialize store
      useGameStore.setState({
        user: { id: 'user-1' },
        streak: { pillarHistory: [] }
      });

      // Rotate to nutrition
      useGameStore.getState().rotatePillar(true, 'nutrition');
      expect(useGameStore.getState().dailyPillar.target).toEqual({
        type: 'meals',
        value: 3,
        unit: 'comidas saludables'
      });

      // Rotate to sleep
      useGameStore.getState().rotatePillar(true, 'sleep');
      expect(useGameStore.getState().dailyPillar.target).toEqual({
        type: 'hours',
        value: 8,
        unit: 'horas'
      });

      // Rotate to movement
      useGameStore.getState().rotatePillar(true, 'movement');
      expect(useGameStore.getState().dailyPillar.target).toEqual({
        type: 'minutes',
        value: 30,
        unit: 'minutos'
      });
    });
  });
});
