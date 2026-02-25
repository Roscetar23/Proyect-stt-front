# Bugfix: Botón "Cambiar Pilar" no funcionaba

## Problema Reportado

El usuario reportó que el botón "Cambiar Pilar" no estaba funcionando correctamente:

1. Usuario presiona "Cambiar Pilar"
2. Selecciona un nuevo pilar
3. Confirma la selección
4. Regresa a la pantalla principal
5. **El pilar NO ha cambiado** (sigue mostrando el mismo pilar)

Este problema ocurría tanto si el pilar estaba completado como si estaba incompleto.

## Causa Raíz

El problema estaba en el hook `usePillarRotation` que se ejecuta automáticamente en `StreakHomeScreen`. Este hook:

- Se ejecuta al montar el componente
- Se ejecuta cada 60 segundos (intervalo)
- Llama a `rotatePillar(false)` para rotación automática

**El conflicto:**

Cuando el usuario cambiaba manualmente el pilar:
1. Se creaba un nuevo `dailyPillar` con `isManuallySet: true`
2. El usuario regresaba a `StreakHomeScreen`
3. El hook `usePillarRotation` se ejecutaba (en mount o en el intervalo)
4. Llamaba a `rotatePillar(false)` (automático)
5. **El store NO tenía protección para pilares seleccionados manualmente**
6. La rotación automática podría sobrescribir la selección manual

## Solución Implementada

Se agregó una validación en `gameStore.rotatePillar()` para **proteger las selecciones manuales**:

```javascript
// IMPORTANT: Don't auto-rotate if pillar was manually set today
if (!manual && dailyPillar?.isManuallySet) {
  const pillarDateString = new Date(dailyPillar.date).toISOString().split('T')[0];
  if (pillarDateString === currentDateString) {
    console.log('🚫 Pillar was manually set today, skipping auto-rotation');
    set({ lastRotationCheck: currentDateString });
    return;
  }
}
```

Esta validación:
- Verifica si la rotación es automática (`!manual`)
- Verifica si el pilar actual fue seleccionado manualmente (`isManuallySet: true`)
- Verifica si la selección manual fue hecha hoy
- Si todas las condiciones se cumplen, **bloquea la rotación automática**

## Archivos Modificados

1. **`src/stores/gameStore.js`**
   - Agregada validación para proteger pilares seleccionados manualmente
   - Limpieza de logs de debugging

2. **`src/hooks/useStreak.js`**
   - Limpieza de logs de debugging

3. **`src/screens/PillarSelectionScreen.js`**
   - Limpieza de logs de debugging

4. **`src/components/streak/PillarCard.js`**
   - Limpieza de logs de debugging

## Tests Agregados

### 1. `__tests__/debug/pillarChangeDebug.test.js`
Tests básicos para verificar que el cambio de pilar funciona:
- ✅ Cambio de pilar básico
- ✅ Cambio de pilar con progreso > 0
- ✅ Cambio de pilar cuando está completado
- ✅ Verificación de nueva referencia de objeto

### 2. `__tests__/debug/manualPillarProtection.test.js`
Tests específicos para la protección de selecciones manuales:
- ✅ NO auto-rotar cuando el pilar fue seleccionado manualmente hoy
- ✅ Permitir rotación manual para sobrescribir selección manual previa
- ✅ Permitir auto-rotación en un nuevo día (incluso si el día anterior fue manual)
- ✅ Proteger selección manual de múltiples intentos de auto-rotación

## Resultado

✅ **252 tests pasando**

El botón "Cambiar Pilar" ahora funciona correctamente:
- El usuario puede cambiar el pilar manualmente
- La selección manual se mantiene al regresar a la pantalla principal
- La rotación automática respeta las selecciones manuales del día
- Al día siguiente, la rotación automática funciona normalmente

## Comportamiento Esperado

### Mismo día:
- ✅ Usuario selecciona pilar manualmente → Se guarda con `isManuallySet: true`
- ✅ Usuario regresa a home → `usePillarRotation` intenta auto-rotar
- ✅ Store detecta que fue manual hoy → **Bloquea auto-rotación**
- ✅ Pilar manual se mantiene

### Día siguiente:
- ✅ Nuevo día comienza
- ✅ `usePillarRotation` intenta auto-rotar
- ✅ Store detecta que el pilar es de ayer → **Permite auto-rotación**
- ✅ Nuevo pilar se asigna con `isManuallySet: false`

### Múltiples cambios manuales:
- ✅ Usuario puede cambiar manualmente múltiples veces
- ✅ Cada cambio manual sobrescribe el anterior
- ✅ Todos los cambios manuales están protegidos de auto-rotación
