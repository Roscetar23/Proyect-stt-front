/**
 * Constantes del sistema de gamificación
 */

// Pilares del sistema
export const PILLARS = {
  NUTRITION: 'nutrition',
  SLEEP: 'sleep',
  MOVEMENT: 'movement'
};

// Categorías de logros
export const ACHIEVEMENT_CATEGORIES = {
  STREAK: 'streak',
  LEVEL: 'level',
  PILLAR: 'pillar',
  SPECIAL: 'special'
};

// Rutas de nivel
export const LEVEL_ROUTES = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Experiencia por actividad
export const EXPERIENCE_REWARDS = {
  PILLAR_COMPLETED: 50,
  STREAK_MILESTONE: 100,
  ACHIEVEMENT_UNLOCKED: 75
};

/**
 * Configuración de API
 * 
 * IMPORTANTE - Configurar el comportamiento de la API:
 * 
 * USE_MOCK (boolean):
 * - true: Usa Mock API Service con datos locales (ideal para desarrollo)
 * - false: Prepara para usar API real (requiere implementar realAPI.js)
 * 
 * MOCK_DELAY (number):
 * - Milisegundos de delay simulado para Mock API
 * - Simula latencia de red realista
 * - Ajustar según necesidades de testing (500ms es un valor típico)
 * 
 * BASE_URL (string):
 * - URL base del backend real
 * - En desarrollo (__DEV__ = true): apunta a localhost:3000
 * - En producción (__DEV__ = false): apunta a servidor de producción
 * - Cambiar estas URLs según tu configuración de backend
 * 
 * Ejemplo de uso en código:
 * ```javascript
 * import { API_CONFIG } from './utils/constants';
 * 
 * const apiService = API_CONFIG.USE_MOCK 
 *   ? require('./services/mockAPI').default
 *   : require('./services/realAPI').default;
 * ```
 */
export const API_CONFIG = {
  USE_MOCK: true,              // Cambiar a false cuando el backend real esté disponible
  MOCK_DELAY: 500,             // Ajustar delay de simulación (en ms)
  BASE_URL: (typeof __DEV__ !== 'undefined' && __DEV__)
    ? 'http://localhost:3000/api'           // URL de desarrollo local
    : 'https://api.production.com'          // URL de producción (cambiar por tu dominio)
};

// Claves de almacenamiento
export const STORAGE_KEYS = {
  GAME_STATE: 'game-storage',
  USER_PREFERENCES: 'user-preferences',
  ONBOARDING_COMPLETED: 'onboarding-completed'
};
