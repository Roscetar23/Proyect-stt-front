# Implementation Plan: Setup Inicial

## Overview

Este plan descompone la implementación del setup inicial del sistema de gamificación en tareas ejecutables. El enfoque es incremental: primero establecemos la estructura base, luego implementamos los servicios core, después el estado global, y finalmente validamos todo el sistema.

El plan incluye property-based tests para validar propiedades universales y unit tests para casos específicos. Las tareas de testing están marcadas como opcionales (*) para permitir un MVP más rápido.

## Tasks

- [x] 1. Configurar dependencias y estructura base del proyecto
  - Instalar dependencias: zustand, @react-native-async-storage/async-storage, expo-notifications, fast-check (dev)
  - Crear estructura de carpetas: src/ con subdirectorios components/, screens/, hooks/, stores/, services/, modules/, utils/, data/
  - Crear subdirectorios en components/: common/, streak/, level/, achievement/
  - Crear archivos index.js en cada directorio para barrel exports
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 6.1, 6.2, 6.3_

- [ ]* 1.1 Validar estructura de carpetas
  - Escribir unit test que verifique existencia de todas las carpetas requeridas
  - Verificar que cada subdirectorio contiene index.js
  - _Requirements: 1.4, 1.5_

- [x] 2. Implementar Storage Service
  - [x] 2.1 Crear storageService.js con clase StorageService
    - Implementar métodos: setItem, getItem, removeItem, clear, getAllKeys
    - Implementar serialización/deserialización JSON
    - Implementar prefijo de claves '@gamification:'
    - Implementar manejo de errores con try/catch y logging
    - Exportar instancia singleton
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ]* 2.2 Escribir property test para Storage Service Round-Trip
    - **Property 1: Storage Service Round-Trip**
    - **Validates: Requirements 4.2, 4.3**
    - Usar fast-check para generar objetos aleatorios
    - Verificar que save + load preserva datos
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 2.3 Escribir property test para Storage Key Prefix
    - **Property 7: Storage Key Prefix Consistency**
    - **Validates: Requirements 4.6**
    - Verificar que todas las claves tienen prefijo '@gamification:'
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 2.4 Escribir unit tests para Storage Service
    - Test de manejo de errores (retorna null en fallo)
    - Test de clear() elimina todas las claves con prefijo
    - Test de getAllKeys() retorna solo claves con prefijo
    - _Requirements: 4.4, 4.5, 4.6_

- [x] 3. Crear datos mock
  - [x] 3.1 Crear mockUsers.js con 2 usuarios de ejemplo
    - Incluir todas las propiedades: id, name, level, experience, currentStreak, longestStreak, selectedRoute, completedAchievements, stats
    - Exportar array mockUsers
    - _Requirements: 5.1, 5.4_
  
  - [x] 3.2 Crear mockAchievements.js con 10+ logros
    - Incluir logros de categorías: streak, level, pillar, special
    - Incluir todas las propiedades: id, title, description, icon, category, requirement, unlockedAt
    - Exportar array mockAchievements
    - _Requirements: 5.2, 5.5_
  
  - [x] 3.3 Crear mockRoutes.js con 4 rutas de nivel
    - Incluir rutas: beginner, intermediate, advanced, expert
    - Cada ruta con niveles y experiencia requerida
    - Exportar array mockRoutes
    - _Requirements: 5.3_
  
  - [x] 3.4 Crear data/index.js para barrel exports
    - Exportar mockUsers, mockAchievements, mockRoutes
    - _Requirements: 5.6_
  
  - [ ]* 3.5 Escribir property test para Mock Users Data Completeness
    - **Property 8: Mock Users Data Completeness**
    - **Validates: Requirements 5.4**
    - Verificar que todos los usuarios tienen propiedades requeridas
  
  - [ ]* 3.6 Escribir property test para Mock Achievements Data Completeness
    - **Property 9: Mock Achievements Data Completeness**
    - **Validates: Requirements 5.5**
    - Verificar que todos los logros tienen propiedades requeridas

