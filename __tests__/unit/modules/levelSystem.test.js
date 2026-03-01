// Mock para evitar problemas con Expo
jest.mock('expo', () => ({}), { virtual: true });

const levelSystem = require('../../../src/modules/levelSystem').default;

describe('LevelSystem - calculateLevel', () => {
  describe('Basic functionality', () => {
    test('should calculate level from experience for beginner route', () => {
      expect(levelSystem.calculateLevel(0, 'beginner')).toBe(1);
      expect(levelSystem.calculateLevel(100, 'beginner')).toBe(2);
      expect(levelSystem.calculateLevel(400, 'beginner')).toBe(3);
      expect(levelSystem.calculateLevel(8100, 'beginner')).toBe(10);
    });

    test('should calculate level from experience for intermediate route', () => {
      expect(levelSystem.calculateLevel(10000, 'intermediate')).toBe(11);
      expect(levelSystem.calculateLevel(12100, 'intermediate')).toBe(12);
      expect(levelSystem.calculateLevel(36100, 'intermediate')).toBe(20);
    });

    test('should calculate level from experience for advanced route', () => {
      expect(levelSystem.calculateLevel(40000, 'advanced')).toBe(21);
      expect(levelSystem.calculateLevel(57600, 'advanced')).toBe(25);
    });

    test('should calculate level from experience for expert route', () => {
      expect(levelSystem.calculateLevel(62500, 'expert')).toBe(26);
      expect(levelSystem.calculateLevel(84100, 'expert')).toBe(30);
    });
  });

  describe('Edge cases', () => {
    test('should return level 1 when experience is 0', () => {
      expect(levelSystem.calculateLevel(0, 'beginner')).toBe(1);
      expect(levelSystem.calculateLevel(0, 'intermediate')).toBe(1);
      expect(levelSystem.calculateLevel(0, 'advanced')).toBe(1);
      expect(levelSystem.calculateLevel(0, 'expert')).toBe(1);
    });

    test('should return highest level reached with given experience', () => {
      // Experience between level 2 and 3 (100-399)
      expect(levelSystem.calculateLevel(250, 'beginner')).toBe(2);
      
      // Experience between level 9 and 10 (6400-8099)
      expect(levelSystem.calculateLevel(7000, 'beginner')).toBe(9);
      
      // Experience exactly at level threshold
      expect(levelSystem.calculateLevel(400, 'beginner')).toBe(3);
    });

    test('should handle experience beyond max level', () => {
      // Experience beyond level 10 for beginner
      expect(levelSystem.calculateLevel(10000, 'beginner')).toBe(10);
      expect(levelSystem.calculateLevel(100000, 'beginner')).toBe(10);
    });
  });

  describe('Route validation', () => {
    test('should validate route and default to beginner for invalid route', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(levelSystem.calculateLevel(500, 'invalid')).toBe(3);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid route: invalid')
      );
      
      consoleSpy.mockRestore();
    });

    test('should handle null or undefined route', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(levelSystem.calculateLevel(500, null)).toBe(3);
      expect(levelSystem.calculateLevel(500, undefined)).toBe(3);
      
      consoleSpy.mockRestore();
    });

    test('should support all 4 valid routes', () => {
      expect(levelSystem.calculateLevel(100, 'beginner')).toBe(2);
      expect(levelSystem.calculateLevel(10000, 'intermediate')).toBe(11);
      expect(levelSystem.calculateLevel(40000, 'advanced')).toBe(21);
      expect(levelSystem.calculateLevel(62500, 'expert')).toBe(26);
    });
  });

  describe('Experience validation', () => {
    test('should handle negative experience', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(levelSystem.calculateLevel(-100, 'beginner')).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid experience: -100')
      );
      
      consoleSpy.mockRestore();
    });

    test('should handle NaN experience', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(levelSystem.calculateLevel(NaN, 'beginner')).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid experience: NaN')
      );
      
      consoleSpy.mockRestore();
    });

    test('should handle non-numeric experience', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(levelSystem.calculateLevel('500', 'beginner')).toBe(1);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Default parameters', () => {
    test('should default to beginner route when route not provided', () => {
      expect(levelSystem.calculateLevel(100)).toBe(2);
      expect(levelSystem.calculateLevel(400)).toBe(3);
    });
  });
});

