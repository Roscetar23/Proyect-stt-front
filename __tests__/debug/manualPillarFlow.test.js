/**
 * Test de flujo completo para cambio manual de pilar
 * Reproduce el bug reportado donde manual=true no llega correctamente
 */

import { useGameStore } from '../../src/stores/gameStore';
import streakManager from '../../src/modules/streakManager';

describe('Manual Pillar Flow Debug', () => {
  beforeEach(() => {
    // Reset store
    useGameStore.getState().resetState();
    
    // Spy on console.log to capture logs
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('should pass manual=true through the entire flow', () => {
    const store = useGameStore.getState();
    
    // Initialize user and streak
    store.initializeUser({
      id: 'test-user',
      currentStreak: 0,
      longestStreak: 0,
      experience: 0,
      level: 1,
      stats: { nutrition: 0, sleep: 0, movement: 0 }
    });
    
    useGameStore.setState({
      streak: {
        currentCount: 0,
        lastCompletedDate: null,
        pillarHistory: []
      }
    });
    
    // Set initial daily pillar (today, nutrition)
    const today = new Date().toISOString();
    useGameStore.setState({
      dailyPillar: {
        pillar: 'nutrition',
        date: today,
        completed: false,
        progress: 0,
        target: { value: 3, unit: 'meals' }
      }
    });
    
    console.log('\n=== TEST: Simulating manual pillar change ===');
    console.log('Initial pillar:', useGameStore.getState().dailyPillar.pillar);
    
    // Clear previous logs
    console.log.mockClear();
    
    // Simulate manual pillar change (like clicking "Cambiar Pilar")
    // This should call rotatePillar with manual=true
    store.rotatePillar(true, 'sleep');
    
    // Capture all console.log calls
    const logCalls = console.log.mock.calls;
    console.log('\n=== Captured logs ===');
    logCalls.forEach(call => {
      console.log(...call);
    });
    
    // Verify the log shows manual=true
    const rotateLog = logCalls.find(call => 
      call[0]?.includes('[gameStore] rotatePillar called with:')
    );
    
    expect(rotateLog).toBeDefined();
    console.log('\n=== rotatePillar log ===');
    console.log(rotateLog);
    
    // Extract the parameters object from the log
    const params = rotateLog[1];
    console.log('\n=== Parameters ===');
    console.log('manual:', params.manual);
    console.log('selectedPillar:', params.selectedPillar);
    console.log('strategy:', params.strategy);
    
    // Verify manual is true
    expect(params.manual).toBe(true);
    expect(params.selectedPillar).toBe('sleep');
    
    // Verify the pillar was actually changed
    const newDailyPillar = useGameStore.getState().dailyPillar;
    console.log('\n=== Result ===');
    console.log('New pillar:', newDailyPillar.pillar);
    expect(newDailyPillar.pillar).toBe('sleep');
    
    // Verify the "already current" log was NOT triggered
    const alreadyCurrentLog = logCalls.find(call =>
      call[0]?.includes('Daily pillar is already current, skipping rotation')
    );
    expect(alreadyCurrentLog).toBeUndefined();
  });

  test('should NOT skip rotation when manual=true even if pillar is current', () => {
    const store = useGameStore.getState();
    
    // Initialize user and streak
    store.initializeUser({
      id: 'test-user',
      currentStreak: 0,
      longestStreak: 0,
      experience: 0,
      level: 1,
      stats: { nutrition: 0, sleep: 0, movement: 0 }
    });
    
    useGameStore.setState({
      streak: {
        currentCount: 0,
        lastCompletedDate: null,
        pillarHistory: []
      }
    });
    
    // Set initial daily pillar (today, nutrition)
    const today = new Date().toISOString();
    useGameStore.setState({
      dailyPillar: {
        pillar: 'nutrition',
        date: today,
        completed: false,
        progress: 0,
        target: { value: 3, unit: 'meals' }
      }
    });
    
    console.log('\n=== TEST: Manual change to same pillar (should still work) ===');
    
    // Clear previous logs
    console.log.mockClear();
    
    // Try to manually change to the same pillar (nutrition)
    // This should STILL work because manual=true
    store.rotatePillar(true, 'nutrition');
    
    const logCalls = console.log.mock.calls;
    
    // Verify the "already current" log was NOT triggered
    const alreadyCurrentLog = logCalls.find(call =>
      call[0]?.includes('Daily pillar is already current, skipping rotation')
    );
    
    console.log('\n=== Should NOT see "already current" log ===');
    console.log('Found log:', alreadyCurrentLog);
    expect(alreadyCurrentLog).toBeUndefined();
    
    // Verify rotation proceeded
    const proceedingLog = logCalls.find(call =>
      call[0]?.includes('Manual rotation detected, skipping all validations') ||
      call[0]?.includes('All checks passed, proceeding with rotation')
    );
    expect(proceedingLog).toBeDefined();
  });

  test('should skip rotation when manual=false and pillar is current', () => {
    const store = useGameStore.getState();
    
    // Initialize user and streak
    store.initializeUser({
      id: 'test-user',
      currentStreak: 0,
      longestStreak: 0,
      experience: 0,
      level: 1,
      stats: { nutrition: 0, sleep: 0, movement: 0 }
    });
    
    useGameStore.setState({
      streak: {
        currentCount: 0,
        lastCompletedDate: null,
        pillarHistory: []
      }
    });
    
    // Set initial daily pillar (today, nutrition)
    const today = new Date().toISOString();
    useGameStore.setState({
      dailyPillar: {
        pillar: 'nutrition',
        date: today,
        completed: false,
        progress: 0,
        target: { value: 3, unit: 'meals' }
      }
    });
    
    console.log('\n=== TEST: Auto rotation when pillar is current (should skip) ===');
    
    // Clear previous logs
    console.log.mockClear();
    
    // Try automatic rotation (manual=false)
    // This SHOULD skip because pillar is already current
    store.rotatePillar(false);
    
    const logCalls = console.log.mock.calls;
    
    // Verify the "already current" log WAS triggered
    const alreadyCurrentLog = logCalls.find(call =>
      call[0]?.includes('Daily pillar is already current, skipping rotation')
    );
    
    console.log('\n=== Should see "already current" log ===');
    console.log('Found log:', alreadyCurrentLog);
    expect(alreadyCurrentLog).toBeDefined();
    
    // Verify rotation did NOT proceed
    const proceedingLog = logCalls.find(call =>
      call[0]?.includes('All checks passed, proceeding with rotation')
    );
    expect(proceedingLog).toBeUndefined();
  });
});
