export const mockAchievements = [
  // Streak achievements
  {
    id: 'first_week',
    title: '¡Primera Semana!',
    description: 'Completa una racha de 7 días',
    icon: '🔥',
    category: 'streak',
    requirement: {
      type: 'streak_count',
      value: 7
    },
    unlockedAt: null
  },
  {
    id: 'first_month',
    title: 'Mes Completo',
    description: 'Mantén una racha de 30 días',
    icon: '🏆',
    category: 'streak',
    requirement: {
      type: 'streak_count',
      value: 30
    },
    unlockedAt: null
  },
  {
    id: 'unstoppable',
    title: 'Imparable',
    description: 'Alcanza una racha de 100 días',
    icon: '⚡',
    category: 'streak',
    requirement: {
      type: 'streak_count',
      value: 100
    },
    unlockedAt: null
  },
  
  // Level achievements
  {
    id: 'level_5',
    title: 'Nivel 5 Alcanzado',
    description: 'Llega al nivel 5',
    icon: '⭐',
    category: 'level',
    requirement: {
      type: 'level',
      value: 5
    },
    unlockedAt: null
  },
  {
    id: 'level_10',
    title: 'Nivel 10 Maestro',
    description: 'Alcanza el nivel 10',
    icon: '🌟',
    category: 'level',
    requirement: {
      type: 'level',
      value: 10
    },
    unlockedAt: null
  },
  {
    id: 'level_25',
    title: 'Experto Nivel 25',
    description: 'Llega al nivel 25',
    icon: '💫',
    category: 'level',
    requirement: {
      type: 'level',
      value: 25
    },
    unlockedAt: null
  },
  
  // Pillar achievements
  {
    id: 'nutrition_master',
    title: 'Maestro de Nutrición',
    description: 'Completa 20 días de nutrición',
    icon: '🥗',
    category: 'pillar',
    requirement: {
      type: 'pillar_count',
      pillar: 'nutrition',
      value: 20
    },
    unlockedAt: null
  },
  {
    id: 'sleep_champion',
    title: 'Campeón del Sueño',
    description: 'Completa 20 días de sueño',
    icon: '😴',
    category: 'pillar',
    requirement: {
      type: 'pillar_count',
      pillar: 'sleep',
      value: 20
    },
    unlockedAt: null
  },
  {
    id: 'movement_expert',
    title: 'Experto en Movimiento',
    description: 'Completa 20 días de movimiento',
    icon: '🏃',
    category: 'pillar',
    requirement: {
      type: 'pillar_count',
      pillar: 'movement',
      value: 20
    },
    unlockedAt: null
  },
  
  // Special achievements
  {
    id: 'perfect_balance',
    title: 'Balance Perfecto',
    description: 'Completa los 3 pilares en una semana',
    icon: '⚖️',
    category: 'special',
    requirement: {
      type: 'all_pillars_week',
      value: 1
    },
    unlockedAt: null
  }
];
