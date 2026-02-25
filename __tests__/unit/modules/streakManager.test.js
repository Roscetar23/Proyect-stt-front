/**
 * Unit Tests for StreakManager
 * 
 * Tests for streak calculation, validation, and rotation logic.
 */

import streakManager from '../../../src/modules/streakManager';

describe('StreakManager - calculateCurrentStreak', () => {
  // Requirement 1.1: Calculate current streak by counting consecutive completed days
  it('should calculate streak from consecutive completed days', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const history = [
      { date: twoDaysAgo.toISOString(), pillar: 'nutrition', completed: true },
      { date: yesterday.toISOString(), pillar: 'sleep', completed: true },
      { date: today.toISOString(), pillar: 'movement', completed: true }
    ];
    
    const streak = streakManager.calculateCurrentStreak(history);
    expect(streak).toBe(3);
  });

  // Requirement 1.2: When a pillar is completed, increment streak by 1
  it('should increment streak by 1 for each consecutive completed day', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const historyWithOne = [
      { date: today.toISOString(), pillar: 'nutrition', completed: true }
    ];
    
    const historyWithTwo = [
      { date: yesterday.toISOString(), pillar: 'sleep', completed: true },
      { date: today.toISOString(), pillar: 'nutrition', completed: true }
    ];
    
    expect(streakManager.calculateCurrentStreak(historyWithOne)).toBe(1);
    expect(streakManager.calculateCurrentStreak(historyWithTwo)).toBe(2);
  });

  // Requirement 1.3: When a day is skipped, reset streak to 0
  it('should reset streak when day is skipped (gap in dates)', () => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const history = [
      { date: threeDaysAgo.toISOString(), pillar: 'nutrition', completed: true },
      { date: today.toISOString(), pillar: 'movement', completed: true }
    ];
    
    const streak = streakManager.calculateCurrentStreak(history);
    expect(streak).toBe(1); // Only counts today, previous streak broken
  });

  // Requirement 1.3: When a day has incomplete pillar, reset streak
  it('should break streak on incomplete day', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const history = [
      { date: twoDaysAgo.toISOString(), pillar: 'nutrition', completed: true },
      { date: yesterday.toISOString(), pillar: 'sleep', completed: false },
      { date: today.toISOString(), pillar: 'movement', completed: true }
    ];
    
    const streak = streakManager.calculateCurrentStreak(history);
    expect(streak).toBe(1); // Only counts today
  });

  // Edge case: Empty history
  it('should return 0 for empty history', () => {
    expect(streakManager.calculateCurrentStreak([])).toBe(0);
  });

  // Edge case: Null history
  it('should return 0 for null history', () => {
    expect(streakManager.calculateCurrentStreak(null)).toBe(0);
  });

  // Edge case: Undefined history
  it('should return 0 for undefined history', () => {
    expect(streakManager.calculateCurrentStreak(undefined)).toBe(0);
  });

  // Validation: Filter invalid entries
  it('should filter out invalid history entries', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const history = [
      { date: yesterday.toISOString(), pillar: 'nutrition', completed: true },
      { date: today.toISOString(), pillar: 'invalid-pillar', completed: true }, // Invalid
      { date: today.toISOString() }, // Missing fields
      null, // Null entry
    ];
    
    const streak = streakManager.calculateCurrentStreak(history);
    expect(streak).toBe(1); // Only counts valid yesterday entry
  });

  // Requirement 1.4: Consider consecutive days based on calendar dates
  it('should count consecutive calendar days, not 24-hour periods', () => {
    // Create dates at different times of day but consecutive calendar days
    const today = new Date();
    today.setHours(8, 0, 0, 0); // 8 AM today
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 0, 0, 0); // 11 PM yesterday (less than 24h ago)
    
    const history = [
      { date: yesterday.toISOString(), pillar: 'nutrition', completed: true },
      { date: today.toISOString(), pillar: 'sleep', completed: true }
    ];
    
    const streak = streakManager.calculateCurrentStreak(history);
    expect(streak).toBe(2); // Should count as consecutive days
  });

  // Edge case: Unsorted history
  it('should handle unsorted history correctly', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // History in random order
    const history = [
      { date: today.toISOString(), pillar: 'movement', completed: true },
      { date: twoDaysAgo.toISOString(), pillar: 'nutrition', completed: true },
      { date: yesterday.toISOString(), pillar: 'sleep', completed: true }
    ];
    
    const streak = streakManager.calculateCurrentStreak(history);
    expect(streak).toBe(3);
  });

  // Edge case: Single completed day
  it('should return 1 for single completed day', () => {
    const today = new Date();
    const history = [
      { date: today.toISOString(), pillar: 'nutrition', completed: true }
    ];
    
    const streak = streakManager.calculateCurrentStreak(history);
    expect(streak).toBe(1);
  });

  // Edge case: All incomplete days
  it('should return 0 when all days are incomplete', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const history = [
      { date: yesterday.toISOString(), pillar: 'nutrition', completed: false },
      { date: today.toISOString(), pillar: 'sleep', completed: false }
    ];
    
    const streak = streakManager.calculateCurrentStreak(history);
    expect(streak).toBe(0);
  });
});

