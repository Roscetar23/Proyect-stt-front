/**
 * Debug test for pillar change issue
 * 
 * This test reproduces the user's reported issue:
 * - User presses "Cambiar Pilar" button
 * - Selects a new pillar
 * - Confirms selection
 * - Returns to main screen
 * - Pillar has NOT changed (still showing the same pillar)
 */

import { useGameStore } from '../../src/stores/gameStore';
import streakManager from '../../src/modules/streakManager';

describe('Pillar Change Debug', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().resetState();
  });

  test('should change pillar when selectPillar is called', () => {
    // Setup: Initialize with a pillar
    const initialPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      isManuallySet: false,
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 0,
      completed: false
    };

    useGameStore.setState({
      dailyPillar: initialPillar,
      user: { currentStreak: 5, longestStreak: 10 },
      streak: { currentCount: 5, pillarHistory: [] }
    });

    // Verify initial state
    const initialState = useGameStore.getState();
    console.log('Initial dailyPillar:', initialState.dailyPillar);
    expect(initialState.dailyPillar.pillar).toBe('nutrition');

    // Action: User selects a different pillar (sleep)
    useGameStore.getState().rotatePillar(true, 'sleep');

    // Verify: Pillar should have changed
    const finalState = useGameStore.getState();
    console.log('Final dailyPillar:', finalState.dailyPillar);
    expect(finalState.dailyPillar.pillar).toBe('sleep');
    expect(finalState.dailyPillar.isManuallySet).toBe(true);
  });

  test('should change pillar even when progress > 0', () => {
    // Setup: Initialize with a pillar that has progress
    const initialPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      isManuallySet: false,
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 2, // User has made progress
      completed: false
    };

    useGameStore.setState({
      dailyPillar: initialPillar,
      user: { currentStreak: 5, longestStreak: 10 },
      streak: { currentCount: 5, pillarHistory: [] }
    });

    // Verify initial state
    expect(useGameStore.getState().dailyPillar.pillar).toBe('nutrition');
    expect(useGameStore.getState().dailyPillar.progress).toBe(2);

    // Action: User selects a different pillar (movement)
    useGameStore.getState().rotatePillar(true, 'movement');

    // Verify: Pillar should have changed and progress reset
    const finalState = useGameStore.getState();
    expect(finalState.dailyPillar.pillar).toBe('movement');
    expect(finalState.dailyPillar.progress).toBe(0);
    expect(finalState.dailyPillar.isManuallySet).toBe(true);
  });

  test('should NOT change pillar when completed', () => {
    // Setup: Initialize with a completed pillar
    const initialPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      isManuallySet: false,
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: true // Pillar is completed
    };

    useGameStore.setState({
      dailyPillar: initialPillar,
      user: { currentStreak: 5, longestStreak: 10 },
      streak: { currentCount: 5, pillarHistory: [] }
    });

    // Note: The UI (PillarSelectionScreen) blocks this, but the store doesn't
    // The store will still allow the change, which might be the issue
    
    // Action: Try to change pillar (this should be blocked by UI)
    useGameStore.getState().rotatePillar(true, 'sleep');

    // The store WILL change it (no validation in store)
    const finalState = useGameStore.getState();
    expect(finalState.dailyPillar.pillar).toBe('sleep');
    // This shows that the store doesn't validate completion status
  });

  test('should update dailyPillar reference (not mutate)', () => {
    // Setup
    const initialPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      isManuallySet: false,
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 0,
      completed: false
    };

    useGameStore.setState({
      dailyPillar: initialPillar,
      user: { currentStreak: 5, longestStreak: 10 },
      streak: { currentCount: 5, pillarHistory: [] }
    });

    const beforeReference = useGameStore.getState().dailyPillar;

    // Action: Change pillar
    useGameStore.getState().rotatePillar(true, 'sleep');

    const afterReference = useGameStore.getState().dailyPillar;

    // Verify: Should be a new object reference (important for React re-renders)
    expect(beforeReference).not.toBe(afterReference);
    expect(beforeReference.pillar).toBe('nutrition');
    expect(afterReference.pillar).toBe('sleep');
  });
});
