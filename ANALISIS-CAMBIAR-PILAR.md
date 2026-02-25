# Análisis: Problema con Botón "Cambiar Pilar"

## Problema Reportado

El usuario reporta que el botón "Cambiar Pilar" no funciona y ve el siguiente log:

```
gameStore.js:118 ✅ Daily pillar is already current, skipping rotation
```

## Análisis del Código

### Flujo Esperado

1. **PillarSelectionScreen.handleSelect(pillarId)**
   - Log: `🔍 [PillarSelection] Selecting pillar: {pillarId}`
   - Llama a `selectPillar(pillarId)`

2. **useStreak.selectPillar(pillar)**
   - Log: `🔍 [useStreak] Calling rotatePillar with manual=true, pillar: {pillar}`
   - Llama a `rotatePillar(true, pillar)`

3. **gameStore.rotatePillar(manual, selectedPillar, strategy)**
   - Log: `🔍 [gameStore] rotatePillar called with: { manual, selectedPillar, strategy }`
   - Ejecuta la rotación

### Validaciones en rotatePillar

El código tiene 3 validaciones que **solo se ejecutan cuando `manual=false`**:

```javascript
// Validación 1: Prevenir rotaciones duplicadas el mismo día
if (!manual && lastRotationCheck === currentDateString) {
  console.log('⏭️ Rotation already performed today, skipping');
  return;
}

// Validación 2: No auto-rotar si el pilar fue seleccionado manualmente hoy
if (!manual && dailyPillar?.isManuallySet) {
  const pillarDateString = new Date(dailyPillar.date).toISOString().split('T')[0];
  if (pillarDateString === currentDateString) {
    console.log('🚫 Pillar was manually set today, skipping auto-rotation');
    set({ lastRotationCheck: currentDateString });
    return;
  }
}

// Validación 3: No rotar si el pilar ya es del día actual
if (!manual && dailyPillar) {
  const pillarDateString = new Date(dailyPillar.date).toISOString().split('T')[0];
  if (pillarDateString === currentDateString) {
    console.log('✅ Daily pillar is already current, skipping rotation');
    set({ lastRotationCheck: currentDateString });
    return;
  }
}
```

## Hallazgos

### ✅ Tests Unitarios Pasan

Todos los tests confirman que:
- `rotatePillar(true, pillar)` funciona correctamente
- El parámetro `manual=true` se pasa correctamente
- Las validaciones se saltan cuando `manual=true`
- El pilar se cambia exitosamente

### ❌ El Log Indica `manual=false`

El log `"✅ Daily pillar is already current, skipping rotation"` **solo puede aparecer si `manual=false`**, porque está dentro de un bloque `if (!manual && ...)`.

## Hipótesis

### Hipótesis 1: Problema de Timing con usePillarRotation

El hook `usePillarRotation` se ejecuta en `StreakHomeScreen` y llama a `rotatePillar(false)` cada minuto. Es posible que:

1. Usuario selecciona pilar manualmente → `rotatePillar(true, 'sleep')`
2. Usuario regresa a StreakHomeScreen
3. `usePillarRotation` se ejecuta inmediatamente → `rotatePillar(false)`
4. La rotación automática sobrescribe o interfiere con la manual

**Protección existente:** El código tiene una protección para esto:
```javascript
if (!manual && dailyPillar?.isManuallySet) {
  // Skip auto-rotation
}
```

Pero esta protección solo funciona si `isManuallySet=true` se guardó correctamente.

### Hipótesis 2: El Parámetro No Llega Correctamente en React Native

Es posible que haya un problema específico de React Native donde:
- El binding de la función `rotatePillar` no preserva los parámetros
- Hay un problema de closure o scope
- La función se está llamando sin parámetros en algún lugar

### Hipótesis 3: Hay Otra Llamada a rotatePillar

Puede haber otro lugar en el código donde se llama a `rotatePillar()` sin parámetros o con `manual=false` cuando el usuario presiona "Cambiar Pilar".

## Logs Agregados

Se agregaron logs detallados en cada paso del flujo:

### PillarSelectionScreen.js
```javascript
console.log('🔍 [PillarSelection] Selecting pillar:', pillarId);
```

### useStreak.js
```javascript
console.log('🔍 [useStreak] Calling rotatePillar with manual=true, pillar:', pillar);
```

### gameStore.js
```javascript
console.log('🔍 [gameStore] rotatePillar called with:', { manual, selectedPillar, strategy });
console.log('🔍 [gameStore] Passed duplicate rotation check. manual:', manual, 'lastRotationCheck:', lastRotationCheck);
console.log('🔍 [gameStore] Passed manual set check. manual:', manual, 'dailyPillar.isManuallySet:', dailyPillar?.isManuallySet);
console.log('🔍 [gameStore] Checking if rotation needed. pillarDate:', pillarDateString, 'currentDate:', currentDateString);
console.log('🔍 [gameStore] All checks passed, proceeding with rotation');
```

## Próximos Pasos

### Para el Usuario

1. **Limpiar caché y reinstalar:**
   ```bash
   # Limpiar caché de Metro
   npx react-native start --reset-cache
   
   # O reinstalar la app
   npm run android  # o npm run ios
   ```

2. **Reproducir el problema y capturar TODOS los logs:**
   - Abrir la app
   - Ir a "Cambiar Pilar"
   - Seleccionar un pilar diferente
   - Capturar TODOS los logs que empiecen con `🔍`

3. **Verificar qué logs aparecen:**
   - ¿Aparece `🔍 [PillarSelection] Selecting pillar:`?
   - ¿Aparece `🔍 [useStreak] Calling rotatePillar with manual=true`?
   - ¿Qué muestra `🔍 [gameStore] rotatePillar called with:`?
   - ¿Cuál es el valor de `manual` en ese log?

### Si `manual=false` en los Logs

Esto indicaría un problema de binding o que hay otra llamada. Soluciones:

1. **Verificar que no hay otras llamadas a rotatePillar:**
   ```bash
   grep -r "rotatePillar(" src/
   ```

2. **Asegurar el binding correcto en useStreak:**
   ```javascript
   const selectPillar = useCallback((pillar) => {
     console.log('🔍 [useStreak] Calling rotatePillar with manual=true, pillar:', pillar);
     rotatePillar(true, pillar);
   }, [rotatePillar]);
   ```

### Si `manual=true` en los Logs

Esto indicaría que el problema está en la lógica de validación. Solución:

1. **Simplificar la validación para rotaciones manuales:**
   ```javascript
   rotatePillar: (manual = false, selectedPillar = null, strategy = 'round-robin') => {
     const { streak, user, dailyPillar, lastRotationCheck } = get();
     
     console.log('🔍 [gameStore] rotatePillar called with:', { manual, selectedPillar, strategy });
     
     // Si es manual, saltar TODAS las validaciones
     if (manual) {
       console.log('🔍 [gameStore] Manual rotation, skipping all validations');
       // Ir directo a la rotación
       const userStats = {
         nutrition: user?.stats?.nutrition || 0,
         sleep: user?.stats?.sleep || 0,
         movement: user?.stats?.movement || 0
       };
       
       const pillarHistory = streak?.pillarHistory || [];
       const newDailyPillar = streakManager.rotatePillar(
         manual,
         selectedPillar,
         strategy,
         userStats,
         pillarHistory
       );
       
       console.log('🔄 Pillar rotated:', newDailyPillar.pillar, '(manual)');
       
       set({
         dailyPillar: newDailyPillar,
         lastRotationCheck: new Date().toISOString().split('T')[0]
       });
       return;
     }
     
     // Resto de validaciones para rotación automática...
   }
   ```

## Recomendación Inmediata

Implementar la simplificación de la lógica para rotaciones manuales (opción 2 arriba), que garantiza que cuando `manual=true`, se saltan TODAS las validaciones y se ejecuta la rotación inmediatamente.

Esto elimina cualquier posibilidad de que una validación interfiera con las rotaciones manuales.
