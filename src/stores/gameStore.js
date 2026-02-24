import { create } from 'zustand';
import { calculateLevel } from '../utils/index.js';

// Estado inicial
const initialState = {
  user: null,
  streak: null,
  dailyPillar: null,
  achievements: []
};

export const useGameStore = create((set, get) => ({
  // Estado inicial
  ...initialState,
      
      /**
       * Actualiza la racha cuando se completa el pilar del día
       * @param {boolean} completed - Si se completó el pilar
       */
      updateStreak: (completed) => {
        const { streak, user } = get();
        
        if (!streak || !user) return;
        
        const newCount = completed ? streak.currentCount + 1 : 0;
        const newLongestStreak = Math.max(user.longestStreak, newCount);
        
        set({
          streak: {
            ...streak,
            currentCount: newCount,
            lastCompletedDate: new Date().toISOString()
          },
          user: {
            ...user,
            currentStreak: newCount,
            longestStreak: newLongestStreak
          }
        });
      },
      
      /**
       * Rota el pilar del día (automático o manual)
       * @param {boolean} manual - Si es rotación manual
       * @param {string} selectedPillar - Pilar seleccionado manualmente
       */
      rotatePillar: (manual = false, selectedPillar = null) => {
        const pillars = ['nutrition', 'sleep', 'movement'];
        const { dailyPillar } = get();
        
        let newPillar;
        if (manual && selectedPillar) {
          newPillar = selectedPillar;
        } else {
          // Rotación automática: siguiente en la lista
          const currentIndex = dailyPillar 
            ? pillars.indexOf(dailyPillar.pillar) 
            : -1;
          const nextIndex = (currentIndex + 1) % pillars.length;
          newPillar = pillars[nextIndex];
        }
        
        set({
          dailyPillar: {
            date: new Date().toISOString(),
            pillar: newPillar,
            isManuallySet: manual,
            target: {
              type: 'default',
              value: 1,
              unit: 'completion'
            },
            progress: 0,
            completed: false
          }
        });
      },
      
      /**
       * Añade experiencia y calcula el nivel
       * @param {number} amount - Cantidad de experiencia a añadir
       */
      addExperience: (amount) => {
        const { user } = get();
        
        if (!user) return;
        
        const newExp = user.experience + amount;
        const newLevel = calculateLevel(newExp);
        
        set({
          user: {
            ...user,
            experience: newExp,
            level: newLevel
          }
        });
      },
      
      /**
       * Desbloquea un logro
       * @param {string} achievementId - ID del logro a desbloquear
       */
      unlockAchievement: (achievementId) => {
        const { achievements } = get();
        
        const updated = achievements.map(a =>
          a.id === achievementId
            ? { ...a, unlockedAt: new Date().toISOString() }
            : a
        );
        
        set({ achievements: updated });
      },
      
      /**
       * Inicializa el usuario (primera vez)
       * @param {object} userData - Datos del usuario
       */
      initializeUser: (userData) => {
        set({ user: userData });
      },
      
      /**
       * Resetea el estado (para testing)
       */
      resetState: () => {
        set(initialState);
      }
}));
