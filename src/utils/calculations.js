/**
 * Calcula el nivel basado en la experiencia
 * @param {number} experience - Experiencia total
 * @returns {number} Nivel calculado
 */
export const calculateLevel = (experience) => {
  // Fórmula: nivel = floor(sqrt(experience / 100))
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

/**
 * Calcula la experiencia necesaria para el siguiente nivel
 * @param {number} currentLevel - Nivel actual
 * @returns {number} Experiencia necesaria
 */
export const calculateExperienceForNextLevel = (currentLevel) => {
  // Fórmula inversa: exp = (nivel^2) * 100
  return Math.pow(currentLevel, 2) * 100;
};

/**
 * Calcula el progreso hacia el siguiente nivel
 * @param {number} currentExp - Experiencia actual
 * @param {number} currentLevel - Nivel actual
 * @returns {number} Porcentaje de progreso (0-100)
 */
export const calculateProgress = (currentExp, currentLevel) => {
  const currentLevelExp = calculateExperienceForNextLevel(currentLevel - 1);
  const nextLevelExp = calculateExperienceForNextLevel(currentLevel);
  const expInLevel = currentExp - currentLevelExp;
  const expNeeded = nextLevelExp - currentLevelExp;
  return Math.min(100, Math.max(0, (expInLevel / expNeeded) * 100));
};