describe('StreakManager - isStreakActive', () => {
  // Requirement 2.1: Consider streak active if last completion within 24 hours
  it('should return true when last completion was within 24 hours', () => {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    
    const isActive = streakManager.isStreakActive(twelveHoursAgo.toISOString());
    expect(isActive).toBe(true);
  });

  // Requirement 2.1: Streak active at exactly 24 hours
  it('should return true when last completion was exactly 24 hours ago', () => {
    const now = new Date();
    const exactlyTwentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const isActive = streakManager.isStreakActive(exactlyTwentyFourHoursAgo.toISOString());
    expect(isActive).toBe(true);
  });

  // Requirement 2.2: Mark streak inactive when last completion > 24 hours ago
  it('should return false when last completion was more than 24 hours ago', () => {
    const now = new Date();
    const thirtyHoursAgo = new Date(now.getTime() - 30 * 60 * 60 * 1000);
    
    const isActive = streakManager.isStreakActive(thirtyHoursAgo.toISOString());
    expect(isActive).toBe(false);
  });

  // Requirement 2.2: Streak inactive after 25 hours
  it('should return false when last completion was 25 hours ago', () => {
    const now = new Date();
    const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000);
    
    const isActive = streakManager.isStreakActive(twentyFiveHoursAgo.toISOString());
    expect(isActive).toBe(false);
  });

  // Edge case: No last completion date (null)
  it('should return false when lastCompletedDate is null', () => {
    const isActive = streakManager.isStreakActive(null);
    expect(isActive).toBe(false);
  });

  // Edge case: No last completion date (undefined)
  it('should return false when lastCompletedDate is undefined', () => {
    const isActive = streakManager.isStreakActive(undefined);
    expect(isActive).toBe(false);
  });

  // Edge case: Empty string
  it('should return false when lastCompletedDate is empty string', () => {
    const isActive = streakManager.isStreakActive('');
    expect(isActive).toBe(false);
  });

  // Edge case: Invalid date string
  it('should return false when lastCompletedDate is invalid', () => {
    const isActive = streakManager.isStreakActive('invalid-date-string');
    expect(isActive).toBe(false);
  });

  // Edge case: Malformed date
  it('should return false when lastCompletedDate is malformed', () => {
    const isActive = streakManager.isStreakActive('2024-13-45T99:99:99.000Z');
    expect(isActive).toBe(false);
  });

  // Edge case: Very recent completion (1 minute ago)
  it('should return true when last completion was 1 minute ago', () => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
    
    const isActive = streakManager.isStreakActive(oneMinuteAgo.toISOString());
    expect(isActive).toBe(true);
  });

  // Edge case: Just completed (now)
  it('should return true when last completion was just now', () => {
    const now = new Date();
    
    const isActive = streakManager.isStreakActive(now.toISOString());
    expect(isActive).toBe(true);
  });

  // Edge case: 23 hours and 59 minutes ago (still within 24h)
  it('should return true when last completion was 23 hours 59 minutes ago', () => {
    const now = new Date();
    const almostTwentyFourHours = new Date(now.getTime() - (23 * 60 * 60 * 1000 + 59 * 60 * 1000));
    
    const isActive = streakManager.isStreakActive(almostTwentyFourHours.toISOString());
    expect(isActive).toBe(true);
  });

  // Edge case: 24 hours and 1 second ago (just over 24h)
  it('should return false when last completion was 24 hours and 1 second ago', () => {
    const now = new Date();
    const justOverTwentyFourHours = new Date(now.getTime() - (24 * 60 * 60 * 1000 + 1000));
    
    const isActive = streakManager.isStreakActive(justOverTwentyFourHours.toISOString());
    expect(isActive).toBe(false);
  });

  // Requirement 2.3: Verify streak status each time consulted
  it('should calculate status fresh each time (not cached)', () => {
    const now = new Date();
    const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000);
    
    // First call
    const firstCheck = streakManager.isStreakActive(twentyThreeHoursAgo.toISOString());
    expect(firstCheck).toBe(true);
    
    // Second call should also calculate fresh
    const secondCheck = streakManager.isStreakActive(twentyThreeHoursAgo.toISOString());
    expect(secondCheck).toBe(true);
  });

  // Edge case: Future date (should be active since diff is negative)
  it('should handle future dates gracefully', () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1 hour in future
    
    const isActive = streakManager.isStreakActive(futureDate.toISOString());
    // Future dates have negative diff, which is <= 24, so should be true
    expect(isActive).toBe(true);
  });
});

describe('StreakManager - validateCompletion', () => {
  // Requirement 6.1: Validate that completed pillar corresponds to assigned Daily_Pillar
  // Requirement 6.2: When correct pillar is completed, return true
  it('should return true when pillar matches dailyPillar', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion('nutrition', dailyPillar);
    expect(isValid).toBe(true);
  });

  // Requirement 6.3: When attempting to complete different pillar, reject completion
  it('should return false when pillar does not match dailyPillar', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion('sleep', dailyPillar);
    expect(isValid).toBe(false);
  });

  // Requirement 6.1: Return false if no Daily_Pillar assigned
  it('should return false when dailyPillar is null', () => {
    const isValid = streakManager.validateCompletion('nutrition', null);
    expect(isValid).toBe(false);
  });

  // Requirement 6.1: Return false if no Daily_Pillar assigned
  it('should return false when dailyPillar is undefined', () => {
    const isValid = streakManager.validateCompletion('nutrition', undefined);
    expect(isValid).toBe(false);
  });

  // Requirement 6.3: Validate that pillar is one of the 3 valid pillars
  it('should return false when pillar is invalid', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion('invalid-pillar', dailyPillar);
    expect(isValid).toBe(false);
  });

  // Edge case: Empty string pillar
  it('should return false when pillar is empty string', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion('', dailyPillar);
    expect(isValid).toBe(false);
  });

  // Edge case: Null pillar
  it('should return false when pillar is null', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion(null, dailyPillar);
    expect(isValid).toBe(false);
  });

  // Edge case: Undefined pillar
  it('should return false when pillar is undefined', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion(undefined, dailyPillar);
    expect(isValid).toBe(false);
  });

  // Test all three valid pillars
  it('should return true for all valid pillars when they match', () => {
    const pillars = ['nutrition', 'sleep', 'movement'];
    
    pillars.forEach(pillar => {
      const dailyPillar = {
        date: new Date().toISOString(),
        pillar: pillar,
        target: { type: 'test', value: 1, unit: 'test' },
        progress: 1,
        completed: false
      };
      
      const isValid = streakManager.validateCompletion(pillar, dailyPillar);
      expect(isValid).toBe(true);
    });
  });

  // Test cross-validation: each pillar against wrong dailyPillar
  it('should return false when any pillar does not match dailyPillar', () => {
    const pillars = ['nutrition', 'sleep', 'movement'];
    
    pillars.forEach((pillar, index) => {
      // Get a different pillar for dailyPillar
      const differentPillar = pillars[(index + 1) % pillars.length];
      
      const dailyPillar = {
        date: new Date().toISOString(),
        pillar: differentPillar,
        target: { type: 'test', value: 1, unit: 'test' },
        progress: 1,
        completed: false
      };
      
      const isValid = streakManager.validateCompletion(pillar, dailyPillar);
      expect(isValid).toBe(false);
    });
  });

  // Edge case: Case sensitivity
  it('should be case sensitive (uppercase pillar should not match)', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion('NUTRITION', dailyPillar);
    expect(isValid).toBe(false);
  });

  // Edge case: Pillar with extra spaces
  it('should not match pillar with extra spaces', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion(' nutrition ', dailyPillar);
    expect(isValid).toBe(false);
  });

  // Edge case: dailyPillar with missing pillar property
  it('should return false when dailyPillar has no pillar property', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    const isValid = streakManager.validateCompletion('nutrition', dailyPillar);
    expect(isValid).toBe(false);
  });

  // Edge case: dailyPillar is empty object
  it('should return false when dailyPillar is empty object', () => {
    const isValid = streakManager.validateCompletion('nutrition', {});
    expect(isValid).toBe(false);
  });

  // Edge case: dailyPillar.completed is true (already completed)
  it('should still validate correctly even if dailyPillar is already completed', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'nutrition',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: true // Already completed
    };
    
    // Validation should still work (business logic elsewhere handles if already completed)
    const isValid = streakManager.validateCompletion('nutrition', dailyPillar);
    expect(isValid).toBe(true);
  });

  // Edge case: dailyPillar with invalid pillar value
  it('should return false when dailyPillar has invalid pillar value', () => {
    const dailyPillar = {
      date: new Date().toISOString(),
      pillar: 'invalid-pillar',
      target: { type: 'meals', value: 3, unit: 'comidas saludables' },
      progress: 3,
      completed: false
    };
    
    // Even if they match, both are invalid
    const isValid = streakManager.validateCompletion('invalid-pillar', dailyPillar);
    expect(isValid).toBe(false);
  });
});

