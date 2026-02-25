# Bugfix: Inicialización de Racha con pillarHistory

## Problema Reportado

El usuario reporta que tiene una racha de 7 días al inicio, pero cuando completa una actividad, la racha se reinicia a 1.

## Causa del Bug

En `App.js`, cuando se inicializa el estado del usuario, se estaba configurando `streak.currentCount = 7` pero **NO** se estaba inicializando `streak.pillarHistory` con los 7 días de historial correspondientes.

### Flujo del Bug

1. Usuario inicia la app con `currentStreak = 7`
2. `pillarHistory` se inicializa como `[]` (vacío)
3. Usuario completa el primer pilar
4. Se agrega una entrada al `pillarHistory` (que estaba vacío)
5. `calculateCurrentStreak` cuenta solo esa entrada
6. **Resultado:** racha = 1 (en lugar de 8)

## Solución Implementada

### Cambios en `App.js`

Se agregó una función `generateMockPillarHistory` que genera datos mock de historial para los días de racha que tiene el usuario:

```javascript
// Generate mock pillar history for the last N days
const generateMockPillarHistory = (days) => {
  const history = [];
  const pillars = ['nutrition', 'sleep', 'movement'];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    history.push({
      date: date.toISOString(),
      pillar: pillars[i % 3], // Rotate through pillars
      completed: true,
      metrics: {
        progress: 1,
        target: { type: 'default', value: 1, unit: 'completion' }
      }
    });
  }
  
  return history;
};

const mockHistory = generateMockPillarHistory(userData.currentStreak);

useGameStore.setState({
  achievements: achievementsWithStatus,
  streak: {
    currentCount: userData.currentStreak,
    lastCompletedDate: new Date().toISOString(),
    pillarHistory: mockHistory  // ✅ Agregar historial mock
  },
  // ...
});
```

### Características de la Solución

1. **Genera historial retroactivo:** Crea entradas de historial para los últimos N días (donde N = racha actual)
2. **Fechas consecutivas:** Las fechas son consecutivas, retrocediendo desde hoy
3. **Rotación de pilares:** Alterna entre nutrition, sleep y movement
4. **Datos completos:** Cada entrada incluye fecha, pilar, estado completado y métricas

## Resultado Esperado

Ahora cuando el usuario completa un pilar:
- La racha debe **incrementarse** de 7 a 8
- **NO** debe reiniciarse a 1

## Tests Implementados

Se creó `__tests__/bugfix/streakInitialization.test.js` con 3 tests:

1. ✅ `pillarHistory debe inicializarse con 7 días cuando currentStreak es 7`
2. ✅ `al completar un pilar, la racha debe incrementarse de 7 a 8`
3. ✅ `pillarHistory debe tener fechas consecutivas`

### Resultados de Tests

```
PASS  __tests__/bugfix/streakInitialization.test.js
  Bugfix: Streak Initialization with pillarHistory
    ✓ pillarHistory debe inicializarse con 7 días cuando currentStreak es 7
    ✓ al completar un pilar, la racha debe incrementarse de 7 a 8
    ✓ pillarHistory debe tener fechas consecutivas

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

## Verificación de Regresión

Se ejecutaron los tests existentes para verificar que no se rompió nada:

- ✅ `__tests__/unit/stores/gameStore.integration.test.js` - 8 tests passed
- ✅ `__tests__/integration/streakFlow.test.js` - 13 tests passed

## Archivos Modificados

- `App.js` - Agregada función `generateMockPillarHistory` y modificada inicialización del estado
- `__tests__/bugfix/streakInitialization.test.js` - Nuevo archivo de tests

## Notas Técnicas

- La función `generateMockPillarHistory` es una solución temporal para desarrollo/testing
- En producción, el `pillarHistory` debería venir del backend con datos reales
- La solución mantiene compatibilidad con el sistema de cálculo de rachas existente
