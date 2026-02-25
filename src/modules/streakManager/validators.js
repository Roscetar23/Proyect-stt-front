/**
 * Validation Functions
 * 
 * Funciones auxiliares para validación de datos de rachas.
 * Estas funciones ayudan a mantener la integridad de los datos.
 */

import { PILLARS } from '../../utils/constants';

/**
 * Validate if a pillar name is valid
 * @param {string} pillar - Pillar name to validate
 * @returns {boolean} True if valid pillar
 */
export const isValidPillar = (pillar) => {
  const validPillars = [PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT];
  return validPillars.includes(pillar);
};

/**
 * Validate pillar history entry
 * @param {object} entry - History entry to validate
 * @returns {boolean} True if valid entry
 */
export const isValidHistoryEntry = (entry) => {
  return (
    entry &&
    typeof entry === 'object' &&
    entry.date &&
    entry.pillar &&
    typeof entry.completed === 'boolean' &&
    isValidPillar(entry.pillar)
  );
};

/**
 * Validate daily pillar object
 * @param {object} dailyPillar - Daily pillar object to validate
 * @returns {boolean} True if valid daily pillar
 */
export const isValidDailyPillar = (dailyPillar) => {
  return (
    dailyPillar &&
    typeof dailyPillar === 'object' &&
    dailyPillar.date &&
    dailyPillar.pillar &&
    isValidPillar(dailyPillar.pillar) &&
    dailyPillar.target &&
    typeof dailyPillar.progress === 'number' &&
    typeof dailyPillar.completed === 'boolean'
  );
};

/**
 * Validate user stats object
 * @param {object} userStats - User stats to validate
 * @returns {boolean} True if valid stats
 */
export const isValidUserStats = (userStats) => {
  if (!userStats || typeof userStats !== 'object') {
    return false;
  }
  
  // Check that all pillar stats are numbers
  const pillars = [PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT];
  return pillars.every(pillar => 
    userStats[pillar] === undefined || typeof userStats[pillar] === 'number'
  );
};