describe('LevelSystem - getLevelInfo', () => {
  test('should return level info for valid level and route', () => {
    const info = levelSystem.getLevelInfo(5, 'beginner');
    expect(info).toEqual({
      level: 5,
      experienceRequired: 1600,
      title: 'Dedicado',
      unlockedFeatures: ['achievement_badges']
    });
  });

  test('should return null for invalid level', () => {
    expect(levelSystem.getLevelInfo(999, 'beginner')).toBeNull();
  });

  test('should return null for invalid route', () => {
    expect(levelSystem.getLevelInfo(5, 'invalid')).toBeNull();
  });
});

describe('LevelSystem - getExperienceForNextLevel', () => {
  test('should return experience needed for next level', () => {
    expect(levelSystem.getExperienceForNextLevel(1, 'beginner')).toBe(100);
    expect(levelSystem.getExperienceForNextLevel(5, 'beginner')).toBe(2500);
  });

  test('should return 0 for max level', () => {
    expect(levelSystem.getExperienceForNextLevel(10, 'beginner')).toBe(0);
    expect(levelSystem.getExperienceForNextLevel(30, 'expert')).toBe(0);
  });
});

describe('LevelSystem - calculateProgress', () => {
  test('should calculate progress correctly', () => {
    const progress = levelSystem.calculateProgress(1800, 5, 'beginner');
    expect(progress.percent).toBeCloseTo(22.22, 1);
    expect(progress.current).toBe(200);
    expect(progress.needed).toBe(900);
  });

  test('should return 100% for max level', () => {
    const progress = levelSystem.calculateProgress(10000, 10, 'beginner');
    expect(progress.percent).toBe(100);
  });

  test('should clamp percent between 0 and 100', () => {
    const progress = levelSystem.calculateProgress(100, 1, 'beginner');
    expect(progress.percent).toBeGreaterThanOrEqual(0);
    expect(progress.percent).toBeLessThanOrEqual(100);
  });
});

describe('LevelSystem - getUnlockedFeatures', () => {
  test('should return all features up to current level', () => {
    const features = levelSystem.getUnlockedFeatures(3, 'beginner');
    expect(features).toEqual(['basic_tracking', 'daily_tips', 'weekly_summary']);
  });

  test('should return empty array for invalid route', () => {
    const features = levelSystem.getUnlockedFeatures(5, 'invalid');
    expect(features).toEqual([]);
  });

  test('should accumulate features from all previous levels', () => {
    const features = levelSystem.getUnlockedFeatures(5, 'beginner');
    expect(features.length).toBe(5);
    expect(features).toContain('basic_tracking');
    expect(features).toContain('achievement_badges');
  });
});

describe('LevelSystem - canChangeRoute', () => {
  test('should allow route change when requirements are met', () => {
    expect(levelSystem.canChangeRoute(10, 'beginner', 'intermediate')).toBe(true);
    expect(levelSystem.canChangeRoute(20, 'intermediate', 'advanced')).toBe(true);
    expect(levelSystem.canChangeRoute(25, 'advanced', 'expert')).toBe(true);
  });

  test('should not allow route change when level requirement not met', () => {
    expect(levelSystem.canChangeRoute(5, 'beginner', 'intermediate')).toBe(false);
    expect(levelSystem.canChangeRoute(15, 'intermediate', 'advanced')).toBe(false);
  });

  test('should not allow skipping routes', () => {
    expect(levelSystem.canChangeRoute(10, 'beginner', 'advanced')).toBe(false);
    expect(levelSystem.canChangeRoute(10, 'beginner', 'expert')).toBe(false);
  });

  test('should not allow going backwards', () => {
    expect(levelSystem.canChangeRoute(20, 'intermediate', 'beginner')).toBe(false);
  });
});

describe('LevelSystem - assessUserLevel', () => {
  test('should recommend beginner for low scores', () => {
    expect(levelSystem.assessUserLevel({ score: 0 })).toBe('beginner');
    expect(levelSystem.assessUserLevel({ score: 29 })).toBe('beginner');
  });

  test('should recommend intermediate for medium-low scores', () => {
    expect(levelSystem.assessUserLevel({ score: 30 })).toBe('intermediate');
    expect(levelSystem.assessUserLevel({ score: 59 })).toBe('intermediate');
  });

  test('should recommend advanced for medium-high scores', () => {
    expect(levelSystem.assessUserLevel({ score: 60 })).toBe('advanced');
    expect(levelSystem.assessUserLevel({ score: 84 })).toBe('advanced');
  });

  test('should recommend expert for high scores', () => {
    expect(levelSystem.assessUserLevel({ score: 85 })).toBe('expert');
    expect(levelSystem.assessUserLevel({ score: 100 })).toBe('expert');
  });

  test('should handle missing score', () => {
    expect(levelSystem.assessUserLevel({})).toBe('beginner');
  });
});
