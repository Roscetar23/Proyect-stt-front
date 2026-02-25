# Implementation Plan: Sistema de Rachas

## Overview

Este plan descompone la implementación del Sistema de Rachas en tareas ejecutables. El enfoque es incremental: primero implementamos el StreakManager con sus estrategias de rotación, luego los componentes de UI, después las pantallas, y finalmente validamos todo el sistema con tests.

El plan incluye property-based tests para validar propiedades universales y unit tests para casos específicos. Las tareas de testing están marcadas como opcionales (*) para permitir un MVP más rápido.

Esta fase construye sobre la infraestructura de Phase 1 (setup-inicial): Zustand Store, Mock API, Storage Service, y utilidades.

## Tasks

- [-] 1. Implementar StreakManager Module
  - [x] 1.1 Crear estructura del módulo streakManager
    - Crear carpeta src/modules/streakManager/
    - Crear index.js con clase StreakManager
    - Crear strategies.js para estrategias de rotación
    - Crear validators.js para funciones de validación
    - Exportar StreakManager como singleton
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
    
  
  - [x] 1.2 Implementar calculateCurrentStreak
    - Implementar lógica para contar días consecutivos completados
    - Manejar caso de historial vacío (retornar 0)
    - Ordenar historial por fecha descendente
    - Detectar gaps en días consecutivos
    - Validar entradas del historial antes de procesar
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 1.3 Implementar isStreakActive
    - Calcular diferencia en horas entre última completación y ahora
    - Retornar true si diferencia <= 24 horas
    - Retornar false si no hay última completación
    - Manejar casos edge (fechas inválidas)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 1.4 Implementar validateCompletion
    - Verificar que pilar completado coincide con Daily_Pillar
    - Retornar false si no hay Daily_Pillar asignado
    - Validar que pilar es uno de los 3 válidos
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 1.5 Implementar rotatePillar
    - Soportar rotación manual con pilar seleccionado
    - Soportar rotación automática con estrategia
    - Generar objeto Daily_Pillar con fecha actual
    - Incluir target basado en tipo de pilar
    - Marcar isManuallySet correctamente
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.5_
  
  - [ ]* 1.6 Escribir property test para Streak Calculation Monotonicity
    - **Property 1: Streak Calculation Monotonicity**
    - **Validates: Requirements 1.1, 1.2**
    - Generar historiales aleatorios
    - Añadir día consecutivo completado
    - Verificar que streak incrementa en 1
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 1.7 Escribir property test para Streak Reset on Gap
    - **Property 2: Streak Reset on Gap**
    - **Validates: Requirements 1.3**
    - Generar historiales con gaps
    - Verificar que streak resetea correctamente
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 1.8 Escribir property test para Streak Active Within 24 Hours
    - **Property 3: Streak Active Within 24 Hours**
    - **Validates: Requirements 2.1, 2.2**
    - Generar fechas aleatorias dentro y fuera de 24h
    - Verificar isStreakActive retorna valor correcto
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 1.9 Escribir unit tests para StreakManager
    - Test calculateCurrentStreak con 3 días consecutivos
    - Test calculateCurrentStreak con gap (debe resetear)
    - Test calculateCurrentStreak con historial vacío (debe retornar 0)
    - Test isStreakActive con última completación hace 12 horas (true)
    - Test isStreakActive con última completación hace 30 horas (false)
    - Test validateCompletion con pilar correcto (true)
    - Test validateCompletion con pilar incorrecto (false)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 6.1, 6.3_


