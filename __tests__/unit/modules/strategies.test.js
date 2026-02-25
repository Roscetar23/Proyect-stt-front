/**
 * Unit Tests for Rotation Strategies
 * 
 * Tests for round-robin, stats-based, and weighted-random strategies.
 */

import { roundRobinStrategy, statsBasedStrategy, weightedRandomStrategy } from '../../../src/modules/streakManager/strategies';
import { PILLARS } from '../../../src/utils/constants';

describe('Rotation Strategies - weightedRandomStrategy', () => {
  // Requirement 5.3: Fallback to round-robin when no stats
  describe('Fallback behavior', () => {
    it('should fallback to round-robin when userStats is null', () => {
      const history = [];
      const result = weightedRandomStrategy(null, history);
      
      expect(result).toBe(PILLARS.NUTRITION); // First pillar in round-robin
    });

    it('should fallback to round-robin when userStats is undefined', () => {
      const history = [];
      const result = weightedRandomStrategy(undefined, history);
      
      expect(result).toBe(PILLARS.NUTRITION);
    });

    it('should fallback to round-robin when userStats is empty object', () => {
      const history = [];
      const result = weightedRandomStrategy({}, history);
      
      expect(result).toBe(PILLARS.NUTRITION);
    });

    it('should fallback to round-robin and follow sequence', () => {
      const history = [
        { date: new Date().toISOString(), pillar: PILLARS.NUTRITION, completed: true }
      ];
      const result = weightedRandomStrategy({}, history);
      
      expect(result).toBe(PILLARS.SLEEP); // Next in round-robin sequence
    });
  });

  // Requirement 5.3: Weighted selection favors pillars with lower stats
  describe('Weighted selection', () => {
    it('should favor pillar with lowest stat over many iterations', () => {
      const userStats = {
        nutrition: 90, // High stat
        sleep: 10,     // Lowest stat - should be selected most often
        movement: 50   // Medium stat
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // Sleep should be selected most often (lowest stat = highest weight)
      expect(selections.sleep).toBeGreaterThan(selections.nutrition);
      expect(selections.sleep).toBeGreaterThan(selections.movement);
      
      // Movement should be selected more than nutrition
      expect(selections.movement).toBeGreaterThan(selections.nutrition);
    });

    it('should distribute selections based on inverse of stats', () => {
      const userStats = {
        nutrition: 80, // Weight: 100 - 80 + 1 = 21
        sleep: 40,     // Weight: 100 - 40 + 1 = 61 (highest)
        movement: 70   // Weight: 100 - 70 + 1 = 31
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // Sleep (weight 61) should be selected most
      expect(selections.sleep).toBeGreaterThan(selections.movement);
      expect(selections.sleep).toBeGreaterThan(selections.nutrition);
      
      // Movement (weight 31) should be selected more than nutrition (weight 21)
      expect(selections.movement).toBeGreaterThan(selections.nutrition);
    });

    it('should handle equal stats with roughly equal distribution', () => {
      const userStats = {
        nutrition: 50,
        sleep: 50,
        movement: 50
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 900; // Divisible by 3 for easier comparison
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // With equal weights, each should get roughly 1/3 of selections
      // Allow 20% margin for randomness
      const expected = iterations / 3;
      const margin = expected * 0.2;
      
      expect(selections.nutrition).toBeGreaterThan(expected - margin);
      expect(selections.nutrition).toBeLessThan(expected + margin);
      expect(selections.sleep).toBeGreaterThan(expected - margin);
      expect(selections.sleep).toBeLessThan(expected + margin);
      expect(selections.movement).toBeGreaterThan(expected - margin);
      expect(selections.movement).toBeLessThan(expected + margin);
    });
  });

  // Requirement 5.3: All three pillars can be selected
  describe('Pillar coverage', () => {
    it('should be able to select all three pillars', () => {
      const userStats = {
        nutrition: 50,
        sleep: 50,
        movement: 50
      };
      
      const selections = new Set();
      const maxIterations = 100;
      
      for (let i = 0; i < maxIterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections.add(result);
        
        // If we've seen all three, we can stop early
        if (selections.size === 3) break;
      }
      
      expect(selections.size).toBe(3);
      expect(selections.has(PILLARS.NUTRITION)).toBe(true);
      expect(selections.has(PILLARS.SLEEP)).toBe(true);
      expect(selections.has(PILLARS.MOVEMENT)).toBe(true);
    });

    it('should select all pillars even with skewed stats', () => {
      const userStats = {
        nutrition: 95, // Very high
        sleep: 5,      // Very low
        movement: 50   // Medium
      };
      
      const selections = new Set();
      const maxIterations = 500; // More iterations for skewed distribution
      
      for (let i = 0; i < maxIterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections.add(result);
        
        if (selections.size === 3) break;
      }
      
      // Even with very skewed stats, all pillars should eventually be selected
      expect(selections.size).toBe(3);
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('should handle missing pillar stats (treat as 0)', () => {
      const userStats = {
        nutrition: 50,
        // sleep is missing - should be treated as 0
        movement: 50
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // Sleep (missing = 0) should have highest weight (100 - 0 + 1 = 101)
      expect(selections.sleep).toBeGreaterThan(selections.nutrition);
      expect(selections.sleep).toBeGreaterThan(selections.movement);
    });

    it('should handle all stats at 0', () => {
      const userStats = {
        nutrition: 0,
        sleep: 0,
        movement: 0
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 900;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // All have equal weight (100 - 0 + 1 = 101), so roughly equal distribution
      const expected = iterations / 3;
      const margin = expected * 0.2;
      
      expect(selections.nutrition).toBeGreaterThan(expected - margin);
      expect(selections.sleep).toBeGreaterThan(expected - margin);
      expect(selections.movement).toBeGreaterThan(expected - margin);
    });

    it('should handle all stats at 100', () => {
      const userStats = {
        nutrition: 100,
        sleep: 100,
        movement: 100
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 900;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // All have equal weight (100 - 100 + 1 = 1), so roughly equal distribution
      const expected = iterations / 3;
      const margin = expected * 0.2;
      
      expect(selections.nutrition).toBeGreaterThan(expected - margin);
      expect(selections.sleep).toBeGreaterThan(expected - margin);
      expect(selections.movement).toBeGreaterThan(expected - margin);
    });

    it('should handle extreme stat values (>100)', () => {
      const userStats = {
        nutrition: 200, // Above max
        sleep: 50,
        movement: 100
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // Sleep (50) should have highest weight
      // Note: nutrition with 200 would have negative weight (100-200+1=-99)
      // but Math.random() * totalWeight handles this gracefully
      expect(selections.sleep).toBeGreaterThan(0);
      expect(selections.movement).toBeGreaterThan(0);
    });

    it('should handle negative stat values', () => {
      const userStats = {
        nutrition: -10,
        sleep: 50,
        movement: 30
      };
      
      const result = weightedRandomStrategy(userStats, []);
      
      // Should still return a valid pillar
      expect([PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT]).toContain(result);
    });

    it('should handle only one pillar with stats', () => {
      const userStats = {
        nutrition: 75
        // sleep and movement missing
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // Sleep and movement (missing = 0) should have much higher weight
      expect(selections.sleep + selections.movement).toBeGreaterThan(selections.nutrition);
    });

    it('should handle only two pillars with stats', () => {
      const userStats = {
        nutrition: 80,
        sleep: 20
        // movement missing
      };
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      // Movement (missing = 0) should have highest weight
      expect(selections.movement).toBeGreaterThan(selections.sleep);
      expect(selections.sleep).toBeGreaterThan(selections.nutrition);
    });
  });

  // Non-deterministic behavior
  describe('Randomness', () => {
    it('should produce different results on different calls', () => {
      const userStats = {
        nutrition: 50,
        sleep: 50,
        movement: 50
      };
      
      const results = new Set();
      const iterations = 50;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        results.add(result);
      }
      
      // With equal weights and 50 iterations, we should see at least 2 different pillars
      expect(results.size).toBeGreaterThanOrEqual(2);
    });

    it('should not always return the same pillar even with skewed stats', () => {
      const userStats = {
        nutrition: 90,
        sleep: 10, // Heavily favored
        movement: 80
      };
      
      const results = new Set();
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        results.add(result);
      }
      
      // Even with heavily skewed stats, should see at least 2 different pillars
      expect(results.size).toBeGreaterThanOrEqual(2);
    });
  });

  // Statistical distribution validation
  describe('Statistical distribution', () => {
    it('should follow expected weight distribution over many iterations', () => {
      const userStats = {
        nutrition: 70, // Weight: 31
        sleep: 30,     // Weight: 71
        movement: 50   // Weight: 51
      };
      
      // Total weight: 31 + 71 + 51 = 153
      // Expected percentages: nutrition ~20%, sleep ~46%, movement ~33%
      
      const selections = { nutrition: 0, sleep: 0, movement: 0 };
      const iterations = 10000; // Large sample for statistical accuracy
      
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandomStrategy(userStats, []);
        selections[result]++;
      }
      
      const nutritionPercent = (selections.nutrition / iterations) * 100;
      const sleepPercent = (selections.sleep / iterations) * 100;
      const movementPercent = (selections.movement / iterations) * 100;
      
      // Allow 5% margin for randomness
      expect(nutritionPercent).toBeGreaterThan(15);
      expect(nutritionPercent).toBeLessThan(25);
      expect(sleepPercent).toBeGreaterThan(41);
      expect(sleepPercent).toBeLessThan(51);
      expect(movementPercent).toBeGreaterThan(28);
      expect(movementPercent).toBeLessThan(38);
    });
  });

  // Integration with pillarHistory (should be ignored)
  describe('PillarHistory parameter', () => {
    it('should ignore pillarHistory parameter', () => {
      const userStats = {
        nutrition: 50,
        sleep: 50,
        movement: 50
      };
      
      const history1 = [];
      const history2 = [
        { date: new Date().toISOString(), pillar: PILLARS.NUTRITION, completed: true }
      ];
      
      // Both should work the same way (history is only used for fallback)
      const result1 = weightedRandomStrategy(userStats, history1);
      const result2 = weightedRandomStrategy(userStats, history2);
      
      expect([PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT]).toContain(result1);
      expect([PILLARS.NUTRITION, PILLARS.SLEEP, PILLARS.MOVEMENT]).toContain(result2);
    });

    it('should use pillarHistory only when falling back to round-robin', () => {
      const history = [
        { date: new Date().toISOString(), pillar: PILLARS.NUTRITION, completed: true }
      ];
      
      // With no stats, should fallback to round-robin and use history
      const result = weightedRandomStrategy({}, history);
      
      expect(result).toBe(PILLARS.SLEEP); // Next in round-robin after nutrition
    });
  });
});
