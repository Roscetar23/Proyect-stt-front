export const mockUsers = [
  {
    id: 'user-001',
    name: 'Ana García',
    level: 1,
    experience: 0,
    currentStreak: 0,
    longestStreak: 0,
    selectedRoute: 'intermediate',
    completedAchievements: [],
    stats: {
      nutrition: 0,
      sleep: 0,
      movement: 0
    }
  },
  {
    id: 'user-002',
    name: 'Carlos Rodríguez',
    level: 12,
    experience: 14400,
    currentStreak: 30,
    longestStreak: 45,
    selectedRoute: 'advanced',
    completedAchievements: [
      'first_week', 
      'first_month', 
      'level_10', 
      'level_12',
      'sleep_champion',
      'movement_expert'
    ],
    stats: {
      nutrition: 85,
      sleep: 90,
      movement: 95
    }
  }
];