- [ ] 2. Implementar Rotation Strategies
  - [x] 2.1 Implementar roundRobinStrategy
    - Definir secuencia: nutrition → sleep → movement
    - Obtener último pilar del historial
    - Calcular siguiente pilar en secuencia
    - Manejar caso de historial vacío (retornar nutrition)
    - _Requirements: 3.5, 5.1_
  
  - [x] 2.2 Implementar statsBasedStrategy
    - Obtener estadísticas de usuario por pilar
    - Encontrar pilar con menor valor de stat
    - Fallback a round-robin si no hay stats
    - _Requirements: 5.2_
  
  - [x] 2.3 Implementar weightedRandomStrategy
    - Calcular pesos basados en inverso de stats
    - Implementar selección aleatoria ponderada
    - Fallback a round-robin si no hay stats
    - _Requirements: 5.3_
  
  - [x] 2.4 Implementar getRotationStrategy en StreakManager
    - Retornar función de estrategia por nombre
    - Fallback a round-robin si estrategia no existe
    - _Requirements: 5.4_
  
  - [ ]* 2.5 Escribir property test para Round-Robin Rotation Sequence
    - **Property 4: Round-Robin Rotation Sequence**
    - **Validates: Requirements 3.5, 5.1**
    - Generar secuencia de rotaciones
    - Verificar orden: nutrition → sleep → movement → nutrition
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 2.6 Escribir property test para Pillar Distribution Fairness
    - **Property 5: Pillar Distribution Fairness**
    - **Validates: Requirements 5.5**
    - Simular 21 días de rotaciones
    - Verificar que cada pilar aparece al menos 3 veces
    - Probar con todas las estrategias
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 2.7 Escribir property test para Stats-Based Strategy Prioritization
    - **Property 10: Stats-Based Strategy Prioritization**
    - **Validates: Requirements 5.2**
    - Generar stats aleatorios
    - Verificar que selecciona pilar con menor stat
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 2.8 Escribir property test para Weighted Random Distribution
    - **Property 11: Weighted Random Distribution**
    - **Validates: Requirements 5.3**
    - Generar stats aleatorios
    - Ejecutar 1000 rotaciones
    - Verificar que pilares con menor stat aparecen más frecuentemente
    - Ejecutar mínimo 10 iteraciones (cada una con 1000 rotaciones)
  
  - [ ]* 2.9 Escribir unit tests para strategies
    - Test roundRobinStrategy con último pilar nutrition (debe retornar sleep)
    - Test roundRobinStrategy con último pilar movement (debe retornar nutrition)
    - Test roundRobinStrategy con historial vacío (debe retornar nutrition)
    - Test statsBasedStrategy con stats {nutrition: 50, sleep: 30, movement: 70} (debe retornar sleep)
    - Test weightedRandomStrategy retorna uno de los 3 pilares válidos
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 3. Checkpoint - Validar StreakManager y Strategies
  - Ejecutar tests de StreakManager
  - Ejecutar tests de strategies
  - Verificar que todas las estrategias funcionan correctamente
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implementar Streak Components
  - [x] 4.1 Crear StreakCounter component
    - Crear src/components/streak/StreakCounter.js
    - Leer currentStreak desde useGameStore
    - Mostrar número con emoji de fuego 🔥
    - Soportar tamaños: small, medium, large
    - Aceptar prop style para personalización
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 4.2 Crear PillarCard component
    - Crear src/components/streak/PillarCard.js
    - Leer dailyPillar desde useGameStore
    - Mostrar nombre, icono y color según pilar
    - Mostrar objetivo y progreso con barra visual
    - Implementar botón "Marcar como Completado"
    - Deshabilitar botón si progreso < 100%
    - Mostrar badge de completado si completed = true
    - Invocar callback onComplete cuando se completa
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [x] 4.3 Crear StreakCalendar component
    - Crear src/components/streak/StreakCalendar.js
    - Generar últimos N días (default 30)
    - Leer pillarHistory desde useGameStore
    - Marcar días completados con color verde
    - Marcar días no completados con color gris
    - Mostrar icono de pilar en días completados
    - Implementar modal con detalles al tocar un día
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 4.4 Crear StreakStats component
    - Crear src/components/streak/StreakStats.js
    - Leer user y pillarHistory desde useGameStore
    - Mostrar racha actual y racha más larga
    - Calcular y mostrar tasa de completación
    - Contar completaciones por pilar
    - Actualizar automáticamente cuando cambian datos
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [x] 4.5 Crear components/streak/index.js
    - Exportar StreakCounter, PillarCard, StreakCalendar, StreakStats
    - _Requirements: 7.5, 9.6, 8.5, 10.5_
  
  - [ ]* 4.6 Escribir unit tests para StreakCounter
    - Test que muestra currentStreak correctamente
    - Test que muestra emoji de fuego
    - Test que muestra "0 🔥" cuando streak es 0
    - Test que soporta diferentes tamaños
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ]* 4.7 Escribir unit tests para PillarCard
    - Test que muestra nombre e icono del pilar
    - Test que muestra objetivo y progreso
    - Test que deshabilita botón cuando progreso < 100%
    - Test que muestra badge cuando completed = true
    - Test que invoca onComplete cuando se completa
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ]* 4.8 Escribir unit tests para StreakCalendar
    - Test que genera 30 días por defecto
    - Test que marca días completados con color verde
    - Test que muestra icono de pilar en días completados
    - Test que abre modal al tocar un día
    - _Requirements: 8.1, 8.2, 8.4, 8.5_
  
  - [ ]* 4.9 Escribir unit tests para StreakStats
    - Test que muestra racha actual y más larga
    - Test que calcula tasa de completación correctamente
    - Test que cuenta completaciones por pilar
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 5. Implementar Custom Hooks
  - [x] 5.1 Crear useStreak hook
    - Crear src/hooks/useStreak.js
    - Leer user, streak, dailyPillar desde useGameStore
    - Obtener acciones updateStreak y rotatePillar
    - Calcular isActive usando streakManager.isStreakActive
    - Implementar completePillar que valida y actualiza
    - Implementar selectPillar para selección manual
    - Retornar objeto con currentStreak, longestStreak, isActive, dailyPillar, pillarHistory, completePillar, selectPillar
    - _Requirements: 1.1, 2.1, 4.1, 6.1, 14.1, 14.2, 14.3, 14.4_
  
  - [x] 5.2 Crear usePillarRotation hook
    - Crear src/hooks/usePillarRotation.js
    - Leer dailyPillar desde useGameStore
    - Obtener acción rotatePillar
    - Verificar si dailyPillar.date es hoy usando isToday
    - Si no es hoy, invocar rotatePillar(false) automáticamente
    - Configurar interval para verificar cada minuto
    - Limpiar interval en cleanup
    - Retornar dailyPillar y needsRotation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 5.3 Crear hooks/index.js
    - Exportar useStreak y usePillarRotation
  
  - [ ]* 5.4 Escribir unit tests para useStreak
    - Test que retorna currentStreak y longestStreak
    - Test que completePillar valida pilar correcto
    - Test que completePillar rechaza pilar incorrecto
    - Test que selectPillar actualiza dailyPillar
    - _Requirements: 1.1, 4.1, 6.1, 6.3_
  
  - [ ]* 5.5 Escribir unit tests para usePillarRotation
    - Test que rota pilar si dailyPillar.date no es hoy
    - Test que no rota si dailyPillar.date es hoy
    - Test que verifica rotación cada minuto
    - _Requirements: 3.1, 3.2_