- [x] 4. Implementar Mock API Service
  - [x] 4.1 Crear mockAPI.js con clase MockAPIService
    - Implementar patrón Singleton
    - Implementar método _simulateDelay() con 500ms
    - Implementar getUserData(userId) que retorna usuario de mockUsers
    - Implementar updateStreak(userId, pillarData) que simula actualización
    - Implementar getAchievements(userId) que retorna mockAchievements
    - Implementar getLevelRoutes() que retorna mockRoutes
    - Exportar instancia singleton
    - _Requirements: 3.1, 3.2, 3.4, 3.5_
  
  - [ ]* 4.2 Escribir property test para Mock API Delay Consistency
    - **Property 3: Mock API Delay Consistency**
    - **Validates: Requirements 3.1, 3.3**
    - Verificar que delay está en rango esperado (500ms ± 100ms)
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 4.3 Escribir property test para Mock API Singleton
    - **Property 4: Mock API Singleton Guarantee**
    - **Validates: Requirements 3.5**
    - Verificar que múltiples imports retornan misma instancia
  
  - [ ]* 4.4 Escribir property test para Mock API Promise Resolution
    - **Property 5: Mock API Promise Resolution**
    - **Validates: Requirements 3.6**
    - Verificar que todos los métodos retornan Promises válidas
    - Verificar que datos cumplen schema esperado
  
  - [ ]* 4.5 Escribir unit tests para Mock API Service
    - Test getUserData con usuario existente
    - Test getUserData con usuario no existente (debe lanzar error)
    - Test que todos los métodos simulan delay
    - _Requirements: 3.2, 3.3_

- [x] 5. Checkpoint - Validar servicios base
  - Ejecutar tests de Storage Service y Mock API
  - Verificar que datos mock son accesibles
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implementar utilidades
  - [x] 6.1 Crear utils/constants.js
    - Definir constantes: PILLARS, ACHIEVEMENT_CATEGORIES, LEVEL_ROUTES, EXPERIENCE_REWARDS, API_CONFIG, STORAGE_KEYS
    - Exportar todas las constantes
    - _Requirements: 9.3, 8.1, 8.4_
  
  - [x] 6.2 Crear utils/dateHelpers.js
    - Implementar getCurrentDate() con documentación JSDoc
    - Implementar isToday(dateString) con documentación JSDoc
    - Implementar isSameDay(date1, date2) con documentación JSDoc
    - Implementar getDaysDifference(date1, date2) con documentación JSDoc
    - Exportar todas las funciones
    - _Requirements: 9.1, 9.4_
  
  - [x] 6.3 Crear utils/calculations.js
    - Implementar calculateLevel(experience) con documentación JSDoc
    - Implementar calculateExperienceForNextLevel(currentLevel) con documentación JSDoc
    - Implementar calculateProgress(currentExp, currentLevel) con documentación JSDoc
    - Exportar todas las funciones
    - _Requirements: 9.2, 9.4_
  
  - [x] 6.4 Crear utils/index.js para barrel exports
    - Exportar todas las utilidades desde dateHelpers, calculations, constants
    - _Requirements: 9.5_
  
  - [ ]* 6.5 Escribir property test para Utility Exports Accessibility
    - **Property 13: Utility Exports Accessibility**
    - **Validates: Requirements 9.5**
    - Verificar que todas las utilidades son accesibles desde utils/index.js
  
  - [ ]* 6.6 Escribir unit tests para date helpers
    - Test isToday con fecha de hoy
    - Test isToday con fecha de ayer
    - Test isSameDay con fechas iguales y diferentes
    - Test getDaysDifference con casos conocidos
    - _Requirements: 9.1_
  
  - [ ]* 6.7 Escribir unit tests para calculations
    - Test calculateLevel con valores conocidos (0 exp = nivel 1, 100 exp = nivel 2, etc.)
    - Test calculateProgress con casos límite (0%, 50%, 100%)
    - Test calculateExperienceForNextLevel con niveles conocidos
    - _Requirements: 9.2_

