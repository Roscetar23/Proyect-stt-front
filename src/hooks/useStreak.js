/**
 * useStreak Hook
 * 
 * Custom hook for streak operations.
 * Provides access to streak state and actions for completing and selecting pillars.
 */

import { useGameStore } from '../stores/gameStore';
import streakManager from '../modules/streakManager';

/**
 * Custom hook for streak operations
 * @returns {object} Streak state and actions
 */
export const useStreak = () => {
  // Read state from Zustand store
  const user = useGameStore(state => state.user);
  const streak = useGameStore(state => state.streak);
  const dailyPillar = useGameStore(state => state.dailyPillar);
  
  // Get actions from store
  const updateStreak = useGameStore(state => state.updateStreak);
  const rotatePillar = useGameStore(state => state.rotatePillar);
  
  // Calculate derived state
  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;
  const isActive = streakManager.isStreakActive(streak?.lastCompletedDate);
  
  /**
   * Complete the daily pillar
   * Validates that the correct pillar is being completed
   * @param {string} pillar - Pillar to complete
   * @returns {boolean} True if completion was successful
   */
  const completePillar = (pillar) => {
    const isValid = streakManager.validateCompletion(pillar, dailyPillar);
    if (isValid) {
      updateStreak(true);
      return true;
    }
    return false;
  };
  
  /**
   * Select a pillar manually
   * @param {string} pillar - Pillar to select
   */
  const selectPillar = (pillar) => {
    console.log('🔍 [useStreak] Calling rotatePillar with manual=true, pillar:', pillar);
    rotatePillar(true, pillar);
  };
  
  // Return object with all streak data and actions
  return {
    currentStreak,
    longestStreak,
    isActive,
    dailyPillar,
    pillarHistory: streak?.pillarHistory || [],
    completePillar,
    selectPillar
  };
};