- [x] 6. Checkpoint - Validar Components y Hooks
  - Ejecutar tests de componentes
  - Ejecutar tests de hooks
  - Verificar que componentes renderizan correctamente
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implementar Screens
  - [x] 7.1 Crear StreakHomeScreen
    - Crear src/screens/StreakHomeScreen.js
    - Usar usePillarRotation para auto-rotación
    - Usar useStreak para datos de racha
    - Mostrar StreakCounter en header
    - Mostrar PillarCard con callback onComplete
    - Mostrar StreakStats
    - Implementar animación de celebración con Animated
    - Incluir botones para navegar a StreakHistory y PillarSelection
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 15.1, 15.2, 15.4_
  
  - [x] 7.2 Crear StreakHistoryScreen
    - Crear src/screens/StreakHistoryScreen.js
    - Usar useStreak para obtener pillarHistory
    - Mostrar StreakCalendar con últimos 30 días
    - Mostrar StreakStats
    - Mostrar resumen de días totales y completados
    - _Requirements: 12.1, 12.2, 12.3, 12.5_
  
  - [x] 7.3 Crear PillarSelectionScreen
    - Crear src/screens/PillarSelectionScreen.js
    - Usar useStreak para obtener dailyPillar y selectPillar
    - Mostrar 3 pilares como opciones seleccionables
    - Indicar visualmente el pilar actual con badge
    - Mostrar descripción de cada pilar
    - Deshabilitar selección si pilar ya está completado
    - Mostrar alerta al seleccionar pilar
    - Navegar de regreso después de selección
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [x] 7.4 Actualizar screens/index.js
    - Exportar StreakHomeScreen, StreakHistoryScreen, PillarSelectionScreen
  
  - [ ]* 7.5 Escribir unit tests para StreakHomeScreen
    - Test que muestra StreakCounter
    - Test que muestra PillarCard
    - Test que muestra StreakStats
    - Test que navega a StreakHistory al presionar botón
    - Test que navega a PillarSelection al presionar botón
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 7.6 Escribir unit tests para StreakHistoryScreen
    - Test que muestra StreakCalendar
    - Test que muestra StreakStats
    - Test que muestra resumen de días
    - _Requirements: 12.1, 12.3, 12.5_
  
  - [ ]* 7.7 Escribir unit tests para PillarSelectionScreen
    - Test que muestra 3 pilares
    - Test que indica pilar actual con badge
    - Test que deshabilita selección si pilar completado
    - Test que muestra alerta al seleccionar
    - _Requirements: 13.1, 13.2, 13.6_