- [x] 7. Implementar Zustand Store con persistencia
  - [x] 7.1 Crear stores/gameStore.js
    - Importar create de zustand y persist middleware
    - Definir estado inicial: user (null), streak (null), dailyPillar (null), achievements ([])
    - Implementar acción updateStreak(completed)
    - Implementar acción rotatePillar(manual, selectedPillar)
    - Implementar acción addExperience(amount) usando calculateLevel
    - Implementar acción unlockAchievement(achievementId)
    - Implementar acción initializeUser(userData)
    - Implementar acción resetState()
    - Configurar persist middleware con name 'game-storage' y AsyncStorage
    - Implementar validación de estado en onRehydrateStorage
    - Exportar useGameStore
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 7.2 Crear stores/index.js para barrel export
    - Exportar useGameStore
  
  - [ ]* 7.3 Escribir property test para Zustand Store Persistence Round-Trip
    - **Property 2: Zustand Store Persistence Round-Trip**
    - **Validates: Requirements 7.1, 7.2, 2.3**
    - Generar estados válidos aleatorios
    - Verificar que persist + restore preserva estado
    - Ejecutar mínimo 100 iteraciones
  
  - [ ]* 7.4 Escribir property test para State Restoration Validation
    - **Property 11: State Restoration Validation**
    - **Validates: Requirements 7.5**
    - Verificar que estados inválidos son rechazados
    - Verificar que se usa estado inicial cuando datos son inválidos
  
  - [ ]* 7.5 Escribir unit tests para Game Store
    - Test que store tiene propiedades requeridas (user, streak, dailyPillar, achievements)
    - Test que store tiene acciones requeridas (updateStreak, rotatePillar, addExperience, unlockAchievement)
    - Test estado inicial cuando no hay datos persistidos
    - Test addExperience actualiza nivel correctamente
    - Test unlockAchievement actualiza unlockedAt
    - Test resetState limpia todo el estado
    - _Requirements: 2.1, 2.4, 7.3_

- [x] 8. Checkpoint - Validar integración de store
  - Ejecutar tests de Zustand Store
  - Verificar persistencia en AsyncStorage
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Crear archivos index.js para barrel exports en components y screens
  - Crear components/common/index.js (vacío por ahora)
  - Crear components/streak/index.js (vacío por ahora)
  - Crear components/level/index.js (vacío por ahora)
  - Crear components/achievement/index.js (vacío por ahora)
  - Crear components/index.js que exporta desde subdirectorios
  - Crear screens/index.js (vacío por ahora)
  - Crear hooks/index.js (vacío por ahora)
  - Crear services/index.js que exporta mockAPI y storageService
  - Crear modules/index.js (vacío por ahora)
  - _Requirements: 1.5_

- [ ]* 9.1 Escribir property test para Folder Accessibility
  - **Property 10: Folder Accessibility**
  - **Validates: Requirements 1.4, 1.5**
  - Verificar que todas las carpetas son navegables
  - Verificar que cada subdirectorio tiene index.js

- [x] 10. Validación final del setup
  - [x] 10.1 Crear test de integración setupValidation.test.js
    - Test que puede importar y usar Zustand Store sin errores
    - Test que puede invocar métodos de Mock API y recibir datos
    - Test que puede persistir y recuperar datos con Storage Service
    - Test que puede acceder a Mock Data desde cualquier parte
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 10.2 Documentar configuración en comentarios
    - Agregar comentarios en mockAPI.js explicando cómo cambiar USE_MOCK
    - Agregar comentarios en constants.js explicando API_CONFIG
    - _Requirements: 8.5_
  
  - [x] 10.3 Verificar que la app inicializa sin errores
    - Importar store en App.js
    - Verificar que no hay errores de dependencias
    - _Requirements: 10.5_

- [x] 11. Checkpoint final - Setup completo
  - Ejecutar todos los tests (unit, properties, integration)
  - Verificar cobertura de tests
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos que implementa
- Los property tests requieren fast-check y deben ejecutar mínimo 100 iteraciones
- Los checkpoints aseguran validación incremental del progreso
- La estructura sigue el patrón: servicios base → datos → API mock → utilidades → store → validación
- Todos los archivos deben usar JavaScript (React Native/Expo)
- La persistencia usa AsyncStorage a través del middleware de Zustand
