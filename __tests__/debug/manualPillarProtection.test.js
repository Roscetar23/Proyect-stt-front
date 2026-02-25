/**
 * Test to verify that manually selected pillars are protected from auto-rotation
 * 
 * This test verifies the fix for the bug where:
 * - User manually selects a pillar
 * - Returns to home screen
 * - usePillarRotation hook triggers auto-rotation
 * - Manual selection gets overwritten
 */

import { useGameStore } from '../../src/stores/gameStore';

describe('Manual Pillar Protection', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  test('should NOT auto-rotate when pillar was manually set today', () => {
    // Setup: User manually selects a pillar
    const manualPillar = {
      date: new Date().toISOString(),
      pillar: 'sleep',
      isManuallySet: true, // This is the key flag
      target: { type: 'hours', value: 8, unit: 'horas' },
      progress: 0,
      completed: false
    };

    useGameStore.setState({
      dailyPillar: manualPillar,
      user: { currentStreak: 5, longestStreak: 10 },
      streak: { currentCount: 5, pillarHistory: [] },
      lastRotationCheck: null
    });

    console.log('Initial state (manual selection):', useGameStore.getState().dailyPillar);

    // Action: Auto-rotation is triggered (by usePillarRotation hook)
    useGameStore.getState().rotatePillar(false); // false = automatic

    // Verify: Pillar should NOT have changed
    const finalState = useGameStore.getState();
    console.log('Final state after auto-rotation attempt:', finalState.dailyPillar);
    
    expect(finalState.dailyPillar.pillar).toBe('sleep'); // Should still be sleep
    expect(finalState.dailyPillar.isManuallySet).toBe(true); // Should still be manual
  });

  test('should allow manual rotation to override previous manual selection', () => {
    // Setup: User has a manually selected pillar
    const firstManualPillar = {
      date: new Date().toISOString(),
      pillar: 'sleep',
      isManuallySet: true,
      target: { type: 'hours', value: 8, unit: 'horas' },
      progress: 0,
      completed: false
    };

    useGameStore.setState({
      dailyPillar: firstManualPillar,
      user: { currentStreak: 5, longestStreak: 10 },
      streak: { currentCount: 5, pillarHistory: [] }
    });

    // Action: User manually changes to a different pillar
    useGameStore.getState().rotatePillar(true, 'movement'); // true = manual

    // Verify: Pillar should have changed
    const finalState = useGameStore.getState();
    expect(finalState.dailyPillar.pillar).toBe('movement');
    expect(finalState.dailyPillar.isManuallySet).toBe(true);
  });

  test('should allow auto-rotation on a new day even if previous day was manual', () => {
    // Setup: User has a manually selected pillar from yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayManualPillar = {
      date: yesterday.toISOString(),
      pillar: 'sleep',
      isManuallySet: true,
      target: { type: 'hours', value: 8, unit: 'horas' },
      progress: 0,
      completed: false
    };

    useGameStore.setState({
      dailyPillar: yesterdayManualPillar,
      user: { currentStreak: 5, longestStreak: 10 },
      streak: { currentCount: 5, pillarHistory: [] },
      lastRotationCheck: null
    });

    // Action: Auto-rotation is triggered (new day)
    useGameStore.getState().rotatePillar(false); // false = automatic

    // Verify: Pillar should have rotated (because it's a new day)
    const finalState = useGameStore.getState();
    expect(finalState.dailyPillar.date).not.toBe(yesterdayManualPillar.date);
    expect(finalState.dailyPillar.isManuallySet).toBe(false); // Should be automatic now
  });

  test('should protect manual selection even with multiple auto-rotation attempts', () => {
    // Setup: User manually selects a pillar
    const manualPillar = {
      date: new Date().toISOString(),
      pillar: 'movement',
      isManuallySet: true,
      target: { type: 'minutes', value: 30, unit: 'minutos' },
      progress: 0,
      completed: false
    };

    useGameStore.setState({
      dailyPillar: manualPillar,
      user: { currentStreak: 5, longestStreak: 10 },
      streak: { currentCount: 5, pillarHistory: [] },
      lastRotationCheck: null
    });

    // Action: Multiple auto-rotation attempts (simulating the interval in usePillarRotation)
    useGameStore.getState().rotatePillar(false);
    useGameStore.getState().rotatePillar(false);
    useGameStore.getState().rotatePillar(false);

    // Verify: Pillar should still be the manual selection
    const finalState = useGameStore.getState();
    expect(finalState.dailyPillar.pillar).toBe('movement');
    expect(finalState.dailyPillar.isManuallySet).toBe(true);
  });
});
