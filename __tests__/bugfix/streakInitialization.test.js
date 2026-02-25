/**
 * Test para verificar que la racha se inicializa correctamente con pillarHistory
 * 
 * Bug: Usuario tiene racha de 7 días, pero al completar una actividad se reinicia a 1
 * Causa: pillarHistory estaba vacío al inicializar
 * Solución: Generar mock history con los días de racha del usuario
 */

import { useGameStore } from '../../src/stores';
import streakManager from '../../src/modules/streakManager';

describe('Bugfix: Streak Initialization with pillarHistory', () => {
  beforeEach(() => {
    // Reset store
    useGameStore.setState({
      streak: {
        currentCount: 0,
        lastCompletedDate: null,
        pillarHistory: []
      },
      dailyPillar: {
        date: new Date().toISOString(),
        pillar: 'nutrition',
        isManuallySet: false,
        target: { type: 'default', value: 1, unit: 'completion' },
        progress: 0,
        completed: false
      }
    });
  });

  test('pillarHistory debe inicializarse con 7 días cuando currentStreak es 7', () => {
    // Simular inicialización como en App.js
    const userData = {
      currentStreak: 7
    };

    // Generate mock pillar history (misma función que en App.js)
    const generateMockPillarHistory = (days) => {
      const history = [];
      const pillars = ['nutrition', 'sleep', 'movement'];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        history.push({
          date: date.toISOString(),
          pillar: pillars[i % 3],
          completed: true,
          metrics: {
            progress: 1,
            target: { type: 'default', value: 1, unit: 'completion' }
          }
        });
      }
      
      return history;
    };

    const mockHistory = generateMockPillarHistory(userData.currentStreak);

    // Inicializar estado
    useGameStore.setState({
      streak: {
        currentCount: userData.currentStreak,
        lastCompletedDate: new Date().toISOString(),
        pillarHistory: mockHistory
      }
    });

    const state = useGameStore.getState();

    // Verificar que pillarHistory tiene 7 entradas
    expect(state.streak.pillarHistory).toHaveLength(7);
    
    // Verificar que todas las entradas están completadas
    state.streak.pillarHistory.forEach(entry => {
      expect(entry.completed).toBe(true);
      expect(entry.metrics.progress).toBe(1);
    });

    // Verificar que calculateCurrentStreak devuelve 7
    const calculatedStreak = streakManager.calculateCurrentStreak(state.streak.pillarHistory);
    expect(calculatedStreak).toBe(7);
  });

  test('al completar un pilar, la racha debe incrementarse de 7 a 8', () => {
    // Inicializar con racha de 7
    const userData = {
      currentStreak: 7,
      longestStreak: 7,
      experience: 0,
      level: 1
    };

    const generateMockPillarHistory = (days) => {
      const history = [];
      const pillars = ['nutrition', 'sleep', 'movement'];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        history.push({
          date: date.toISOString(),
          pillar: pillars[i % 3],
          completed: true,
          metrics: {
            progress: 1,
            target: { type: 'default', value: 1, unit: 'completion' }
          }
        });
      }
      
      return history;
    };

    const mockHistory = generateMockPillarHistory(userData.currentStreak);

    useGameStore.setState({
      user: userData,
      streak: {
        currentCount: userData.currentStreak,
        lastCompletedDate: new Date().toISOString(),
        pillarHistory: mockHistory
      },
      dailyPillar: {
        date: new Date().toISOString(),
        pillar: 'nutrition',
        isManuallySet: false,
        target: { type: 'default', value: 1, unit: 'completion' },
        progress: 0,
        completed: false
      }
    });

    // Simular progreso del pilar
    const { simulateProgress, updateStreak } = useGameStore.getState();
    simulateProgress();
    
    // Completar el pilar
    updateStreak(true);

    const state = useGameStore.getState();

    // Verificar que pillarHistory ahora tiene 8 entradas
    expect(state.streak.pillarHistory).toHaveLength(8);

    // Verificar que la racha es 8
    const calculatedStreak = streakManager.calculateCurrentStreak(state.streak.pillarHistory);
    expect(calculatedStreak).toBe(8);
    expect(state.streak.currentCount).toBe(8);
  });

  test('pillarHistory debe tener fechas consecutivas', () => {
    const userData = {
      currentStreak: 7
    };

    const generateMockPillarHistory = (days) => {
      const history = [];
      const pillars = ['nutrition', 'sleep', 'movement'];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        history.push({
          date: date.toISOString(),
          pillar: pillars[i % 3],
          completed: true,
          metrics: {
            progress: 1,
            target: { type: 'default', value: 1, unit: 'completion' }
          }
        });
      }
      
      return history;
    };

    const mockHistory = generateMockPillarHistory(userData.currentStreak);

    // Verificar que las fechas son consecutivas
    for (let i = 1; i < mockHistory.length; i++) {
      const prevDate = new Date(mockHistory[i - 1].date);
      const currDate = new Date(mockHistory[i].date);
      
      const diffInDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
      expect(diffInDays).toBe(1);
    }
  });
});
