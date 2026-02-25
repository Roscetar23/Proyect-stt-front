/**
 * Test que simula el escenario real del usuario:
 * 1. Usuario está en StreakHomeScreen (usePillarRotation activo)
 * 2. Usuario navega a PillarSelectionScreen
 * 3. Usuario selecciona un pilar
 * 4. Usuario regresa a StreakHomeScreen
 * 5. usePillarRotation se ejecuta de nuevo
 */

import { useGameStore } from '../../src/stores/gameStore';

describe('Real World Pillar Change Scenario', () => {
  beforeEach(() => {
    // Reset store
    useGameStore.getState().resetState();
    
    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('manual pillar change should work even with usePillarRotation active', () => {
    const store = useGameStore.getState();
    
    // Initialize user and streak
    store.initializeUser({
      id: 'test-user',
      currentStreak: 5,
      longestStreak: 10,
      experience: 250,
      level: 3,
      stats: { nutrition: 10, sleep: 8, movement: 12 }
    });
    
    useGameStore.setState({
      streak: {
        currentCount: 5,
        lastCompletedDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        pillarHistory: []
      }
    });
    
    console.log('\n=== STEP 1: User opens app (StreakHomeScreen) ===');
    console.log('usePillarRotation hook executes on mount...');
    
    // Clear logs
    console.log.mockClear();
    
    // Simulate usePillarRotation hook on mount (automatic rotation)
    store.rotatePillar(false);
    
    let logCalls = console.log.mock.calls;
    console.log('\n--- Logs from auto-rotation ---');
    logCalls.forEach(call => console.log(...call));
    
    const dailyPillarAfterAutoRotation = useGameStore.getState().dailyPillar;
    console.log('\nDaily pillar after auto-rotation:', dailyPillarAfterAutoRotation?.pillar);
    console.log('isManuallySet:', dailyPillarAfterAutoRotation?.isManuallySet);
    
    expect(dailyPillarAfterAutoRotation).toBeDefined();
    expect(dailyPillarAfterAutoRotation.isManuallySet).toBe(false);
    
    const autoPillar = dailyPillarAfterAutoRotation.pillar;
    
    console.log('\n=== STEP 2: User navigates to PillarSelectionScreen ===');
    console.log('User sees current pillar:', autoPillar);
    console.log('User wants to change to: sleep');
    
    console.log('\n=== STEP 3: User clicks "Cambiar Pilar" button ===');
    console.log('PillarSelectionScreen.handleSelect("sleep") is called');
    console.log('This calls useStreak.selectPillar("sleep")');
    console.log('Which calls rotatePillar(true, "sleep")');
    
    // Clear logs
    console.log.mockClear();
    
    // Simulate manual pillar change (user clicks "Cambiar Pilar")
    store.rotatePillar(true, 'sleep');
    
    logCalls = console.log.mock.calls;
    console.log('\n--- Logs from manual rotation ---');
    logCalls.forEach(call => console.log(...call));
    
    const dailyPillarAfterManualChange = useGameStore.getState().dailyPillar;
    console.log('\nDaily pillar after manual change:', dailyPillarAfterManualChange?.pillar);
    console.log('isManuallySet:', dailyPillarAfterManualChange?.isManuallySet);
    
    expect(dailyPillarAfterManualChange.pillar).toBe('sleep');
    expect(dailyPillarAfterManualChange.isManuallySet).toBe(true);
    
    // Verify the rotation log shows manual=true
    const rotateLog = logCalls.find(call => 
      call[0]?.includes('[gameStore] rotatePillar called with:')
    );
    expect(rotateLog).toBeDefined();
    expect(rotateLog[1].manual).toBe(true);
    expect(rotateLog[1].selectedPillar).toBe('sleep');
    
    console.log('\n=== STEP 4: User returns to StreakHomeScreen ===');
    console.log('usePillarRotation hook executes again (interval or re-mount)');
    
    // Clear logs
    console.log.mockClear();
    
    // Simulate usePillarRotation hook executing again (automatic rotation attempt)
    store.rotatePillar(false);
    
    logCalls = console.log.mock.calls;
    console.log('\n--- Logs from auto-rotation attempt after manual change ---');
    logCalls.forEach(call => console.log(...call));
    
    const dailyPillarAfterAutoAttempt = useGameStore.getState().dailyPillar;
    console.log('\nDaily pillar after auto-rotation attempt:', dailyPillarAfterAutoAttempt?.pillar);
    console.log('isManuallySet:', dailyPillarAfterAutoAttempt?.isManuallySet);
    
    // CRITICAL: The manual selection should be preserved
    expect(dailyPillarAfterAutoAttempt.pillar).toBe('sleep');
    expect(dailyPillarAfterAutoAttempt.isManuallySet).toBe(true);
    
    // Verify the auto-rotation was skipped (could be any of these reasons)
    const skipLog = logCalls.find(call =>
      call[0]?.includes('Rotation already performed today, skipping') ||
      call[0]?.includes('Pillar was manually set today, skipping auto-rotation') ||
      call[0]?.includes('Daily pillar is already current, skipping rotation')
    );
    expect(skipLog).toBeDefined();
    
    console.log('\n=== RESULT ===');
    console.log('✅ Manual selection preserved:', dailyPillarAfterAutoAttempt.pillar === 'sleep');
    console.log('✅ isManuallySet flag preserved:', dailyPillarAfterAutoAttempt.isManuallySet === true);
  });

  test('should show the exact log from user report', () => {
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
    
    // Set today's pillar (already current)
    const today = new Date().toISOString();
    useGameStore.setState({
      dailyPillar: {
        pillar: 'nutrition',
        date: today,
        completed: false,
        progress: 0,
        target: { value: 3, unit: 'meals' },
        isManuallySet: false
      }
    });
    
    console.log('\n=== Reproducing user scenario ===');
    console.log('Current pillar: nutrition (today)');
    console.log('User clicks "Cambiar Pilar" to select: sleep');
    
    // Clear logs
    console.log.mockClear();
    
    // User clicks "Cambiar Pilar" - this should call rotatePillar(true, 'sleep')
    // But the log shows it's being treated as automatic
    store.rotatePillar(true, 'sleep');
    
    const logCalls = console.log.mock.calls;
    console.log('\n--- All logs ---');
    logCalls.forEach(call => console.log(...call));
    
    // Check if we see the problematic log
    const problematicLog = logCalls.find(call =>
      call[0]?.includes('Daily pillar is already current, skipping rotation')
    );
    
    console.log('\n--- Analysis ---');
    if (problematicLog) {
      console.log('❌ FOUND THE PROBLEM: "already current" log appeared with manual=true');
      console.log('This should NOT happen when manual=true');
    } else {
      console.log('✅ "already current" log did NOT appear (correct behavior)');
    }
    
    // The pillar should have changed to 'sleep'
    const newPillar = useGameStore.getState().dailyPillar;
    console.log('\nNew pillar:', newPillar.pillar);
    console.log('Expected: sleep');
    console.log('Match:', newPillar.pillar === 'sleep' ? '✅' : '❌');
    
    expect(problematicLog).toBeUndefined();
    expect(newPillar.pillar).toBe('sleep');
  });
});
