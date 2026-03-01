/**
 * Definiciones de rutas de progresión
 * Cada ruta tiene niveles con experiencia requerida y features desbloqueadas
 */
export const LEVEL_ROUTES = {
  beginner: {
    id: 'beginner',
    name: 'Principiante',
    description: 'Para quienes comienzan su viaje de bienestar',
    color: '#4CAF50',
    levels: [
      { level: 1, experienceRequired: 0, title: 'Novato', unlockedFeatures: ['basic_tracking'] },
      { level: 2, experienceRequired: 100, title: 'Aprendiz', unlockedFeatures: ['daily_tips'] },
      { level: 3, experienceRequired: 400, title: 'Estudiante', unlockedFeatures: ['weekly_summary'] },
      { level: 4, experienceRequired: 900, title: 'Practicante', unlockedFeatures: ['custom_goals'] },
      { level: 5, experienceRequired: 1600, title: 'Dedicado', unlockedFeatures: ['achievement_badges'] },
      { level: 6, experienceRequired: 2500, title: 'Comprometido', unlockedFeatures: ['streak_recovery'] },
      { level: 7, experienceRequired: 3600, title: 'Persistente', unlockedFeatures: ['advanced_stats'] },
      { level: 8, experienceRequired: 4900, title: 'Determinado', unlockedFeatures: ['monthly_challenges'] },
      { level: 9, experienceRequired: 6400, title: 'Enfocado', unlockedFeatures: ['social_sharing'] },
      { level: 10, experienceRequired: 8100, title: 'Graduado', unlockedFeatures: ['route_upgrade'] }
    ]
  },
  intermediate: {
    id: 'intermediate',
    name: 'Intermedio',
    description: 'Para quienes tienen experiencia en hábitos saludables',
    color: '#2196F3',
    levels: [
      { level: 11, experienceRequired: 10000, title: 'Intermedio I', unlockedFeatures: ['advanced_tracking'] },
      { level: 12, experienceRequired: 12100, title: 'Intermedio II', unlockedFeatures: ['custom_pillars'] },
      { level: 13, experienceRequired: 14400, title: 'Intermedio III', unlockedFeatures: ['pillar_rotation'] },
      { level: 14, experienceRequired: 16900, title: 'Intermedio IV', unlockedFeatures: ['insights'] },
      { level: 15, experienceRequired: 19600, title: 'Intermedio V', unlockedFeatures: ['predictions'] },
      { level: 16, experienceRequired: 22500, title: 'Avanzando I', unlockedFeatures: ['coaching_tips'] },
      { level: 17, experienceRequired: 25600, title: 'Avanzando II', unlockedFeatures: ['habit_stacking'] },
      { level: 18, experienceRequired: 28900, title: 'Avanzando III', unlockedFeatures: ['community_access'] },
      { level: 19, experienceRequired: 32400, title: 'Avanzando IV', unlockedFeatures: ['mentor_program'] },
      { level: 20, experienceRequired: 36100, title: 'Avanzando V', unlockedFeatures: ['route_upgrade'] }
    ]
  },
  advanced: {
    id: 'advanced',
    name: 'Avanzado',
    description: 'Para expertos en optimización de bienestar',
    color: '#9C27B0',
    levels: [
      { level: 21, experienceRequired: 40000, title: 'Avanzado I', unlockedFeatures: ['biometric_integration'] },
      { level: 22, experienceRequired: 44100, title: 'Avanzado II', unlockedFeatures: ['ai_recommendations'] },
      { level: 23, experienceRequired: 48400, title: 'Avanzado III', unlockedFeatures: ['performance_analytics'] },
      { level: 24, experienceRequired: 52900, title: 'Avanzado IV', unlockedFeatures: ['custom_algorithms'] },
      { level: 25, experienceRequired: 57600, title: 'Avanzado V', unlockedFeatures: ['route_upgrade'] }
    ]
  },
  expert: {
    id: 'expert',
    name: 'Experto',
    description: 'Para maestros del bienestar integral',
    color: '#FF9800',
    levels: [
      { level: 26, experienceRequired: 62500, title: 'Experto I', unlockedFeatures: ['research_access'] },
      { level: 27, experienceRequired: 67600, title: 'Experto II', unlockedFeatures: ['beta_features'] },
      { level: 28, experienceRequired: 72900, title: 'Experto III', unlockedFeatures: ['api_access'] },
      { level: 29, experienceRequired: 78400, title: 'Experto IV', unlockedFeatures: ['white_label'] },
      { level: 30, experienceRequired: 84100, title: 'Maestro', unlockedFeatures: ['lifetime_access'] }
    ]
  }
};

/**
 * Obtiene la siguiente ruta en el orden de progresión
 * @param {string} currentRoute - Ruta actual
 * @returns {string|null} Siguiente ruta o null si es la última
 */
export const getNextRoute = (currentRoute) => {
  const routeOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  const currentIndex = routeOrder.indexOf(currentRoute);
  
  if (currentIndex === -1 || currentIndex === routeOrder.length - 1) {
    return null;
  }
  
  return routeOrder[currentIndex + 1];
};

/**
 * Obtiene el nivel de completación de una ruta
 * @param {string} route - ID de la ruta
 * @returns {number} Nivel máximo de la ruta
 */
export const getRouteCompletionLevel = (route) => {
  const completionLevels = {
    beginner: 10,
    intermediate: 20,
    advanced: 25,
    expert: 30
  };
  
  return completionLevels[route] || 0;
};
