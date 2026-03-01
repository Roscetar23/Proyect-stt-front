/**
 * Funciones de validación para el sistema de niveles
 */

/**
 * Valida si una ruta es válida
 * @param {string} route - ID de la ruta
 * @returns {boolean} true si es válida
 */
export const isValidRoute = (route) => {
  const validRoutes = ['beginner', 'intermediate', 'advanced', 'expert'];
  return validRoutes.includes(route);
};

/**
 * Valida si un nivel es válido para una ruta
 * @param {number} level - Número de nivel
 * @param {string} route - ID de la ruta
 * @returns {boolean} true si es válido
 */
export const isValidLevel = (level, route) => {
  const levelRanges = {
    beginner: { min: 1, max: 10 },
    intermediate: { min: 11, max: 20 },
    advanced: { min: 21, max: 25 },
    expert: { min: 26, max: 30 }
  };

  const range = levelRanges[route];
  if (!range) return false;

  return level >= range.min && level <= range.max;
};

/**
 * Valida si la experiencia es un número válido
 * @param {number} experience - Experiencia a validar
 * @returns {boolean} true si es válida
 */
export const isValidExperience = (experience) => {
  return typeof experience === 'number' && experience >= 0 && !isNaN(experience);
};

/**
 * Valida si un cambio de ruta es permitido
 * @param {number} currentLevel - Nivel actual
 * @param {string} currentRoute - Ruta actual
 * @param {string} targetRoute - Ruta objetivo
 * @returns {object} { valid: boolean, reason: string }
 */
export const validateRouteChange = (currentLevel, currentRoute, targetRoute) => {
  if (!isValidRoute(currentRoute)) {
    return { valid: false, reason: 'Ruta actual inválida' };
  }

  if (!isValidRoute(targetRoute)) {
    return { valid: false, reason: 'Ruta objetivo inválida' };
  }

  const routeOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  const currentIndex = routeOrder.indexOf(currentRoute);
  const targetIndex = routeOrder.indexOf(targetRoute);

  if (targetIndex !== currentIndex + 1) {
    return { valid: false, reason: 'Solo puedes avanzar a la siguiente ruta' };
  }

  const completionLevels = { beginner: 10, intermediate: 20, advanced: 25 };
  const requiredLevel = completionLevels[currentRoute];

  if (currentLevel < requiredLevel) {
    return { 
      valid: false, 
      reason: `Debes alcanzar nivel ${requiredLevel} para cambiar de ruta` 
    };
  }

  return { valid: true, reason: '' };
};

/**
 * Valida datos de progreso de nivel
 * @param {object} levelProgress - Objeto de progreso
 * @returns {object} { valid: boolean, errors: string[] }
 */
export const validateLevelProgress = (levelProgress) => {
  const errors = [];

  if (!levelProgress) {
    errors.push('levelProgress es requerido');
    return { valid: false, errors };
  }

  if (!isValidRoute(levelProgress.currentRoute)) {
    errors.push('currentRoute inválida');
  }

  if (!Array.isArray(levelProgress.unlockedFeatures)) {
    errors.push('unlockedFeatures debe ser un array');
  }

  if (!Array.isArray(levelProgress.levelHistory)) {
    errors.push('levelHistory debe ser un array');
  }

  if (typeof levelProgress.routeChangeAvailable !== 'boolean') {
    errors.push('routeChangeAvailable debe ser boolean');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Valida resultados de test de evaluación
 * @param {object} testResults - Resultados del test
 * @returns {object} { valid: boolean, errors: string[] }
 */
export const validateTestResults = (testResults) => {
  const errors = [];

  if (!testResults) {
    errors.push('testResults es requerido');
    return { valid: false, errors };
  }

  if (typeof testResults.score !== 'number') {
    errors.push('score debe ser un número');
  } else if (testResults.score < 0 || testResults.score > 100) {
    errors.push('score debe estar entre 0 y 100');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Sanitiza experiencia para evitar valores inválidos
 * @param {number} experience - Experiencia a sanitizar
 * @returns {number} Experiencia sanitizada
 */
export const sanitizeExperience = (experience) => {
  if (!isValidExperience(experience)) {
    return 0;
  }
  return Math.max(0, Math.floor(experience));
};

/**
 * Sanitiza nivel para evitar valores inválidos
 * @param {number} level - Nivel a sanitizar
 * @returns {number} Nivel sanitizado
 */
export const sanitizeLevel = (level) => {
  if (typeof level !== 'number' || isNaN(level)) {
    return 1;
  }
  return Math.max(1, Math.min(30, Math.floor(level)));
};
