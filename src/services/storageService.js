import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = '@gamification:';

class StorageService {
  /**
   * Obtiene la clave completa con prefijo
   * @private
   */
  _getFullKey(key) {
    return `${KEY_PREFIX}${key}`;
  }
  
  /**
   * Guarda un item en AsyncStorage
   * @param {string} key - Clave del item
   * @param {any} value - Valor a guardar (será serializado a JSON)
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    try {
      const fullKey = this._getFullKey(key);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(fullKey, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtiene un item de AsyncStorage
   * @param {string} key - Clave del item
   * @returns {Promise<any|null>} Valor deserializado o null si no existe o hay error
   */
  async getItem(key) {
    try {
      const fullKey = this._getFullKey(key);
      const jsonValue = await AsyncStorage.getItem(fullKey);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Elimina un item de AsyncStorage
   * @param {string} key - Clave del item a eliminar
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    try {
      const fullKey = this._getFullKey(key);
      await AsyncStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }
  
  /**
   * Limpia todos los items con el prefijo de la aplicación
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      const keys = await this.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene todas las claves con el prefijo de la aplicación
   * @returns {Promise<string[]>} Array de claves
   */
  async getAllKeys() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter(key => key.startsWith(KEY_PREFIX));
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }
}

// Exportar instancia singleton
export default new StorageService();
