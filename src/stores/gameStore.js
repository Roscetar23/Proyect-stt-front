import { create } from 'zustand';
import { calculateLevel } from '../utils/index.js';
import streakManager from '../modules/streakManager/index.js';
import { EXPERIENCE_REWARDS } from '../utils/constants.js';

// Estado inicial
const initialState = {
  user: null,
  streak: null,
  dailyPillar: null,
  achievements: [],
  lastRotationCheck: null // Track last rotation check date to prevent infinite loops
};

export const useGameStore = create((set, get) => ({
  // Estado inicial
  ...initialState,
      
      /**
       * Actualiza la racha cuando se completa el pilar del día
       * Requirements: 1.5, 6.4, 14.1, 14.2, 14.3, 14.5, 15.5, 17.2
       * @param {boolean} completed - Si se completó el pilar
       */
      updateStreak: (completed) => {
        const { streak, user, dailyPillar } = get();
        
        if (!streak || !user || !dailyPillar) return;
        
        // Use StreakManager to calculate the new streak
        let newPillarHistory = [...(streak.pillarHistory || [])];
        
        if (completed) {
          // Requirement 17.2: Register in pillarHistory when pillar is completed
          // Requirement 6.4: Register pillar metrics in Pillar_History
          const historyEntry = {
            date: dailyPillar.date,
            pillar: dailyPillar.pillar,
            completed: true,
            metrics: {
              progress: dailyPillar.progress,
              target: dailyPillar.target
            }
          };
          
          newPillarHistory.push(historyEntry);
          
          // Mark daily pillar as completed
          set({
            dailyPillar: {
              ...dailyPillar,
              completed: true
            }
          });
        }
        
        // Use StreakManager to calculate current streak from history
        const newCount = streakManager.calculateCurrentStreak(newPillarHistory);
        
        // Requirement 14.1: Update longestStreak if currentStreak exceeds it
        // Requirement 1.5: Update longest streak if current streak surpasses it
        const newLongestStreak = Math.max(user.longestStreak || 0, newCount);
        
        set({
          streak: {
            ...streak,
            currentCount: newCount,
            lastCompletedDate: completed ? new Date().toISOString() : streak.lastCompletedDate,
            pillarHistory: newPillarHistory
          },
          user: {
            ...user,
            currentStreak: newCount,
            longestStreak: newLongestStreak
          }
        });
        
        // Requirement 15.5: Invoke addExperience when pillar is completed
        // Requirement 14.5: Invoke addExperience when pillar is completed
        if (completed) {
          const experienceAmount = EXPERIENCE_REWARDS.PILLAR_COMPLETED || 50;
          get().addExperience(experienceAmount);
        }
      },
      
      /**
       * Rota el pilar del día (automático o manual)
       * Requirements: 14.2, 14.3
       * @param {boolean} manual - Si es rotación manual
       * @param {string} selectedPillar - Pilar seleccionado manualmente
       * @param {string} strategy - Estrategia de rotación (default: 'round-robin')
       */
      rotatePillar: (manual = false, selectedPillar = null, strategy = 'round-robin') => {
        const { streak, user, dailyPillar, lastRotationCheck } = get();
        
        console.log('🔍 [gameStore] rotatePillar called with:', { manual, selectedPillar, strategy });
        
        // Get current date string (YYYY-MM-DD format)
        const currentDateString = new Date().toISOString().split('T')[0];
        
        // IMPORTANT: If manual rotation, skip ALL validations and proceed immediately
        if (manual) {
          console.log('🔍 [gameStore] Manual rotation detected, skipping all validations');
          
          // Get user stats for strategy (if available)
          const userStats = {
            nutrition: user?.stats?.nutrition || 0,
            sleep: user?.stats?.sleep || 0,
            movement: user?.stats?.movement || 0
          };
          
          // Get pillar history for strategy
          const pillarHistory = streak?.pillarHistory || [];
          
          // Requirement 14.2: Use StreakManager for rotating pillar
          // Requirement 14.3: Invoke rotatePillar with selected strategy
          const newDailyPillar = streakManager.rotatePillar(
            manual,
            selectedPillar,
            strategy,
            userStats,
            pillarHistory
          );
          
          console.log('🔄 Pillar rotated:', newDailyPillar.pillar, '(manual)');
          
          set({
            dailyPillar: newDailyPillar,
            lastRotationCheck: currentDateString
          });
          return;
        }
        
        // === AUTOMATIC ROTATION VALIDATIONS (only when manual=false) ===
        
        // Prevent duplicate rotations on the same day
        if (lastRotationCheck === currentDateString) {
          console.log('⏭️ Rotation already performed today, skipping');
          return;
        }
        
        console.log('🔍 [gameStore] Passed duplicate rotation check. lastRotationCheck:', lastRotationCheck);
        
        // IMPORTANT: Don't auto-rotate if pillar was manually set today
        if (dailyPillar?.isManuallySet) {
          const pillarDateString = new Date(dailyPillar.date).toISOString().split('T')[0];
          if (pillarDateString === currentDateString) {
            console.log('🚫 Pillar was manually set today, skipping auto-rotation');
            set({ lastRotationCheck: currentDateString });
            return;
          }
        }
        
        console.log('🔍 [gameStore] Passed manual set check. dailyPillar.isManuallySet:', dailyPillar?.isManuallySet);
        
        // Check if rotation is actually needed
        if (dailyPillar) {
          const pillarDateString = new Date(dailyPillar.date).toISOString().split('T')[0];
          console.log('🔍 [gameStore] Checking if rotation needed. pillarDate:', pillarDateString, 'currentDate:', currentDateString);
          if (pillarDateString === currentDateString) {
            console.log('✅ Daily pillar is already current, skipping rotation');
            // Update lastRotationCheck even if no rotation needed
            set({ lastRotationCheck: currentDateString });
            return;
          }
        }
        
        console.log('🔍 [gameStore] All checks passed, proceeding with automatic rotation');
        
        // Get user stats for strategy (if available)
        const userStats = {
          nutrition: user?.stats?.nutrition || 0,
          sleep: user?.stats?.sleep || 0,
          movement: user?.stats?.movement || 0
        };
        
        // Get pillar history for strategy
        const pillarHistory = streak?.pillarHistory || [];
        
        // Requirement 14.2: Use StreakManager for rotating pillar
        // Requirement 14.3: Invoke rotatePillar with selected strategy
        const newDailyPillar = streakManager.rotatePillar(
          manual,
          selectedPillar,
          strategy,
          userStats,
          pillarHistory
        );
        
        console.log('🔄 Pillar rotated:', newDailyPillar.pillar, '(auto)');
        
        set({
          dailyPillar: newDailyPillar,
          lastRotationCheck: currentDateString
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
       * Simula el progreso del pilar (para testing/desarrollo)
       * Actualiza el progreso al 100% del objetivo
       */
      simulateProgress: () => {
        const { dailyPillar } = get();
        
        if (!dailyPillar || dailyPillar.completed) return;
        
        set({
          dailyPillar: {
            ...dailyPillar,
            progress: dailyPillar.target.value
          }
        });
      },
      
      /**
       * Resetea el estado (para testing)
       */
      resetState: () => {
        set(initialState);
      }
}));
