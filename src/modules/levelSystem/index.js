import { LEVEL_ROUTES } from './routes.js';
import { isValidRoute, isValidExperience } from './validators.js';

/**
 * LevelSystem - Sistema de gestión de niveles y progresión
 * Singleton que encapsula toda la lógica de niveles, experiencia y rutas
 */
class LevelSystem {
  constructor() {
    this.routes = LEVEL_ROUTES;
  }

  /**
   * Calcula el nivel actual basado en experiencia y ruta
   * @param {number} experience - Experiencia total del usuario
   * @param {string} route - Ruta actual (beginner, intermediate, advanced, expert)
   * @returns {number} Nivel actual
   */
  calculateLevel(experience, route = 'beginner') {
    // Validar que la ruta es válida
    if (!isValidRoute(route)) {
      console.warn(`Invalid route: ${route}, defaulting to beginner`);
      route = 'beginner';
    }

    // Validar que la experiencia es válida
    if (!isValidExperience(experience)) {
      console.warn(`Invalid experience: ${experience}, defaulting to 0`);
      experience = 0;
    }

    const routeData = this.routes[route];
    if (!routeData) return 1;

    // Manejar caso de experiencia = 0
    if (experience === 0) return 1;

    // Encuentra el nivel más alto alcanzado
    for (let i = routeData.levels.length - 1; i >= 0; i--) {
      if (experience >= routeData.levels[i].experienceRequired) {
        return routeData.levels[i].level;
      }
    }
    return 1;
  }

  /**
   * Obtiene información detallada de un nivel específico
   * @param {number} level - Número de nivel
   * @param {string} route - Ruta actual
   * @returns {object|null} Información del nivel
   */
  getLevelInfo(level, route = 'beginner') {
    const routeData = this.routes[route];
    if (!routeData) return null;

    return routeData.levels.find(l => l.level === level);
  }

  /**
   * Obtiene la experiencia necesaria para el siguiente nivel
   * @param {number} currentLevel - Nivel actual
   * @param {string} route - Ruta actual
   * @returns {number} Experiencia requerida para siguiente nivel
   */
  getExperienceForNextLevel(currentLevel, route = 'beginner') {
    const routeData = this.routes[route];
    if (!routeData) return 0;

    const nextLevel = routeData.levels.find(l => l.level === currentLevel + 1);
    return nextLevel ? nextLevel.experienceRequired : 0;
  }

  /**
   * Calcula el progreso hacia el siguiente nivel
   * @param {number} currentExp - Experiencia actual
   * @param {number} currentLevel - Nivel actual
   * @param {string} route - Ruta actual
   * @returns {object} { percent, current, needed }
   */
  calculateProgress(currentExp, currentLevel, route = 'beginner') {
    const currentLevelInfo = this.getLevelInfo(currentLevel, route);
    const nextLevelInfo = this.getLevelInfo(currentLevel + 1, route);

    if (!currentLevelInfo || !nextLevelInfo) {
      return { percent: 100, current: 0, needed: 0 };
    }

    const expInLevel = currentExp - currentLevelInfo.experienceRequired;
    const expNeeded = nextLevelInfo.experienceRequired - currentLevelInfo.experienceRequired;
    const percent = Math.min(100, Math.max(0, (expInLevel / expNeeded) * 100));

    return { percent, current: expInLevel, needed: expNeeded };
  }

  /**
   * Obtiene todas las features desbloqueadas hasta el nivel actual
   * @param {number} level - Nivel actual
   * @param {string} route - Ruta actual
   * @returns {string[]} Array de features desbloqueadas
   */
  getUnlockedFeatures(level, route = 'beginner') {
    const routeData = this.routes[route];
    if (!routeData) return [];

    const features = [];
    for (const levelData of routeData.levels) {
      if (levelData.level <= level) {
        features.push(...levelData.unlockedFeatures);
      }
    }
    return features;
  }

  /**
   * Verifica si el usuario puede cambiar de ruta
   * @param {number} currentLevel - Nivel actual
   * @param {string} currentRoute - Ruta actual
   * @param {string} targetRoute - Ruta objetivo
   * @returns {boolean} true si puede cambiar
   */
  canChangeRoute(currentLevel, currentRoute, targetRoute) {
    const routeOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = routeOrder.indexOf(currentRoute);
    const targetIndex = routeOrder.indexOf(targetRoute);

    if (targetIndex !== currentIndex + 1) return false;

    const completionLevels = { beginner: 10, intermediate: 20, advanced: 25 };
    return currentLevel >= completionLevels[currentRoute];
  }

  /**
   * Evalúa el nivel del usuario basado en resultados de test
   * @param {object} testResults - Resultados del test de evaluación
   * @returns {string} Ruta recomendada
   */
  assessUserLevel(testResults) {
    const score = testResults.score || 0;

    if (score < 30) return 'beginner';
    if (score < 60) return 'intermediate';
    if (score < 85) return 'advanced';
    return 'expert';
  }

  /**
   * Obtiene información de una ruta específica
   * @param {string} route - ID de la ruta
   * @returns {object|null} Información de la ruta
   */
  getRouteInfo(route) {
    return this.routes[route] || null;
  }

  /**
   * Obtiene todas las rutas disponibles
   * @returns {object} Todas las rutas
   */
  getAllRoutes() {
    return this.routes;
  }
}

// Exportar como singleton
export default new LevelSystem();
