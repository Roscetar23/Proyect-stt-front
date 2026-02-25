/**
 * Rotation Strategies
 * 
 * Estrategias intercambiables para rotación de pilares.
 * Cada estrategia es una función pura que recibe stats e historial
 * y retorna el siguiente pilar a asignar.
 */

import { PILLARS } from '../../utils/constants';

/**
 * Round-robin strategy: Rotate pillars in sequence
 * Requirement 3.5: Select next pillar in sequence: nutrition → sleep → movement → nutrition
 * Requirement 5.1: Implement round-robin strategy that rotates pillars in sequential order
 * 
 * @param {object} userStats - User statistics (unused)
 * @param {Array} pillarHistory - History of pillar completions
 * @returns {string} Next pillar
 */
export const roundRobinStrategy = (userStats, pillarHistory) => {
  // Define the sequence: nutrition → sleep → movement
  const sequence = [PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT];
  
  // If history is empty or null, return the first pillar (nutrition)
  if (!pillarHistory || pillarHistory.length === 0) {
    return sequence[0];
  }
  
  // Get last pillar from history
  const lastEntry = pillarHistory[pillarHistory.length - 1];
  
  // Handle invalid last entry (null, undefined, or missing pillar property)
  if (!lastEntry || !lastEntry.pillar) {
    return sequence[0];
  }
  
  const lastPillar = lastEntry.pillar;
  
  // Find current index in sequence
  const currentIndex = sequence.indexOf(lastPillar);
  
  // If last pillar is not found in sequence (invalid pillar), start from beginning
  if (currentIndex === -1) {
    return sequence[0];
  }
  
  // Calculate next index using modulo to wrap around
  const nextIndex = (currentIndex + 1) % sequence.length;
  
  return sequence[nextIndex];
};

/**
 * Stats-based strategy: Prioritize pillar with lowest progress
 * Requirement 5.2: Implement stats-based strategy that prioritizes the pillar with lowest progress
 * 
 * @param {object} userStats - User statistics by pillar
 * @param {Array} pillarHistory - History of pillar completions
 * @returns {string} Pillar with lowest stats
 */
export const statsBasedStrategy = (userStats, pillarHistory) => {
  // Fallback to round-robin if no stats or empty stats
  if (!userStats || Object.keys(userStats).length === 0) {
    return roundRobinStrategy(userStats, pillarHistory);
  }
  
  // Find pillar with lowest stat
  const pillars = [PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT];
  let lowestPillar = pillars[0];
  let lowestValue = userStats[lowestPillar] || 0;
  
  for (const pillar of pillars) {
    const value = userStats[pillar] || 0;
    if (value < lowestValue) {
      lowestValue = value;
      lowestPillar = pillar;
    }
  }
  
  return lowestPillar;
};

/**
 * Weighted random strategy: Random selection weighted by inverse stats
 * Requirement 5.3: Implement weighted-random strategy that selects randomly with weights based on stats
 * 
 * Lower stats = higher weight (more likely to be selected)
 * Formula: weight = maxStat - stat + 1 (to avoid zero weight)
 * 
 * @param {object} userStats - User statistics by pillar
 * @param {Array} pillarHistory - History of pillar completions
 * @returns {string} Randomly selected pillar
 */
export const weightedRandomStrategy = (userStats, pillarHistory) => {
  // Fallback to round-robin if no stats or empty stats
  if (!userStats || Object.keys(userStats).length === 0) {
    return roundRobinStrategy(userStats, pillarHistory);
  }
  
  const pillars = [PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT];
  
  // Calculate weights (inverse of stats, so lower stats = higher weight)
  const maxStat = 100;
  const weights = pillars.map(pillar => {
    const stat = userStats[pillar] || 0;
    const weight = maxStat - stat + 1; // +1 to avoid zero weight
    return Math.max(1, weight); // Ensure weight is always at least 1
  });
  
  // Calculate total weight
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  // Random selection
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < pillars.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return pillars[i];
    }
  }
  
  // Fallback to last pillar (should rarely reach here)
  return pillars[pillars.length - 1];
};
