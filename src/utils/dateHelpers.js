/**
 * Obtiene la fecha actual en formato ISO
 * @returns {string} Fecha actual
 */
export const getCurrentDate = () => {
  return new Date().toISOString();
};

/**
 * Verifica si una fecha es hoy
 * @param {string} dateString - Fecha en formato ISO
 * @returns {boolean}
 */
export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Verifica si dos fechas son el mismo día
 * @param {string} date1 - Primera fecha
 * @param {string} date2 - Segunda fecha
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {string} date1 - Fecha inicial
 * @param {string} date2 - Fecha final
 * @returns {number} Diferencia en días
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