- [x] 8. Integración con Zustand Store
  - [x] 8.1 Actualizar gameStore con lógica de rachas
    - Actualizar updateStreak para usar StreakManager
    - Actualizar rotatePillar para usar StreakManager
    - Añadir lógica para actualizar longestStreak
    - Añadir lógica para registrar en pillarHistory
    - Invocar addExperience cuando se completa pilar
    - _Requirements: 1.5, 6.4, 14.1, 14.2, 14.3, 14.5, 15.5, 17.2_
  
  - [ ]* 8.2 Escribir property test para Manual Selection Override
    - **Property 6: Manual Selection Override**
    - **Validates: Requirements 4.2, 4.5**
    - Generar pilares aleatorios
    - Invocar rotatePillar con manual=true
    - Verificar que dailyPillar se actualiza inmediatamente
    - Verificar que isManuallySet = true
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 8.3 Escribir property test para Completion Validation Consistency
    - **Property 7: Completion Validation Consistency**
    - **Validates: Requirements 6.1, 6.3**
    - Generar pilares aleatorios
    - Verificar que validación es determinística
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 8.4 Escribir property test para Longest Streak Update
    - **Property 9: Longest Streak Update**
    - **Validates: Requirements 1.5**
    - Generar rachas aleatorias
    - Verificar que longestStreak se actualiza cuando currentStreak la supera
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 8.5 Escribir property test para Completion Triggers Experience Gain
    - **Property 12: Completion Triggers Experience Gain**
    - **Validates: Requirements 15.5**
    - Completar pilar
    - Verificar que addExperience fue invocado
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 8.6 Escribir unit tests para store integration
    - Test que updateStreak incrementa currentStreak
    - Test que updateStreak actualiza longestStreak si necesario
    - Test que updateStreak añade entrada a pillarHistory
    - Test que updateStreak invoca addExperience
    - Test que rotatePillar actualiza dailyPillar
    - Test que rotatePillar manual marca isManuallySet = true
    - _Requirements: 1.2, 1.5, 6.4, 14.2, 14.3, 15.5, 17.2_

