/**
 * StreakManager Module
 * 
 * Módulo central que encapsula toda la lógica de rachas.
 * Maneja cálculo de rachas, validación de completación, y rotación de pilares.
 */

import { getCurrentDate, isSameDay, getDaysDifference } from '../../utils/dateHelpers';
import { roundRobinStrategy, statsBasedStrategy, weightedRandomStrategy } from './strategies';
import { isValidHistoryEntry } from './validators';
import { PILLARS } from '../../utils/constants';

class StreakManager {
  constructor() {
    this.strategies = {
      'round-robin': roundRobinStrategy,
      'stats-based': statsBasedStrategy,
      'weighted-random': weightedRandomStrategy
    };
  }

  /**
   * Calculate current streak from history
   * @param {Array} pillarHistory - Array of pillar completion entries
   * @returns {number} Current streak count
   */
  calculateCurrentStreak(pillarHistory) {
    try {
      // Return 0 if history is empty or null
      if (!pillarHistory || pillarHistory.length === 0) {
        return 0;
      }
      
      // Filter and validate history entries
      const validEntries = pillarHistory.filter(entry => isValidHistoryEntry(entry));
      
      if (validEntries.length === 0) {
        console.warn('No valid entries in pillar history');
        return 0;
      }
      
      // Group entries by day (only completed ones)
      const completedEntries = validEntries.filter(e => e.completed);
      const dayMap = new Map();
      
      completedEntries.forEach(entry => {
        const dateStr = new Date(entry.date).toDateString();
        if (!dayMap.has(dateStr)) {
          dayMap.set(dateStr, entry.date);
        }
      });
      
      // Get unique days sorted descending (most recent first)
      const uniqueDays = Array.from(dayMap.values())
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => b - a);
      
      if (uniqueDays.length === 0) {
        return 0;
      }
      
      let streak = 0;
      let currentDate = new Date();
      
      // Count consecutive days
      for (const dayDate of uniqueDays) {
        const daysDiff = getDaysDifference(dayDate, currentDate);
        
        // If gap is more than 1 day, streak is broken
        if (daysDiff > 1) {
          break;
        }
        
        streak++;
        currentDate = dayDate;
      }
      
      return streak;
      
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0; // Fail gracefully
    }
  }

  /**
   * Check if streak is active (within 24h)
   * @param {string} lastCompletedDate - ISO date string of last completion
   * @returns {boolean} True if streak is active
   */
  isStreakActive(lastCompletedDate) {
    try {
      // Return false if no last completion date
      if (!lastCompletedDate) {
        return false;
      }
      
      const now = new Date();
      const lastCompleted = new Date(lastCompletedDate);
      
      // Handle invalid dates
      if (isNaN(lastCompleted.getTime())) {
        console.warn('Invalid lastCompletedDate:', lastCompletedDate);
        return false;
      }
      
      // Calculate difference in milliseconds for precision
      const msDiff = now - lastCompleted;
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
      
      // Return true if within 24 hours (inclusive)
      return msDiff <= twentyFourHoursInMs;
      
    } catch (error) {
      console.error('Error checking streak active status:', error);
      return false; // Fail gracefully
    }
  }

  /**
   * Get pillar for today based on strategy
   * @param {string} strategy - Strategy name ('round-robin', 'stats-based', 'weighted-random')
   * @param {object} userStats - User statistics by pillar
   * @param {Array} pillarHistory - History of pillar completions
   * @returns {string} Pillar name
   */
  getPillarForToday(strategy = 'round-robin', userStats = {}, pillarHistory = []) {
    const strategyFn = this.strategies[strategy] || this.strategies['round-robin'];
    return strategyFn(userStats, pillarHistory);
  }

  /**
   * Validate pillar completion
   * @param {string} pillar - Pillar being completed
   * @param {object} dailyPillar - Daily pillar object
   * @returns {boolean} True if valid completion
   */
  validateCompletion(pillar, dailyPillar) {
    try {
      // Requirement 6.1: Return false if no Daily_Pillar assigned
      if (!dailyPillar) {
        return false;
      }
      
      // Requirement 6.3: Validate that pillar is one of the 3 valid pillars
      const validPillars = [PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT];
      if (!validPillars.includes(pillar)) {
        console.warn('Invalid pillar:', pillar);
        return false;
      }
      
      // Requirement 6.1: Verify that completed pillar matches Daily_Pillar
      // Requirement 6.2: When correct pillar is completed, validation returns true
      // Requirement 6.3: When attempting to complete different pillar, reject (return false)
      return pillar === dailyPillar.pillar;
      
    } catch (error) {
      console.error('Error validating completion:', error);
      return false; // Fail gracefully
    }
  }

  /**
   * Rotate pillar (automatic or manual)
   * @param {boolean} manual - Whether this is a manual selection
   * @param {string} selectedPillar - Pillar selected (for manual rotation)
   * @param {string} strategy - Strategy to use (for automatic rotation)
   * @param {object} userStats - User statistics
   * @param {Array} pillarHistory - History of pillar completions
   * @returns {object} New daily pillar object
   */
  rotatePillar(manual = false, selectedPillar = null, strategy = 'round-robin', userStats = {}, pillarHistory = []) {
    try {
      // Requirement 4.1, 4.2: Support manual rotation with selected pillar
      // Requirement 3.1, 3.2: Support automatic rotation with strategy
      let pillar;
      
      if (manual && selectedPillar) {
        // Manual selection: validate the selected pillar
        const validPillars = [PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT];
        if (!validPillars.includes(selectedPillar)) {
          console.error('Invalid pillar selected:', selectedPillar);
          // Fallback to automatic rotation if invalid pillar
          pillar = this.getPillarForToday(strategy, userStats, pillarHistory);
        } else {
          pillar = selectedPillar;
        }
      } else {
        // Automatic rotation: use strategy
        pillar = this.getPillarForToday(strategy, userStats, pillarHistory);
      }
      
      // Requirement 3.4, 4.5: Generate Daily_Pillar object with current date
      // Requirement 4.3: Include target based on pillar type
      // Requirement 4.2, 3.3: Mark isManuallySet correctly
      return {
        date: getCurrentDate(),
        pillar,
        isManuallySet: manual,
        target: this._getTargetForPillar(pillar),
        progress: 0,
        completed: false
      };
      
    } catch (error) {
      console.error('Error rotating pillar:', error);
      // Fail gracefully with a safe default
      return {
        date: getCurrentDate(),
        pillar: PILLARS.NUTRITION,
        isManuallySet: false,
        target: this._getTargetForPillar(PILLARS.NUTRITION),
        progress: 0,
        completed: false
      };
    }
  }

  /**
   * Get rotation strategy function
   * @param {string} strategyName - Name of strategy
   * @returns {Function} Strategy function
   */
  getRotationStrategy(strategyName) {
    return this.strategies[strategyName] || this.strategies['round-robin'];
  }

  /**
   * Get target configuration for a pillar
   * @private
   * @param {string} pillar - Pillar name
   * @returns {object} Target configuration
   */
  _getTargetForPillar(pillar) {
    const targets = {
      nutrition: { type: 'meals', value: 3, unit: 'comidas saludables' },
      sleep: { type: 'hours', value: 8, unit: 'horas' },
      movement: { type: 'minutes', value: 30, unit: 'minutos' }
    };
    
    return targets[pillar] || targets.nutrition;
  }
}

// Export as singleton
export default new StreakManager();
