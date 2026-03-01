/**
 * Calculadora de experiencia
 * Funciones para calcular XP otorgado por diferentes acciones
 */

/**
 * Experiencia base por completar un pilar
 */
export const XP_PER_PILLAR = 50;

/**
 * Experiencia adicional por hitos de racha
 */
export const XP_STREAK_MILESTONES = {
  7: 100,   // 7 días
  30: 100,  // 30 días
  100: 100  // 100 días
};

/**
 * Experiencia por desbloquear un logro
 */
export const XP_PER_ACHIEVEMENT = 75;

/**
 * Calcula XP por completar un pilar
 * @returns {number} XP otorgado
 */
export const calculatePillarXP = () => {
  return XP_PER_PILLAR;
};

/**
 * Calcula XP por alcanzar un hito de racha
 * @param {number} streakDays - Días de racha alcanzados
 * @returns {number} XP otorgado (0 si no es un hito)
 */
export const calculateStreakMilestoneXP = (streakDays) => {
  return XP_STREAK_MILESTONES[streakDays] || 0;
};

/**
 * Calcula XP por desbloquear un logro
 * @returns {number} XP otorgado
 */
export const calculateAchievementXP = () => {
  return XP_PER_ACHIEVEMENT;
};

/**
 * Calcula XP total por una acción
 * @param {string} action - Tipo de acción (pillar, streak_milestone, achievement)
 * @param {object} data - Datos adicionales (ej: streakDays)
 * @returns {number} XP total otorgado
 */
export const calculateExperience = (action, data = {}) => {
  switch (action) {
    case 'pillar':
      return calculatePillarXP();
    
    case 'streak_milestone':
      return calculateStreakMilestoneXP(data.streakDays);
    
    case 'achievement':
      return calculateAchievementXP();
    
    default:
      console.warn(`Unknown action type: ${action}`);
      return 0;
  }
};

/**
 * Calcula experiencia requerida para un nivel específico
 * Usa fórmula cuadrática: XP = baseXP * level^2
 * @param {number} level - Nivel objetivo
 * @param {number} baseXP - XP base (default: 100)
 * @returns {number} XP requerido
 */
export const calculateExperienceForLevel = (level, baseXP = 100) => {
  if (level <= 1) return 0;
  return baseXP * Math.pow(level - 1, 2);
};

/**
 * Calcula el nivel basado en experiencia total
 * Inversa de la fórmula cuadrática
 * @param {number} experience - Experiencia total
 * @param {number} baseXP - XP base (default: 100)
 * @returns {number} Nivel calculado
 */
export const calculateLevelFromExperience = (experience, baseXP = 100) => {
  if (experience <= 0) return 1;
  return Math.floor(Math.sqrt(experience / baseXP)) + 1;
};
