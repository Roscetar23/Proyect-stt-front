import { mockUsers, mockAchievements, mockRoutes } from '../data';

/**
 * Mock API Service
 * 
 * Este servicio simula un backend real con datos locales para desarrollo.
 * Incluye latencia de red simulada para testing realista.
 * 
 * CONFIGURACIÓN - Cambiar entre Mock y API Real:
 * 
 * Para usar este servicio mock (modo desarrollo):
 * - Mantener las importaciones actuales
 * - El servicio retorna datos desde ../data/
 * 
 * Para cambiar a API real (modo producción):
 * 1. Crear un nuevo archivo realAPI.js con la misma interfaz
 * 2. Implementar llamadas HTTP reales (fetch/axios) a API_CONFIG.BASE_URL
 * 3. En el código que usa la API, cambiar:
 *    import mockAPI from './services/mockAPI'  →  import realAPI from './services/realAPI'
 * 
 * Alternativamente, usar un patrón de factory:
 * - Crear apiFactory.js que retorna mockAPI o realAPI según API_CONFIG.USE_MOCK
 * - Importar desde apiFactory en lugar de directamente
 * 
 * Ver utils/constants.js para configurar API_CONFIG.USE_MOCK y API_CONFIG.BASE_URL
 */
class MockAPIService {
  constructor() {
    this.delay = 500; // ms - simular latencia de red
  }
  
  /**
   * Simula delay de red
   * @private
   * @returns {Promise<void>}
   */
  _simulateDelay() {
    return new Promise(resolve => 
      setTimeout(resolve, this.delay)
    );
  }
  
  /**
   * Obtiene datos del usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   * @throws {Error} Si el usuario no existe
   */
  async getUserData(userId) {
    await this._simulateDelay();
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    return { ...user }; // Return copy to avoid mutations
  }
  
  /**
   * Actualiza la racha del usuario
   * @param {string} userId - ID del usuario
   * @param {Object} pillarData - Datos del pilar completado
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateStreak(userId, pillarData) {
    await this._simulateDelay();
    
    // Simular actualización exitosa
    return {
      success: true,
      streak: {
        currentCount: (pillarData.currentCount || 0) + 1,
        lastCompletedDate: new Date().toISOString()
      }
    };
  }
  
  /**
   * Obtiene todos los logros disponibles
   * @param {string} userId - ID del usuario (para futuras personalizaciones)
   * @returns {Promise<Array>} Lista de logros
   */
  async getAchievements(userId) {
    await this._simulateDelay();
    
    return [...mockAchievements]; // Return copy
  }
  
  /**
   * Obtiene todas las rutas de nivel disponibles
   * @returns {Promise<Array>} Lista de rutas
   */
  async getLevelRoutes() {
    await this._simulateDelay();
    
    return [...mockRoutes]; // Return copy
  }
}

// Singleton pattern - exportar instancia única
export default new MockAPIService();
