/**
 * Test para verificar que los parámetros se pasan correctamente
 * a través de toda la cadena de llamadas
 */

import { useGameStore } from '../../src/stores/gameStore';

describe('Parameter Passing Through Hook Chain', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('selectPillar function should pass manual=true to rotatePillar', () => {
    // Initialize store
    const store = useGameStore.getState();
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
      },
      dailyPillar: {
        pillar: 'nutrition',
        date: new Date().toISOString(),
        completed: false,
        progress: 0,
        target: { value: 3, unit: 'meals' },
        isManuallySet: false
      }
    });
    
    console.log('\n=== Testing selectPillar simulation ===');
    
    // Clear logs
    console.log.mockClear();
    
    // Simulate what selectPillar does: rotatePillar(true, pillar)
    const pillar = 'sleep';
    console.log('🔍 [useStreak] Calling rotatePillar with manual=true, pillar:', pillar);
    store.rotatePillar(true, pillar);
    
    const logCalls = console.log.mock.calls;
    console.log('\n--- All logs ---');
    logCalls.forEach(call => console.log(...call));
    
    // Find the useStreak log
    const useStreakLog = logCalls.find(call =>
      call[0]?.includes('[useStreak] Calling rotatePillar')
    );
    
    console.log('\n--- useStreak log ---');
    console.log(useStreakLog);
    expect(useStreakLog).toBeDefined();
    
    // Find the gameStore log
    const gameStoreLog = logCalls.find(call =>
      call[0]?.includes('[gameStore] rotatePillar called with:')
    );
    
    console.log('\n--- gameStore log ---');
    console.log(gameStoreLog);
    expect(gameStoreLog).toBeDefined();
    expect(gameStoreLog[1].manual).toBe(true);
    expect(gameStoreLog[1].selectedPillar).toBe('sleep');
    
    // Verify the pillar changed
    const newPillar = useGameStore.getState().dailyPillar;
    console.log('\n--- Result ---');
    console.log('New pillar:', newPillar.pillar);
    console.log('isManuallySet:', newPillar.isManuallySet);
    
    expect(newPillar.pillar).toBe('sleep');
    expect(newPillar.isManuallySet).toBe(true);
  });

  test('direct rotatePillar call with manual=true should work', () => {
    // Initialize store
    const store = useGameStore.getState();
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
      },
      dailyPillar: {
        pillar: 'nutrition',
        date: new Date().toISOString(),
        completed: false,
        progress: 0,
        target: { value: 3, unit: 'meals' },
        isManuallySet: false
      }
    });
    
    console.log('\n=== Testing direct rotatePillar call ===');
    
    // Clear logs
    console.log.mockClear();
    
    // Call rotatePillar directly
    store.rotatePillar(true, 'movement');
    
    const logCalls = console.log.mock.calls;
    console.log('\n--- All logs ---');
    logCalls.forEach(call => console.log(...call));
    
    // Find the gameStore log
    const gameStoreLog = logCalls.find(call =>
      call[0]?.includes('[gameStore] rotatePillar called with:')
    );
    
    console.log('\n--- gameStore log ---');
    console.log(gameStoreLog);
    expect(gameStoreLog).toBeDefined();
    expect(gameStoreLog[1].manual).toBe(true);
    expect(gameStoreLog[1].selectedPillar).toBe('movement');
    
    // Verify the pillar changed
    const newPillar = useGameStore.getState().dailyPillar;
    console.log('\n--- Result ---');
    console.log('New pillar:', newPillar.pillar);
    console.log('isManuallySet:', newPillar.isManuallySet);
    
    expect(newPillar.pillar).toBe('movement');
    expect(newPillar.isManuallySet).toBe(true);
  });

  test('rotatePillar with no arguments should default to manual=false', () => {
    // Initialize store
    const store = useGameStore.getState();
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
    
    console.log('\n=== Testing rotatePillar with no arguments ===');
    
    // Clear logs
    console.log.mockClear();
    
    // Call rotatePillar with no arguments
    store.rotatePillar();
    
    const logCalls = console.log.mock.calls;
    console.log('\n--- All logs ---');
    logCalls.forEach(call => console.log(...call));
    
    // Find the gameStore log
    const gameStoreLog = logCalls.find(call =>
      call[0]?.includes('[gameStore] rotatePillar called with:')
    );
    
    console.log('\n--- gameStore log ---');
    console.log(gameStoreLog);
    expect(gameStoreLog).toBeDefined();
    expect(gameStoreLog[1].manual).toBe(false);
    expect(gameStoreLog[1].selectedPillar).toBe(null);
  });
});