describe('StreakManager - rotatePillar', () => {
  // Requirement 4.1, 4.2: Manual rotation with valid pillar
  it('should rotate to manually selected pillar when manual=true', () => {
    const result = streakManager.rotatePillar(true, 'sleep');
    
    expect(result).toBeDefined();
    expect(result.pillar).toBe('sleep');
    expect(result.isManuallySet).toBe(true);
    expect(result.date).toBeDefined();
    expect(result.target).toBeDefined();
    expect(result.progress).toBe(0);
    expect(result.completed).toBe(false);
  });

  // Requirement 3.1, 3.2, 3.3: Automatic rotation with strategy
  it('should rotate automatically using strategy when manual=false', () => {
    const history = [
      { date: new Date().toISOString(), pillar: 'nutrition', completed: true }
    ];
    
    const result = streakManager.rotatePillar(false, null, 'round-robin', {}, history);
    
    expect(result).toBeDefined();
    // Note: Strategies not yet implemented (task 2.x), so returns default pillar
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
    expect(result.isManuallySet).toBe(false);
    expect(result.date).toBeDefined();
    expect(result.target).toBeDefined();
    expect(result.progress).toBe(0);
    expect(result.completed).toBe(false);
  });

  // Requirement 4.2: isManuallySet flag correctness for manual selection
  it('should mark isManuallySet as true for manual selection', () => {
    const result = streakManager.rotatePillar(true, 'movement');
    
    expect(result.isManuallySet).toBe(true);
  });

  // Requirement 3.3: isManuallySet flag correctness for automatic rotation
  it('should mark isManuallySet as false for automatic rotation', () => {
    const result = streakManager.rotatePillar(false, null, 'round-robin');
    
    expect(result.isManuallySet).toBe(false);
  });

  // Requirement 3.4, 4.5: Generate Daily_Pillar with current date
  it('should generate Daily_Pillar with current date', () => {
    const beforeRotation = new Date();
    const result = streakManager.rotatePillar(false);
    const afterRotation = new Date();
    
    expect(result.date).toBeDefined();
    const resultDate = new Date(result.date);
    expect(resultDate.getTime()).toBeGreaterThanOrEqual(beforeRotation.getTime());
    expect(resultDate.getTime()).toBeLessThanOrEqual(afterRotation.getTime());
  });

  // Requirement 4.3: Include target based on pillar type - nutrition
  it('should include correct target for nutrition pillar', () => {
    const result = streakManager.rotatePillar(true, 'nutrition');
    
    expect(result.target).toBeDefined();
    expect(result.target.type).toBe('meals');
    expect(result.target.value).toBe(3);
    expect(result.target.unit).toBe('comidas saludables');
  });

  // Requirement 4.3: Include target based on pillar type - sleep
  it('should include correct target for sleep pillar', () => {
    const result = streakManager.rotatePillar(true, 'sleep');
    
    expect(result.target).toBeDefined();
    expect(result.target.type).toBe('hours');
    expect(result.target.value).toBe(8);
    expect(result.target.unit).toBe('horas');
  });

  // Requirement 4.3: Include target based on pillar type - movement
  it('should include correct target for movement pillar', () => {
    const result = streakManager.rotatePillar(true, 'movement');
    
    expect(result.target).toBeDefined();
    expect(result.target.type).toBe('minutes');
    expect(result.target.value).toBe(30);
    expect(result.target.unit).toBe('minutos');
  });

  // Edge case: Invalid pillar in manual selection should fallback to automatic
  it('should fallback to automatic rotation when invalid pillar is selected manually', () => {
    const result = streakManager.rotatePillar(true, 'invalid-pillar', 'round-robin');
    
    expect(result).toBeDefined();
    expect(result.pillar).not.toBe('invalid-pillar');
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Edge case: Manual=true but no selectedPillar should use automatic
  it('should use automatic rotation when manual=true but selectedPillar is null', () => {
    const result = streakManager.rotatePillar(true, null, 'round-robin');
    
    expect(result).toBeDefined();
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Edge case: Manual=true but selectedPillar is undefined
  it('should use automatic rotation when manual=true but selectedPillar is undefined', () => {
    const result = streakManager.rotatePillar(true, undefined, 'round-robin');
    
    expect(result).toBeDefined();
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Edge case: Manual=true but selectedPillar is empty string
  it('should use automatic rotation when manual=true but selectedPillar is empty', () => {
    const result = streakManager.rotatePillar(true, '', 'round-robin');
    
    expect(result).toBeDefined();
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Test with different strategies
  it('should use round-robin strategy when specified', () => {
    const history = [
      { date: new Date().toISOString(), pillar: 'nutrition', completed: true }
    ];
    
    const result = streakManager.rotatePillar(false, null, 'round-robin', {}, history);
    
    // Note: Strategies not yet implemented (task 2.x), so returns default pillar
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  it('should use stats-based strategy when specified', () => {
    const userStats = {
      nutrition: 80,
      sleep: 40, // Lowest
      movement: 70
    };
    
    const result = streakManager.rotatePillar(false, null, 'stats-based', userStats, []);
    
    // Note: Strategies not yet implemented (task 2.x), so returns default pillar
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  it('should use weighted-random strategy when specified', () => {
    const userStats = {
      nutrition: 50,
      sleep: 50,
      movement: 50
    };
    
    const result = streakManager.rotatePillar(false, null, 'weighted-random', userStats, []);
    
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Edge case: Unknown strategy should fallback to round-robin
  it('should fallback to round-robin for unknown strategy', () => {
    const result = streakManager.rotatePillar(false, null, 'unknown-strategy');
    
    expect(result).toBeDefined();
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Test initial state values
  it('should initialize progress to 0', () => {
    const result = streakManager.rotatePillar(false);
    
    expect(result.progress).toBe(0);
  });

  it('should initialize completed to false', () => {
    const result = streakManager.rotatePillar(false);
    
    expect(result.completed).toBe(false);
  });

  // Test all three pillars can be manually selected
  it('should allow manual selection of all three pillars', () => {
    const pillars = ['nutrition', 'sleep', 'movement'];
    
    pillars.forEach(pillar => {
      const result = streakManager.rotatePillar(true, pillar);
      
      expect(result.pillar).toBe(pillar);
      expect(result.isManuallySet).toBe(true);
    });
  });

  // Test that each rotation creates a new object
  it('should create a new Daily_Pillar object on each rotation', () => {
    const result1 = streakManager.rotatePillar(true, 'nutrition');
    // Small delay to ensure different timestamps
    const result2 = streakManager.rotatePillar(true, 'nutrition');
    
    expect(result1).not.toBe(result2); // Different object references
    // Dates might be the same if called in same millisecond, so just check they're valid
    expect(result1.date).toBeDefined();
    expect(result2.date).toBeDefined();
  });

  // Test with empty userStats
  it('should handle empty userStats object', () => {
    const result = streakManager.rotatePillar(false, null, 'stats-based', {}, []);
    
    expect(result).toBeDefined();
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Test with empty pillarHistory
  it('should handle empty pillarHistory array', () => {
    const result = streakManager.rotatePillar(false, null, 'round-robin', {}, []);
    
    expect(result).toBeDefined();
    expect(result.pillar).toBe('nutrition'); // Default first pillar
  });

  // Test with null parameters
  it('should handle null userStats and pillarHistory', () => {
    const result = streakManager.rotatePillar(false, null, 'round-robin', null, null);
    
    expect(result).toBeDefined();
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Test with undefined parameters
  it('should handle undefined userStats and pillarHistory', () => {
    const result = streakManager.rotatePillar(false, null, 'round-robin', undefined, undefined);
    
    expect(result).toBeDefined();
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Test default parameters
  it('should use default parameters when none provided', () => {
    const result = streakManager.rotatePillar();
    
    expect(result).toBeDefined();
    expect(result.isManuallySet).toBe(false);
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
    expect(result.progress).toBe(0);
    expect(result.completed).toBe(false);
  });

  // Test that manual selection overrides strategy
  it('should use manual selection even when strategy would choose different pillar', () => {
    const history = [
      { date: new Date().toISOString(), pillar: 'nutrition', completed: true }
    ];
    
    // Round-robin would choose 'sleep', but we manually select 'movement'
    const result = streakManager.rotatePillar(true, 'movement', 'round-robin', {}, history);
    
    expect(result.pillar).toBe('movement');
    expect(result.isManuallySet).toBe(true);
  });

  // Test case sensitivity for pillar names
  it('should reject uppercase pillar names', () => {
    const result = streakManager.rotatePillar(true, 'NUTRITION');
    
    // Should fallback to automatic since uppercase is invalid
    expect(result.pillar).not.toBe('NUTRITION');
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Test pillar names with spaces
  it('should reject pillar names with extra spaces', () => {
    const result = streakManager.rotatePillar(true, ' nutrition ');
    
    // Should fallback to automatic since spaces make it invalid
    expect(result.pillar).not.toBe(' nutrition ');
    expect(['nutrition', 'sleep', 'movement']).toContain(result.pillar);
  });

  // Test that target object has all required properties
  it('should include all required properties in target object', () => {
    const result = streakManager.rotatePillar(true, 'nutrition');
    
    expect(result.target).toHaveProperty('type');
    expect(result.target).toHaveProperty('value');
    expect(result.target).toHaveProperty('unit');
    expect(typeof result.target.type).toBe('string');
    expect(typeof result.target.value).toBe('number');
    expect(typeof result.target.unit).toBe('string');
  });

  // Test that Daily_Pillar object has all required properties
  it('should include all required properties in Daily_Pillar object', () => {
    const result = streakManager.rotatePillar(true, 'nutrition');
    
    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('pillar');
    expect(result).toHaveProperty('isManuallySet');
    expect(result).toHaveProperty('target');
    expect(result).toHaveProperty('progress');
    expect(result).toHaveProperty('completed');
  });

  // Test that date is in ISO format
  it('should generate date in ISO format', () => {
    const result = streakManager.rotatePillar(true, 'nutrition');
    
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(() => new Date(result.date)).not.toThrow();
  });

  // Test multiple consecutive rotations
  it('should handle multiple consecutive rotations', () => {
    const result1 = streakManager.rotatePillar(true, 'nutrition');
    const result2 = streakManager.rotatePillar(true, 'sleep');
    const result3 = streakManager.rotatePillar(true, 'movement');
    
    expect(result1.pillar).toBe('nutrition');
    expect(result2.pillar).toBe('sleep');
    expect(result3.pillar).toBe('movement');
    expect(result1.isManuallySet).toBe(true);
    expect(result2.isManuallySet).toBe(true);
    expect(result3.isManuallySet).toBe(true);
  });

  // Test alternating manual and automatic rotations
  it('should handle alternating manual and automatic rotations', () => {
    const result1 = streakManager.rotatePillar(true, 'nutrition');
    const result2 = streakManager.rotatePillar(false, null, 'round-robin');
    const result3 = streakManager.rotatePillar(true, 'movement');
    
    expect(result1.isManuallySet).toBe(true);
    expect(result2.isManuallySet).toBe(false);
    expect(result3.isManuallySet).toBe(true);
  });
});

describe('StreakManager - roundRobinStrategy', () => {
  // Import the strategy directly for testing
  const { roundRobinStrategy } = require('../../../src/modules/streakManager/strategies');
  
  // Requirement 3.5, 5.1: Empty history should return nutrition (first pillar)
  it('should return nutrition when history is empty', () => {
    const result = roundRobinStrategy({}, []);
    expect(result).toBe('nutrition');
  });

  // Requirement 3.5, 5.1: Null history should return nutrition
  it('should return nutrition when history is null', () => {
    const result = roundRobinStrategy({}, null);
    expect(result).toBe('nutrition');
  });

  // Requirement 3.5, 5.1: Undefined history should return nutrition
  it('should return nutrition when history is undefined', () => {
    const result = roundRobinStrategy({}, undefined);
    expect(result).toBe('nutrition');
  });

  // Requirement 3.5: Last pillar is nutrition → should return sleep
  it('should return sleep when last pillar is nutrition', () => {
    const history = [
      { date: '2024-02-15', pillar: 'nutrition', completed: true }
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('sleep');
  });

  // Requirement 3.5: Last pillar is sleep → should return movement
  it('should return movement when last pillar is sleep', () => {
    const history = [
      { date: '2024-02-15', pillar: 'sleep', completed: true }
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('movement');
  });

  // Requirement 3.5: Last pillar is movement → should return nutrition (wrap around)
  it('should return nutrition when last pillar is movement (wraps around)', () => {
    const history = [
      { date: '2024-02-15', pillar: 'movement', completed: true }
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition');
  });

  // Test complete sequence: nutrition → sleep → movement → nutrition
  it('should follow complete sequence: nutrition → sleep → movement → nutrition', () => {
    const history1 = [
      { date: '2024-02-13', pillar: 'nutrition', completed: true }
    ];
    const result1 = roundRobinStrategy({}, history1);
    expect(result1).toBe('sleep');
    
    const history2 = [
      { date: '2024-02-13', pillar: 'nutrition', completed: true },
      { date: '2024-02-14', pillar: 'sleep', completed: true }
    ];
    const result2 = roundRobinStrategy({}, history2);
    expect(result2).toBe('movement');
    
    const history3 = [
      { date: '2024-02-13', pillar: 'nutrition', completed: true },
      { date: '2024-02-14', pillar: 'sleep', completed: true },
      { date: '2024-02-15', pillar: 'movement', completed: true }
    ];
    const result3 = roundRobinStrategy({}, history3);
    expect(result3).toBe('nutrition');
  });

  // Test multiple complete cycles
  it('should handle multiple complete cycles correctly', () => {
    const history = [
      { date: '2024-02-10', pillar: 'nutrition', completed: true },
      { date: '2024-02-11', pillar: 'sleep', completed: true },
      { date: '2024-02-12', pillar: 'movement', completed: true },
      { date: '2024-02-13', pillar: 'nutrition', completed: true },
      { date: '2024-02-14', pillar: 'sleep', completed: true },
      { date: '2024-02-15', pillar: 'movement', completed: true }
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition'); // After movement, wraps to nutrition
  });

  // Edge case: Invalid last pillar in history
  it('should return nutrition when last pillar is invalid', () => {
    const history = [
      { date: '2024-02-15', pillar: 'invalid-pillar', completed: true }
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition');
  });

  // Edge case: Last entry has no pillar property
  it('should handle last entry with missing pillar property', () => {
    const history = [
      { date: '2024-02-15', completed: true }
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition');
  });

  // Edge case: Last entry is null
  it('should handle history with null last entry', () => {
    const history = [
      { date: '2024-02-14', pillar: 'nutrition', completed: true },
      null
    ];
    
    // Should handle gracefully and return first pillar
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition');
  });

  // Edge case: Last entry is undefined
  it('should handle history with undefined last entry', () => {
    const history = [
      { date: '2024-02-14', pillar: 'nutrition', completed: true },
      undefined
    ];
    
    // Should handle gracefully and return first pillar
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition');
  });

  // Test that userStats parameter is ignored (strategy doesn't use it)
  it('should ignore userStats parameter', () => {
    const history = [
      { date: '2024-02-15', pillar: 'nutrition', completed: true }
    ];
    
    const result1 = roundRobinStrategy({}, history);
    const result2 = roundRobinStrategy({ nutrition: 100, sleep: 50, movement: 75 }, history);
    const result3 = roundRobinStrategy(null, history);
    const result4 = roundRobinStrategy(undefined, history);
    
    // All should return same result regardless of userStats
    expect(result1).toBe('sleep');
    expect(result2).toBe('sleep');
    expect(result3).toBe('sleep');
    expect(result4).toBe('sleep');
  });

  // Test that completed flag doesn't affect rotation
  it('should rotate based on pillar regardless of completed status', () => {
    const historyCompleted = [
      { date: '2024-02-15', pillar: 'nutrition', completed: true }
    ];
    
    const historyIncomplete = [
      { date: '2024-02-15', pillar: 'nutrition', completed: false }
    ];
    
    const result1 = roundRobinStrategy({}, historyCompleted);
    const result2 = roundRobinStrategy({}, historyIncomplete);
    
    // Both should return same next pillar
    expect(result1).toBe('sleep');
    expect(result2).toBe('sleep');
  });

  // Test with single entry history for each pillar
  it('should correctly rotate from each pillar with single entry', () => {
    const nutritionHistory = [{ date: '2024-02-15', pillar: 'nutrition', completed: true }];
    const sleepHistory = [{ date: '2024-02-15', pillar: 'sleep', completed: true }];
    const movementHistory = [{ date: '2024-02-15', pillar: 'movement', completed: true }];
    
    expect(roundRobinStrategy({}, nutritionHistory)).toBe('sleep');
    expect(roundRobinStrategy({}, sleepHistory)).toBe('movement');
    expect(roundRobinStrategy({}, movementHistory)).toBe('nutrition');
  });

  // Test with long history (only last entry matters)
  it('should only consider last entry in history', () => {
    const history = [
      { date: '2024-02-10', pillar: 'sleep', completed: true },
      { date: '2024-02-11', pillar: 'movement', completed: true },
      { date: '2024-02-12', pillar: 'nutrition', completed: true },
      { date: '2024-02-13', pillar: 'sleep', completed: true },
      { date: '2024-02-14', pillar: 'movement', completed: true },
      { date: '2024-02-15', pillar: 'nutrition', completed: true } // Last entry
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('sleep'); // After nutrition comes sleep
  });

  // Test case sensitivity
  it('should be case sensitive for pillar names', () => {
    const history = [
      { date: '2024-02-15', pillar: 'NUTRITION', completed: true }
    ];
    
    // Uppercase should not match, treated as invalid
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition'); // Falls back to first pillar
  });

  // Test with extra spaces in pillar name
  it('should not match pillar names with extra spaces', () => {
    const history = [
      { date: '2024-02-15', pillar: ' nutrition ', completed: true }
    ];
    
    // Spaces make it invalid
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition'); // Falls back to first pillar
  });

  // Test deterministic behavior (same input = same output)
  it('should be deterministic (same input produces same output)', () => {
    const history = [
      { date: '2024-02-15', pillar: 'sleep', completed: true }
    ];
    
    const result1 = roundRobinStrategy({}, history);
    const result2 = roundRobinStrategy({}, history);
    const result3 = roundRobinStrategy({}, history);
    
    expect(result1).toBe('movement');
    expect(result2).toBe('movement');
    expect(result3).toBe('movement');
  });

  // Test pure function (doesn't modify inputs)
  it('should not modify input parameters', () => {
    const userStats = { nutrition: 50, sleep: 50, movement: 50 };
    const history = [
      { date: '2024-02-15', pillar: 'nutrition', completed: true }
    ];
    
    const userStatsCopy = { ...userStats };
    const historyCopy = JSON.parse(JSON.stringify(history));
    
    roundRobinStrategy(userStats, history);
    
    // Inputs should remain unchanged
    expect(userStats).toEqual(userStatsCopy);
    expect(history).toEqual(historyCopy);
  });

  // Test with history containing mixed valid and invalid entries
  it('should use last entry even if previous entries are invalid', () => {
    const history = [
      { date: '2024-02-13', pillar: 'invalid', completed: true },
      { date: '2024-02-14', pillar: 'also-invalid', completed: true },
      { date: '2024-02-15', pillar: 'sleep', completed: true } // Last entry is valid
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('movement'); // After sleep comes movement
  });

  // Test sequence order is correct
  it('should maintain correct sequence order: nutrition → sleep → movement', () => {
    // Start with nutrition
    const h1 = [{ date: '2024-02-13', pillar: 'nutrition', completed: true }];
    expect(roundRobinStrategy({}, h1)).toBe('sleep');
    
    // Then sleep
    const h2 = [{ date: '2024-02-14', pillar: 'sleep', completed: true }];
    expect(roundRobinStrategy({}, h2)).toBe('movement');
    
    // Then movement
    const h3 = [{ date: '2024-02-15', pillar: 'movement', completed: true }];
    expect(roundRobinStrategy({}, h3)).toBe('nutrition');
    
    // Verify it's not in a different order
    expect(roundRobinStrategy({}, h1)).not.toBe('movement');
    expect(roundRobinStrategy({}, h2)).not.toBe('nutrition');
    expect(roundRobinStrategy({}, h3)).not.toBe('sleep');
  });

  // Test with empty object as last entry
  it('should handle empty object as last entry', () => {
    const history = [
      { date: '2024-02-14', pillar: 'nutrition', completed: true },
      {} // Empty object
    ];
    
    const result = roundRobinStrategy({}, history);
    expect(result).toBe('nutrition'); // Falls back to first pillar
  });

  // Test return values are always valid pillars
  it('should always return a valid pillar', () => {
    const validPillars = ['nutrition', 'sleep', 'movement'];
    
    // Test with various inputs
    const testCases = [
      [],
      null,
      undefined,
      [{ date: '2024-02-15', pillar: 'nutrition', completed: true }],
      [{ date: '2024-02-15', pillar: 'sleep', completed: true }],
      [{ date: '2024-02-15', pillar: 'movement', completed: true }],
      [{ date: '2024-02-15', pillar: 'invalid', completed: true }]
    ];
    
    testCases.forEach(testCase => {
      const result = roundRobinStrategy({}, testCase);
      expect(validPillars).toContain(result);
    });
  });
});

describe('StreakManager - statsBasedStrategy', () => {
  // Import the strategy directly for testing
  const { statsBasedStrategy } = require('../../../src/modules/streakManager/strategies');
  
  // Requirement 5.2: Select pillar with lowest stat
  it('should return pillar with lowest stat value', () => {
    const userStats = {
      nutrition: 80,
      sleep: 40, // Lowest
      movement: 70
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep');
  });

  // Requirement 5.2: Handle different lowest pillars
  it('should return nutrition when it has lowest stat', () => {
    const userStats = {
      nutrition: 30, // Lowest
      sleep: 60,
      movement: 90
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition');
  });

  it('should return movement when it has lowest stat', () => {
    const userStats = {
      nutrition: 75,
      sleep: 85,
      movement: 25 // Lowest
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('movement');
  });

  // Requirement 5.2: Handle ties (when multiple pillars have same lowest value)
  it('should return first pillar in order when all stats are equal', () => {
    const userStats = {
      nutrition: 50,
      sleep: 50,
      movement: 50
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // First in order
  });

  it('should return first pillar with lowest value when there is a tie', () => {
    const userStats = {
      nutrition: 40, // Tied for lowest
      sleep: 40,     // Tied for lowest
      movement: 80
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // First in order
  });

  it('should return first pillar when sleep and movement are tied for lowest', () => {
    const userStats = {
      nutrition: 90,
      sleep: 30,     // Tied for lowest
      movement: 30   // Tied for lowest
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep'); // First in order among tied
  });

  // Requirement 5.2: Fallback to round-robin if no stats
  it('should fallback to round-robin when userStats is null', () => {
    const history = [
      { date: '2024-02-15', pillar: 'nutrition', completed: true }
    ];
    
    const result = statsBasedStrategy(null, history);
    expect(result).toBe('sleep'); // Round-robin after nutrition
  });

  it('should fallback to round-robin when userStats is undefined', () => {
    const history = [
      { date: '2024-02-15', pillar: 'sleep', completed: true }
    ];
    
    const result = statsBasedStrategy(undefined, history);
    expect(result).toBe('movement'); // Round-robin after sleep
  });

  it('should fallback to round-robin when userStats is empty object', () => {
    const history = [
      { date: '2024-02-15', pillar: 'movement', completed: true }
    ];
    
    const result = statsBasedStrategy({}, history);
    expect(result).toBe('nutrition'); // Round-robin after movement
  });

  it('should fallback to round-robin when userStats is empty and history is empty', () => {
    const result = statsBasedStrategy({}, []);
    expect(result).toBe('nutrition'); // Round-robin default
  });

  // Edge case: Missing pillar stats (treat as 0)
  it('should treat missing nutrition stat as 0', () => {
    const userStats = {
      sleep: 50,
      movement: 60
      // nutrition is missing
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // Missing = 0, which is lowest
  });

  it('should treat missing sleep stat as 0', () => {
    const userStats = {
      nutrition: 40,
      movement: 50
      // sleep is missing
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep'); // Missing = 0, which is lowest
  });

  it('should treat missing movement stat as 0', () => {
    const userStats = {
      nutrition: 30,
      sleep: 40
      // movement is missing
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('movement'); // Missing = 0, which is lowest
  });

  it('should handle when all pillar stats are missing', () => {
    const userStats = {
      someOtherStat: 100
      // No pillar stats
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // All missing = all 0, first wins
  });

  // Edge case: Zero values
  it('should correctly handle zero stat values', () => {
    const userStats = {
      nutrition: 0,  // Lowest
      sleep: 50,
      movement: 75
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition');
  });

  it('should handle when multiple pillars have zero stats', () => {
    const userStats = {
      nutrition: 0,  // Tied for lowest
      sleep: 0,      // Tied for lowest
      movement: 50
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // First in order
  });

  it('should handle when all pillars have zero stats', () => {
    const userStats = {
      nutrition: 0,
      sleep: 0,
      movement: 0
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // First in order
  });

  // Edge case: Negative values (shouldn't happen but handle gracefully)
  it('should handle negative stat values', () => {
    const userStats = {
      nutrition: 50,
      sleep: -10,    // Lowest (negative)
      movement: 30
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep');
  });

  it('should handle when all stats are negative', () => {
    const userStats = {
      nutrition: -20,
      sleep: -50,    // Lowest
      movement: -10
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep');
  });

  // Edge case: Very large values
  it('should handle very large stat values', () => {
    const userStats = {
      nutrition: 1000000,
      sleep: 999999,  // Lowest
      movement: 1000001
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep');
  });

  // Edge case: Decimal values
  it('should handle decimal stat values', () => {
    const userStats = {
      nutrition: 45.7,
      sleep: 45.5,   // Lowest
      movement: 45.9
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep');
  });

  // Test that pillarHistory parameter is ignored (strategy doesn't use it)
  it('should ignore pillarHistory parameter', () => {
    const userStats = {
      nutrition: 80,
      sleep: 40,
      movement: 70
    };
    
    const result1 = statsBasedStrategy(userStats, []);
    const result2 = statsBasedStrategy(userStats, [{ date: '2024-02-15', pillar: 'nutrition', completed: true }]);
    const result3 = statsBasedStrategy(userStats, null);
    const result4 = statsBasedStrategy(userStats, undefined);
    
    // All should return same result regardless of pillarHistory
    expect(result1).toBe('sleep');
    expect(result2).toBe('sleep');
    expect(result3).toBe('sleep');
    expect(result4).toBe('sleep');
  });

  // Test deterministic behavior (same input = same output)
  it('should be deterministic (same input produces same output)', () => {
    const userStats = {
      nutrition: 60,
      sleep: 30,
      movement: 90
    };
    
    const result1 = statsBasedStrategy(userStats, []);
    const result2 = statsBasedStrategy(userStats, []);
    const result3 = statsBasedStrategy(userStats, []);
    
    expect(result1).toBe('sleep');
    expect(result2).toBe('sleep');
    expect(result3).toBe('sleep');
  });

  // Test pure function (doesn't modify inputs)
  it('should not modify input parameters', () => {
    const userStats = { nutrition: 50, sleep: 30, movement: 70 };
    const history = [
      { date: '2024-02-15', pillar: 'nutrition', completed: true }
    ];
    
    const userStatsCopy = { ...userStats };
    const historyCopy = JSON.parse(JSON.stringify(history));
    
    statsBasedStrategy(userStats, history);
    
    // Inputs should remain unchanged
    expect(userStats).toEqual(userStatsCopy);
    expect(history).toEqual(historyCopy);
  });

  // Test return values are always valid pillars
  it('should always return a valid pillar', () => {
    const validPillars = ['nutrition', 'sleep', 'movement'];
    
    // Test with various inputs
    const testCases = [
      { nutrition: 50, sleep: 30, movement: 70 },
      { nutrition: 10, sleep: 90, movement: 50 },
      { nutrition: 80, sleep: 60, movement: 20 },
      {},
      null,
      undefined
    ];
    
    testCases.forEach(testCase => {
      const result = statsBasedStrategy(testCase, []);
      expect(validPillars).toContain(result);
    });
  });

  // Test with only one pillar stat present
  it('should handle when only one pillar stat is present', () => {
    const userStats = {
      sleep: 100
      // nutrition and movement missing (treated as 0)
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // First missing pillar (0 is lowest)
  });

  // Test with extra properties in userStats
  it('should ignore extra properties in userStats', () => {
    const userStats = {
      nutrition: 60,
      sleep: 40,
      movement: 80,
      extraProperty: 999,
      anotherExtra: 1000
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep'); // Only considers pillar stats
  });

  // Test case sensitivity (pillar names should be lowercase)
  it('should not match uppercase pillar names in userStats', () => {
    const userStats = {
      NUTRITION: 10,  // Uppercase, should be ignored
      sleep: 50,
      movement: 60
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // nutrition missing (0), which is lowest
  });

  // Test with string values (should handle gracefully)
  it('should handle string values in userStats', () => {
    const userStats = {
      nutrition: '50',  // String
      sleep: 30,
      movement: 70
    };
    
    const result = statsBasedStrategy(userStats, []);
    // String '50' is not < 30, so sleep should still be lowest
    expect(result).toBe('sleep');
  });

  // Test with NaN values
  it('should handle NaN values in userStats', () => {
    const userStats = {
      nutrition: NaN,
      sleep: 50,
      movement: 60
    };
    
    const result = statsBasedStrategy(userStats, []);
    // NaN comparisons are tricky, but should still return a valid pillar
    expect(['nutrition', 'sleep', 'movement']).toContain(result);
  });

  // Test with Infinity values
  it('should handle Infinity values in userStats', () => {
    const userStats = {
      nutrition: Infinity,
      sleep: 50,      // Lowest
      movement: 100
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep');
  });

  // Test comprehensive scenario with all three pillars at different values
  it('should correctly identify lowest among three different values', () => {
    const scenarios = [
      { stats: { nutrition: 10, sleep: 20, movement: 30 }, expected: 'nutrition' },
      { stats: { nutrition: 30, sleep: 10, movement: 20 }, expected: 'sleep' },
      { stats: { nutrition: 20, sleep: 30, movement: 10 }, expected: 'movement' },
      { stats: { nutrition: 100, sleep: 1, movement: 50 }, expected: 'sleep' },
      { stats: { nutrition: 0, sleep: 100, movement: 100 }, expected: 'nutrition' },
      { stats: { nutrition: 99, sleep: 99, movement: 98 }, expected: 'movement' }
    ];
    
    scenarios.forEach(({ stats, expected }) => {
      const result = statsBasedStrategy(stats, []);
      expect(result).toBe(expected);
    });
  });

  // Test that strategy prioritizes lowest progress (requirement validation)
  it('should prioritize pillar with lowest progress to help user balance', () => {
    // User has high nutrition and movement, but low sleep
    const userStats = {
      nutrition: 85,  // High progress
      sleep: 20,      // Low progress - needs attention
      movement: 90    // High progress
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('sleep'); // Should prioritize the pillar that needs work
  });

  // Test edge case: all stats exactly the same
  it('should handle when all three stats are exactly equal', () => {
    const userStats = {
      nutrition: 42,
      sleep: 42,
      movement: 42
    };
    
    const result = statsBasedStrategy(userStats, []);
    expect(result).toBe('nutrition'); // First in sequence when tied
  });
});


describe('StreakManager - getRotationStrategy', () => {
  // Requirement 5.4: Return strategy function by name
  describe('Strategy retrieval', () => {
    it('should return round-robin strategy function when requested', () => {
      const strategy = streakManager.getRotationStrategy('round-robin');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      // Verify it's the correct strategy by testing behavior
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition'); // First pillar in round-robin
    });

    it('should return stats-based strategy function when requested', () => {
      const strategy = streakManager.getRotationStrategy('stats-based');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      // Verify it's the correct strategy by testing behavior
      const userStats = {
        nutrition: 80,
        sleep: 30, // Lowest
        movement: 70
      };
      const result = strategy(userStats, []);
      expect(result).toBe('sleep'); // Pillar with lowest stat
    });

    it('should return weighted-random strategy function when requested', () => {
      const strategy = streakManager.getRotationStrategy('weighted-random');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      // Verify it's the correct strategy by testing behavior
      const userStats = {
        nutrition: 50,
        sleep: 50,
        movement: 50
      };
      const result = strategy(userStats, []);
      expect(['nutrition', 'sleep', 'movement']).toContain(result);
    });
  });

  // Requirement 5.4: Fallback to round-robin if strategy doesn't exist
  describe('Fallback behavior', () => {
    it('should fallback to round-robin for unknown strategy name', () => {
      const strategy = streakManager.getRotationStrategy('unknown-strategy');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      // Verify it's round-robin by testing behavior
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition'); // First pillar in round-robin
    });

    it('should fallback to round-robin for null strategy name', () => {
      const strategy = streakManager.getRotationStrategy(null);
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should fallback to round-robin for undefined strategy name', () => {
      const strategy = streakManager.getRotationStrategy(undefined);
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should fallback to round-robin for empty string strategy name', () => {
      const strategy = streakManager.getRotationStrategy('');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should fallback to round-robin for invalid strategy name with special characters', () => {
      const strategy = streakManager.getRotationStrategy('invalid@strategy!');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should fallback to round-robin for numeric strategy name', () => {
      const strategy = streakManager.getRotationStrategy(123);
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should fallback to round-robin for object strategy name', () => {
      const strategy = streakManager.getRotationStrategy({ name: 'round-robin' });
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should fallback to round-robin for array strategy name', () => {
      const strategy = streakManager.getRotationStrategy(['round-robin']);
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });
  });

  // Edge cases: Case sensitivity and whitespace
  describe('Case sensitivity and whitespace', () => {
    it('should be case-sensitive (uppercase should not match)', () => {
      const strategy = streakManager.getRotationStrategy('ROUND-ROBIN');
      
      // Should fallback to round-robin since uppercase doesn't match
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should be case-sensitive (mixed case should not match)', () => {
      const strategy = streakManager.getRotationStrategy('Round-Robin');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should not match strategy names with leading spaces', () => {
      const strategy = streakManager.getRotationStrategy(' round-robin');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should not match strategy names with trailing spaces', () => {
      const strategy = streakManager.getRotationStrategy('round-robin ');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });

    it('should not match strategy names with extra spaces', () => {
      const strategy = streakManager.getRotationStrategy('round - robin');
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      const history = [];
      const result = strategy({}, history);
      expect(result).toBe('nutrition');
    });
  });

  // Verify returned functions are callable and work correctly
  describe('Returned function behavior', () => {
    it('should return callable function that accepts userStats and pillarHistory', () => {
      const strategy = streakManager.getRotationStrategy('round-robin');
      
      expect(typeof strategy).toBe('function');
      expect(strategy.length).toBeGreaterThanOrEqual(0); // Function has parameters
      
      // Should be callable with standard parameters
      const result = strategy({}, []);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return function that works with various inputs', () => {
      const strategy = streakManager.getRotationStrategy('stats-based');
      
      // Test with different inputs
      const result1 = strategy({}, []);
      const result2 = strategy({ nutrition: 50, sleep: 30, movement: 70 }, []);
      const result3 = strategy(null, null);
      
      expect(['nutrition', 'sleep', 'movement']).toContain(result1);
      expect(['nutrition', 'sleep', 'movement']).toContain(result2);
      expect(['nutrition', 'sleep', 'movement']).toContain(result3);
    });

    it('should return function that produces consistent results for deterministic strategies', () => {
      const strategy = streakManager.getRotationStrategy('round-robin');
      
      const history = [
        { date: new Date().toISOString(), pillar: 'nutrition', completed: true }
      ];
      
      // Round-robin should be deterministic
      const result1 = strategy({}, history);
      const result2 = strategy({}, history);
      const result3 = strategy({}, history);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe('sleep'); // Next after nutrition
    });

    it('should return function that can be called multiple times', () => {
      const strategy = streakManager.getRotationStrategy('weighted-random');
      
      const userStats = { nutrition: 50, sleep: 50, movement: 50 };
      
      // Should be able to call multiple times without errors
      for (let i = 0; i < 10; i++) {
        const result = strategy(userStats, []);
        expect(['nutrition', 'sleep', 'movement']).toContain(result);
      }
    });
  });

  // Test all three strategy names
  describe('All strategy names', () => {
    it('should support all three strategy names', () => {
      const strategies = ['round-robin', 'stats-based', 'weighted-random'];
      
      strategies.forEach(strategyName => {
        const strategy = streakManager.getRotationStrategy(strategyName);
        
        expect(strategy).toBeDefined();
        expect(typeof strategy).toBe('function');
        
        const result = strategy({}, []);
        expect(['nutrition', 'sleep', 'movement']).toContain(result);
      });
    });

    it('should return different strategy functions for different names', () => {
      const roundRobin = streakManager.getRotationStrategy('round-robin');
      const statsBased = streakManager.getRotationStrategy('stats-based');
      const weightedRandom = streakManager.getRotationStrategy('weighted-random');
      
      // Verify they produce different behaviors
      const userStats = {
        nutrition: 80,
        sleep: 30, // Lowest
        movement: 70
      };
      const history = [];
      
      const rrResult = roundRobin(userStats, history);
      const sbResult = statsBased(userStats, history);
      
      expect(rrResult).toBe('nutrition'); // Round-robin starts with nutrition
      expect(sbResult).toBe('sleep'); // Stats-based picks lowest
      
      // Weighted-random should return one of the three
      const wrResult = weightedRandom(userStats, history);
      expect(['nutrition', 'sleep', 'movement']).toContain(wrResult);
    });
  });

  // Test that fallback always returns round-robin
  describe('Fallback consistency', () => {
    it('should always fallback to the same strategy (round-robin)', () => {
      const invalidNames = [
        'invalid',
        'unknown',
        'fake-strategy',
        '',
        null,
        undefined,
        123,
        {},
        []
      ];
      
      const history = [
        { date: new Date().toISOString(), pillar: 'nutrition', completed: true }
      ];
      
      invalidNames.forEach(name => {
        const strategy = streakManager.getRotationStrategy(name);
        const result = strategy({}, history);
        
        // All should fallback to round-robin, which returns 'sleep' after 'nutrition'
        expect(result).toBe('sleep');
      });
    });

    it('should return same function reference for same strategy name', () => {
      const strategy1 = streakManager.getRotationStrategy('round-robin');
      const strategy2 = streakManager.getRotationStrategy('round-robin');
      
      // Should return the same function reference (from strategies map)
      expect(strategy1).toBe(strategy2);
    });

    it('should return same fallback function for all invalid names', () => {
      const fallback1 = streakManager.getRotationStrategy('invalid1');
      const fallback2 = streakManager.getRotationStrategy('invalid2');
      const fallback3 = streakManager.getRotationStrategy(null);
      
      // All should return the same round-robin function
      expect(fallback1).toBe(fallback2);
      expect(fallback2).toBe(fallback3);
    });
  });

  // Integration with rotatePillar
  describe('Integration with rotatePillar', () => {
    it('should work when used by rotatePillar method', () => {
      // rotatePillar internally uses getRotationStrategy
      const result = streakManager.rotatePillar(false, null, 'round-robin', {}, []);
      
      expect(result).toBeDefined();
      expect(result.pillar).toBe('nutrition'); // First in round-robin
    });

    it('should fallback correctly when rotatePillar uses invalid strategy', () => {
      const result = streakManager.rotatePillar(false, null, 'invalid-strategy', {}, []);
      
      expect(result).toBeDefined();
      expect(result.pillar).toBe('nutrition'); // Fallback to round-robin
    });

    it('should work with stats-based strategy in rotatePillar', () => {
      const userStats = {
        nutrition: 80,
        sleep: 30, // Lowest
        movement: 70
      };
      
      const result = streakManager.rotatePillar(false, null, 'stats-based', userStats, []);
      
      expect(result).toBeDefined();
      expect(result.pillar).toBe('sleep'); // Stats-based picks lowest
    });
  });

  // Performance and edge cases
  describe('Performance and edge cases', () => {
    it('should handle rapid successive calls', () => {
      for (let i = 0; i < 100; i++) {
        const strategy = streakManager.getRotationStrategy('round-robin');
        expect(strategy).toBeDefined();
        expect(typeof strategy).toBe('function');
      }
    });

    it('should handle very long strategy names', () => {
      const longName = 'a'.repeat(1000);
      const strategy = streakManager.getRotationStrategy(longName);
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      // Should fallback to round-robin
      const result = strategy({}, []);
      expect(result).toBe('nutrition');
    });

    it('should handle strategy names with unicode characters', () => {
      const unicodeName = 'round-robin-🔥';
      const strategy = streakManager.getRotationStrategy(unicodeName);
      
      expect(strategy).toBeDefined();
      expect(typeof strategy).toBe('function');
      
      // Should fallback to round-robin
      const result = strategy({}, []);
      expect(result).toBe('nutrition');
    });

    it('should not throw errors for any input type', () => {
      const inputs = [
        'round-robin',
        'invalid',
        null,
        undefined,
        '',
        123,
        true,
        false,
        {},
        [],
        () => {},
        Symbol('test')
      ];
      
      inputs.forEach(input => {
        expect(() => {
          const strategy = streakManager.getRotationStrategy(input);
          strategy({}, []);
        }).not.toThrow();
      });
    });
  });
});