- [x] 9. Checkpoint - Validar Integración Completa
  - Ejecutar tests de integración con store
  - Verificar que todas las pantallas funcionan
  - Verificar que la rotación automática funciona
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implementar Feedback y Notificaciones
  - [x] 10.1 Implementar feedback de completación
    - Añadir animación de celebración en StreakHomeScreen
    - Mostrar mensaje de felicitación personalizado
    - Detectar hitos (7, 30, 100 días) y mostrar mensaje especial
    - Animar actualización de StreakCounter
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  
  - [x] 10.2 Implementar notificación de racha en riesgo
    - Calcular tiempo restante hasta medianoche
    - Mostrar advertencia si faltan < 6 horas y pilar no completado
    - Indicar visualmente que racha está en riesgo
    - Mostrar mensaje motivacional cuando racha se pierde
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_
  
  - [ ]* 10.3 Escribir unit tests para feedback
    - Test que muestra animación al completar
    - Test que detecta hitos correctamente
    - Test que muestra mensaje especial en hitos
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ]* 10.4 Escribir unit tests para notificaciones
    - Test que calcula tiempo restante correctamente
    - Test que muestra advertencia cuando faltan < 6 horas
    - Test que no muestra advertencia si pilar completado
    - _Requirements: 16.1, 16.2, 16.3_

- [x] 11. Validación Final y Testing
  - [x] 11.1 Crear test de integración streakFlow.test.js
    - Test flujo completo: ver racha → completar pilar → ver historial
    - Test flujo de selección manual: cambiar pilar → completar → verificar racha
    - Test flujo de rotación automática: esperar medianoche → verificar nuevo pilar
    - Test que pillarHistory se mantiene por 90 días
    - _Requirements: 11.1, 11.6, 13.1, 13.3, 17.4_
  
  - [ ]* 11.2 Escribir property test para Pillar History Immutability
    - **Property 8: Pillar History Immutability**
    - **Validates: Requirements 6.4, 17.2**
    - Añadir entradas al historial
    - Verificar que entradas existentes no cambian
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 11.3 Escribir property test para Calendar Day Uniqueness
    - **Property 13: Calendar Day Uniqueness**
    - **Validates: Requirements 8.1**
    - Generar calendario de 30 días
    - Verificar que cada día aparece exactamente una vez
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 11.4 Escribir property test para Pillar History Retention
    - **Property 14: Pillar History Retention**
    - **Validates: Requirements 17.4**
    - Generar entradas con fechas aleatorias
    - Verificar que entradas < 90 días se mantienen
    - Ejecutar mínimo 100 iteraciones
  
  - [x] 11.5 Verificar cobertura de tests
    - Ejecutar jest --coverage
    - Verificar que cobertura >= 80%
    - Identificar áreas sin cobertura
  
  - [x] 11.6 Documentar uso del sistema
    - Añadir comentarios JSDoc a StreakManager
    - Añadir comentarios JSDoc a strategies
    - Documentar props de componentes
    - Documentar hooks

- [x] 12. Checkpoint Final - Sistema de Rachas Completo
  - Ejecutar todos los tests (unit, properties, integration)
  - Verificar que todas las pantallas funcionan correctamente
  - Verificar que rotación automática funciona a medianoche
  - Verificar que selección manual funciona
  - Verificar que historial se persiste correctamente
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos que implementa
- Los property tests requieren fast-check y deben ejecutar mínimo 100 iteraciones
- Los checkpoints aseguran validación incremental del progreso
- La estructura sigue el patrón: módulo core → estrategias → componentes → hooks → pantallas → integración → validación
- Todos los archivos deben usar JavaScript (React Native/Expo)
- El sistema se integra con el Zustand Store existente de Phase 1
- La persistencia usa AsyncStorage a través del middleware de Zustand (ya configurado en Phase 1)
- Las animaciones usan Animated API de React Native
- La navegación asume React Navigation (configurado en proyecto base)

## Dependencies on Phase 1

Este sistema depende de la infraestructura establecida en Phase 1 (setup-inicial):

- **Zustand Store**: useGameStore con acciones updateStreak, rotatePillar, addExperience
- **Storage Service**: Para persistencia automática vía middleware
- **Date Utilities**: getCurrentDate, isToday, isSameDay, getDaysDifference
- **Calculation Utilities**: calculateLevel, calculateExperience
- **Constants**: PILLARS, EXPERIENCE_REWARDS
- **Mock API**: Para futuras integraciones con backend
- **Project Structure**: Carpetas components/, screens/, hooks/, modules/ ya creadas

Asegurarse de que Phase 1 está completa antes de comenzar Phase 2.
