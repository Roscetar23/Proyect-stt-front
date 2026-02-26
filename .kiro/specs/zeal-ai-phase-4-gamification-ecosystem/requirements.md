# Requirements Document: Zeal AI - Fase 4: Sistema de Gamificación Integral

## Introduction

Zeal AI es el primer ecosistema que gamifica la evolución metabólica y física mediante un "Camino de Progreso Visual" adaptado a disciplinas específicas. La Fase 4 implementa el sistema de gamificación integral que incluye rachas multi-factor, niveles de maestría tipo RPG, sistema de logros y rotación inteligente de pilares (nutrición, sueño, movimiento).

El sistema resuelve tres problemas críticos:
1. **Fricción de Entrada de Datos**: 60% de usuarios abandonan apps de fitness porque registrar actividades toma más de 3 minutos
2. **Rigidez Programática**: Los planes no se adaptan a la vida real (viajes, estrés, mal sueño)
3. **Aislamiento de Variables**: Ejercicio, nutrición y descanso tratados como silos independientes

La gamificación actúa como el "hook" que mantiene al usuario comprometido, mientras que la adaptabilidad garantiza que la racha nunca se rompa por circunstancias fuera de control. El usuario siente que tiene un "Coach de Élite" que entiende sus limitaciones diarias.

## Glossary

- **Zeal_System**: El ecosistema completo de Zeal AI que integra gamificación, nutrición, entrenamiento y wearables
- **Streak_Manager**: Módulo responsable de gestionar las rachas multi-factor del usuario
- **Level_System**: Módulo que implementa la progresión tipo RPG con rutas de maestría
- **Achievement_System**: Módulo que gestiona logros, celebraciones y recompensas
- **Pillar_Rotation_Engine**: Algoritmo que determina el pilar del día (nutrición, sueño o movimiento)
- **Daily_Pillar**: El objetivo principal del día que el usuario debe completar para mantener su racha
- **Racha**: Secuencia consecutiva de días donde el usuario ha completado su Daily_Pillar
- **Oxidación**: Pérdida de progreso visual cuando se rompe una racha
- **Ruta_de_Maestría**: Camino de progresión personalizado (Beginner, Intermediate, Advanced, Expert)
- **Experience_Points**: Puntos acumulados por completar actividades que determinan el nivel del usuario
- **Notification_Service**: Servicio de notificaciones push usando Expo Notifications
- **Mock_API_Service**: Capa de abstracción que simula backend durante desarrollo
- **Game_Store**: Estado global de gamificación gestionado con Zustand
- **Pillar_History**: Registro histórico de pilares completados por el usuario
- **Streak_Status**: Estado actual de la racha (activa, en riesgo, rota)
- **Achievement_Unlock**: Evento de desbloqueo de un logro específico
- **Pillar_Completion_Metrics**: Métricas específicas que validan la completitud de un pilar

## Requirements

### Requirement 1: Sistema de Rachas Multi-Factor

**User Story:** Como usuario de Zeal AI, quiero mantener mi racha activa completando el "Pilar del Día" (nutrición, sueño o movimiento), para que mi progreso no se pierda por circunstancias fuera de mi control y me sienta motivado a continuar.

**Justificación Técnica:** Las rachas tradicionales (ej: "ir al gym todos los días") tienen tasas de abandono del 60% porque no consideran la realidad del usuario. Un sistema multi-factor permite flexibilidad mientras mantiene el compromiso. La arquitectura modular con Streak_Manager permite futuras extensiones (ej: rachas por categoría, rachas grupales).

#### Acceptance Criteria

1. THE Streak_Manager SHALL calcular la racha actual basándose en el Pillar_History del usuario
2. WHEN el usuario completa su Daily_Pillar antes de medianoche, THE Streak_Manager SHALL incrementar el contador de racha en 1
3. WHEN el usuario NO completa su Daily_Pillar antes de medianoche, THE Streak_Manager SHALL marcar la racha como rota
4. WHILE la racha está activa, THE Zeal_System SHALL mostrar el contador de días consecutivos en la interfaz principal
5. WHEN una racha se rompe, THE Zeal_System SHALL mostrar un mensaje motivacional y permitir iniciar una nueva racha inmediatamente
6. THE Streak_Manager SHALL registrar la racha más larga del usuario en el Pillar_History
7. WHEN la racha alcanza 7 días consecutivos, THE Achievement_System SHALL desbloquear el logro "Week Warrior"
8. WHEN la racha alcanza 30 días consecutivos, THE Achievement_System SHALL desbloquear el logro "Monthly Champion"
9. THE Streak_Manager SHALL persistir el Streak_Status en AsyncStorage para prevenir pérdida de datos
10. FOR ALL rachas activas, verificar que la última fecha de completitud esté dentro de las últimas 24 horas SHALL mantener el Streak_Status como activo



### Requirement 2: Rotación Inteligente de Pilares

**User Story:** Como usuario de Zeal AI, quiero que el sistema seleccione automáticamente mi pilar del día basándose en mi progreso y necesidades, para que mi desarrollo sea balanceado y no tenga que decidir manualmente cada día.

**Justificación Técnica:** La rotación automática reduce la fatiga de decisión y garantiza desarrollo balanceado. El Pillar_Rotation_Engine implementa múltiples estrategias (round-robin, basado en stats, aleatorio ponderado) que pueden ajustarse según datos de uso. La opción manual preserva autonomía del usuario cuando lo necesite.

#### Acceptance Criteria

1. WHEN inicia un nuevo día Y el usuario NO ha seleccionado manualmente un pilar, THE Pillar_Rotation_Engine SHALL determinar automáticamente el Daily_Pillar
2. THE Pillar_Rotation_Engine SHALL implementar al menos tres estrategias de rotación: round-robin, basado en estadísticas más bajas, y aleatorio ponderado
3. WHEN el usuario selecciona manualmente su Daily_Pillar, THE Pillar_Rotation_Engine SHALL marcar el pilar como "isManuallySet" en el registro
4. THE Pillar_Rotation_Engine SHALL considerar el Pillar_History de los últimos 7 días para evitar repetición excesiva del mismo pilar
5. WHEN el algoritmo selecciona un pilar basado en estadísticas, THE Pillar_Rotation_Engine SHALL elegir el pilar con el valor más bajo en user.stats
6. THE Zeal_System SHALL permitir al usuario cambiar su Daily_Pillar hasta las 12:00 PM del día actual
7. WHEN el usuario cambia su pilar después de las 12:00 PM, THE Zeal_System SHALL mostrar una advertencia indicando que el cambio afectará su racha
8. THE Pillar_Rotation_Engine SHALL definir métricas objetivo específicas para cada tipo de pilar (ej: nutrición = macros objetivo, sueño = horas mínimas, movimiento = calorías quemadas)
9. FOR ALL pilares asignados, el sistema SHALL notificar al usuario a las 9:00 AM con el pilar del día y su objetivo específico

### Requirement 3: Sistema de Niveles y Rutas de Maestría

**User Story:** Como usuario de Zeal AI, quiero progresar a través de niveles tipo RPG y desbloquear rutas de experto, para que mi experiencia sea personalizada según mi nivel de conocimiento y me sienta recompensado por mi consistencia.

**Justificación Técnica:** La progresión tipo RPG aumenta retención en 40% según estudios de gamificación (Duolingo, Habitica). El Level_System con rutas diferenciadas (Beginner, Intermediate, Advanced, Expert) permite personalización sin complejidad excesiva. La curva de experiencia ajustable facilita balanceo posterior basado en métricas reales.

#### Acceptance Criteria

1. THE Level_System SHALL implementar cuatro Ruta_de_Maestría: Beginner (niveles 1-10), Intermediate (niveles 11-25), Advanced (niveles 26-50), Expert (niveles 51-100)
2. WHEN un usuario nuevo se registra, THE Level_System SHALL presentar un test de evaluación inicial con al menos 10 preguntas
3. THE Level_System SHALL asignar la ruta inicial basándose en el puntaje del test: 0-30% Beginner, 31-60% Intermediate, 61-85% Advanced, 86-100% Expert
4. WHEN el usuario completa su Daily_Pillar, THE Level_System SHALL otorgar Experience_Points según la dificultad del pilar y la ruta actual
5. THE Level_System SHALL calcular el nivel actual basándose en la fórmula: nivel = floor(sqrt(experience_points / 100))
6. WHEN el usuario acumula suficientes Experience_Points para subir de nivel, THE Level_System SHALL actualizar el nivel y mostrar una animación de celebración
7. THE Level_System SHALL desbloquear características específicas en niveles clave: nivel 5 (estadísticas avanzadas), nivel 10 (cambio de ruta), nivel 25 (métricas personalizadas)
8. WHILE el usuario está en nivel 10 o superior, THE Zeal_System SHALL permitir cambiar de Ruta_de_Maestría una vez cada 30 días
9. THE Level_System SHALL mostrar una barra de progreso visual indicando el porcentaje hacia el siguiente nivel
10. FOR ALL usuarios en ruta Expert, el sistema SHALL aplicar un multiplicador de experiencia de 1.5x para reflejar mayor dificultad

### Requirement 4: Sistema de Logros y Celebraciones

**User Story:** Como usuario de Zeal AI, quiero desbloquear logros y recibir celebraciones cuando alcanzo hitos importantes, para que me sienta reconocido por mi esfuerzo y motivado a continuar.

**Justificación Técnica:** Los logros actúan como refuerzo positivo intermitente, el mecanismo psicológico más efectivo para formar hábitos. El Achievement_System desacoplado permite agregar nuevos logros sin modificar lógica core. Las celebraciones visuales aumentan dopamina y refuerzan comportamiento deseado.

#### Acceptance Criteria

1. THE Achievement_System SHALL gestionar al menos 20 logros diferentes categorizados en: streak, level, pillar, special
2. WHEN el usuario cumple los requisitos de un logro, THE Achievement_System SHALL desbloquear el logro automáticamente
3. WHEN un logro se desbloquea, THE Notification_Service SHALL mostrar una notificación push inmediata con el título y descripción del logro
4. THE Achievement_System SHALL mostrar una animación de celebración en pantalla cuando se desbloquea un logro mientras la app está abierta
5. THE Zeal_System SHALL mantener una pantalla de logros donde el usuario puede ver todos los logros disponibles y su progreso hacia cada uno
6. WHEN el usuario visualiza un logro bloqueado, THE Zeal_System SHALL mostrar el requisito específico para desbloquearlo
7. THE Achievement_System SHALL registrar la fecha de desbloqueo de cada logro en el perfil del usuario
8. WHEN el usuario desbloquea su primer logro, THE Achievement_System SHALL otorgar 100 Experience_Points adicionales
9. THE Achievement_System SHALL incluir logros ocultos que solo se revelan al desbloquearse para mantener elemento sorpresa
10. FOR ALL logros desbloqueados, el sistema SHALL permitir compartir el logro en redes sociales con una imagen generada automáticamente



### Requirement 5: Servicio de Notificaciones Push

**User Story:** Como usuario de Zeal AI, quiero recibir notificaciones oportunas sobre mi pilar del día, advertencias de racha y logros desbloqueados, para que permanezca comprometido sin tener que abrir la app constantemente.

**Justificación Técnica:** Las notificaciones push aumentan retención diaria en 3x según estudios de engagement móvil. Expo Notifications proporciona API unificada para iOS/Android sin configuración nativa compleja. El sistema de notificaciones inteligentes evita spam mediante reglas de frecuencia y relevancia contextual.

#### Acceptance Criteria

1. THE Notification_Service SHALL solicitar permisos de notificaciones push al usuario durante el onboarding
2. WHEN el usuario otorga permisos, THE Notification_Service SHALL registrar el token de notificaciones con Expo
3. THE Notification_Service SHALL programar una notificación diaria recurrente a las 9:00 AM con el Daily_Pillar del usuario
4. WHEN son las 8:00 PM Y el usuario NO ha completado su Daily_Pillar, THE Notification_Service SHALL enviar una advertencia de racha en riesgo
5. WHEN el usuario desbloquea un logro, THE Notification_Service SHALL enviar una notificación inmediata de celebración
6. WHEN el usuario sube de nivel, THE Notification_Service SHALL enviar una notificación inmediata con el nuevo nivel alcanzado
7. THE Notification_Service SHALL permitir al usuario configurar el horario de la notificación diaria entre 6:00 AM y 12:00 PM
8. THE Notification_Service SHALL permitir al usuario desactivar tipos específicos de notificaciones (recordatorios, logros, advertencias)
9. WHEN el usuario toca una notificación, THE Zeal_System SHALL abrir la app en la pantalla relevante según el tipo de notificación
10. THE Notification_Service SHALL limitar las notificaciones a un máximo de 5 por día para evitar fatiga de notificaciones

### Requirement 6: Capa de Abstracción Mock API

**User Story:** Como desarrollador de Zeal AI, quiero una capa de abstracción que simule el backend durante desarrollo, para que pueda implementar toda la lógica frontend sin depender de servicios externos y facilitar la migración futura a backend real.

**Justificación Técnica:** El Mock_API_Service permite desarrollo paralelo frontend/backend y testing sin dependencias externas. El patrón Service Layer con toggle USE_MOCK facilita migración gradual. La simulación de latencia de red (500ms) permite detectar problemas de UX antes de producción.

#### Acceptance Criteria

1. THE Mock_API_Service SHALL implementar todos los endpoints necesarios para el sistema de gamificación: getUserData, updateStreak, getAchievements, updateLevel
2. THE Mock_API_Service SHALL simular latencia de red de 500ms en todas las operaciones para replicar condiciones reales
3. THE Mock_API_Service SHALL retornar datos mock consistentes con los esquemas definidos en la arquitectura (User, Streak, Achievement, LevelRoute)
4. THE Mock_API_Service SHALL persistir cambios en AsyncStorage para mantener estado entre sesiones
5. WHEN el toggle USE_MOCK está activado, THE Zeal_System SHALL usar Mock_API_Service en lugar de llamadas HTTP reales
6. THE Mock_API_Service SHALL incluir datos de ejemplo para al menos 3 usuarios con diferentes niveles y rachas
7. THE Mock_API_Service SHALL simular errores de red aleatoriamente (5% de las llamadas) para testing de manejo de errores
8. THE Mock_API_Service SHALL registrar todas las operaciones en console.log durante desarrollo para facilitar debugging
9. WHEN se implementa el backend real, THE Zeal_System SHALL poder cambiar a API real modificando únicamente el toggle USE_MOCK
10. THE Mock_API_Service SHALL incluir métodos de utilidad para resetear datos mock y generar escenarios de testing específicos

### Requirement 7: Gestión de Estado Global con Zustand

**User Story:** Como desarrollador de Zeal AI, quiero un sistema de gestión de estado predecible y performante, para que los datos de gamificación estén sincronizados en toda la app y persistan entre sesiones.

**Justificación Técnica:** Zustand proporciona gestión de estado con menos boilerplate que Redux y mejor performance que Context API. El middleware persist con AsyncStorage garantiza que rachas y progreso nunca se pierdan. La arquitectura de stores separados (gameStore, userStore) facilita mantenimiento y testing.

#### Acceptance Criteria

1. THE Game_Store SHALL gestionar el estado de: user, streak, dailyPillar, achievements, level
2. THE Game_Store SHALL implementar acciones para: updateStreak, rotatePillar, addExperience, unlockAchievement
3. THE Game_Store SHALL usar el middleware persist de Zustand para guardar automáticamente en AsyncStorage
4. WHEN la app se cierra y reabre, THE Game_Store SHALL restaurar el estado completo desde AsyncStorage
5. THE Game_Store SHALL actualizar el estado de forma inmutable para garantizar re-renders correctos
6. WHEN múltiples componentes leen el mismo estado, THE Game_Store SHALL garantizar que todos reciban actualizaciones sincronizadas
7. THE Game_Store SHALL exponer selectores específicos para evitar re-renders innecesarios (ej: useGameStore(state => state.streak))
8. THE Game_Store SHALL incluir acciones asíncronas que integren con Mock_API_Service
9. WHEN una acción asíncrona falla, THE Game_Store SHALL mantener el estado anterior y registrar el error
10. THE Game_Store SHALL permitir resetear completamente el estado para testing y debugging



### Requirement 8: Validación de Completitud de Pilares

**User Story:** Como usuario de Zeal AI, quiero que el sistema valide automáticamente si he completado mi pilar del día basándose en métricas específicas, para que no tenga que marcar manualmente tareas y el progreso sea objetivo.

**Justificación Técnica:** La validación automática elimina fricción de entrada de datos (problema #1 del proyecto). Cada pilar tiene métricas específicas verificables: nutrición (macros alcanzados), sueño (horas registradas), movimiento (calorías quemadas). El sistema de validación extensible permite agregar nuevos tipos de pilares sin refactorización mayor.

#### Acceptance Criteria

1. THE Streak_Manager SHALL definir criterios de completitud específicos para cada tipo de pilar: nutrición (alcanzar 90% de macros objetivo), sueño (mínimo 7 horas), movimiento (alcanzar calorías objetivo)
2. WHEN el usuario registra actividad relacionada con su Daily_Pillar, THE Streak_Manager SHALL calcular automáticamente el progreso hacia la completitud
3. THE Zeal_System SHALL mostrar una barra de progreso visual indicando el porcentaje de completitud del Daily_Pillar
4. WHEN el progreso alcanza 100%, THE Streak_Manager SHALL marcar el pilar como completado automáticamente
5. THE Streak_Manager SHALL permitir completitud manual con confirmación del usuario para casos donde las métricas automáticas no aplican
6. WHEN el usuario completa manualmente un pilar, THE Streak_Manager SHALL registrar "manual_completion" en el Pillar_History
7. THE Streak_Manager SHALL validar que las Pillar_Completion_Metrics sean realistas (ej: no permitir 20 horas de sueño)
8. WHEN las métricas son inconsistentes, THE Zeal_System SHALL solicitar confirmación adicional al usuario
9. THE Streak_Manager SHALL almacenar las métricas específicas de cada completitud en el Pillar_History para análisis posterior
10. FOR ALL pilares completados, el sistema SHALL registrar timestamp exacto de completitud para cálculos de racha precisos

### Requirement 9: Interfaz de Usuario Gamificada

**User Story:** Como usuario de Zeal AI, quiero una interfaz visualmente atractiva con animaciones y feedback inmediato, para que la experiencia sea placentera y me motive a continuar usando la app.

**Justificación Técnica:** El diseño visual es crítico para retención en apps de gamificación. React Native Reanimated proporciona animaciones de 60fps nativas. El sistema de componentes reutilizables (StreakCounter, LevelProgress, AchievementCard) garantiza consistencia visual y facilita mantenimiento. El feedback inmediato (micro-interacciones) aumenta percepción de responsividad.

#### Acceptance Criteria

1. THE Zeal_System SHALL implementar una pantalla principal (HomeScreen) que muestre: contador de racha, Daily_Pillar actual, barra de progreso de nivel, y próximo logro cercano
2. THE Zeal_System SHALL usar animaciones suaves (300ms) para transiciones entre pantallas
3. WHEN el usuario completa su Daily_Pillar, THE Zeal_System SHALL mostrar una animación de celebración con confetti y sonido opcional
4. THE Zeal_System SHALL implementar un componente StreakCounter que muestre el número de días con animación de fuego que crece según la longitud de la racha
5. WHEN la racha supera 30 días, THE StreakCounter SHALL cambiar el color del fuego de naranja a azul para indicar "racha caliente"
6. THE Zeal_System SHALL implementar un componente LevelProgress que muestre el nivel actual, experiencia acumulada y progreso hacia siguiente nivel
7. THE Zeal_System SHALL usar colores diferenciados para cada Ruta_de_Maestría: Beginner (verde), Intermediate (azul), Advanced (morado), Expert (dorado)
8. WHEN el usuario toca un logro bloqueado, THE Zeal_System SHALL mostrar un modal con detalles del logro y progreso actual
9. THE Zeal_System SHALL implementar micro-interacciones (haptic feedback, animaciones de botones) para todas las acciones principales
10. THE Zeal_System SHALL mantener accesibilidad con tamaños de fuente escalables y soporte para lectores de pantalla

### Requirement 10: Sistema de Onboarding y Evaluación Inicial

**User Story:** Como usuario nuevo de Zeal AI, quiero un proceso de onboarding que evalúe mi nivel actual y me asigne la ruta adecuada, para que mi experiencia sea personalizada desde el primer día.

**Justificación Técnica:** El onboarding es crítico para retención: 40% de usuarios abandonan apps después de un solo uso si no entienden el valor. El test de evaluación inicial permite personalización inmediata sin requerir historial de uso. El flujo de 3 pasos (bienvenida, evaluación, configuración) balancea información necesaria con fricción mínima.

#### Acceptance Criteria

1. THE Zeal_System SHALL presentar una pantalla de bienvenida explicando los tres pilares y el concepto de rachas
2. THE Zeal_System SHALL ofrecer al usuario dos opciones: "Soy principiante" (asigna Beginner automáticamente) o "Evaluar mi nivel" (inicia test)
3. WHEN el usuario elige evaluación, THE Level_System SHALL presentar 10 preguntas sobre conocimiento de nutrición, entrenamiento y descanso
4. THE Level_System SHALL calcular el puntaje del test y asignar la Ruta_de_Maestría correspondiente según los rangos definidos
5. THE Zeal_System SHALL mostrar al usuario su ruta asignada con una explicación de qué esperar en esa ruta
6. THE Zeal_System SHALL solicitar permisos de notificaciones después de asignar la ruta, explicando los beneficios
7. THE Zeal_System SHALL permitir al usuario configurar su horario preferido de notificación diaria
8. WHEN el onboarding se completa, THE Zeal_System SHALL asignar automáticamente el primer Daily_Pillar usando Pillar_Rotation_Engine
9. THE Zeal_System SHALL mostrar un tutorial interactivo de 30 segundos explicando cómo completar el primer pilar
10. THE Zeal_System SHALL permitir saltar el onboarding para usuarios que regresan después de reinstalar la app



### Requirement 11: Historial y Análisis de Progreso

**User Story:** Como usuario de Zeal AI, quiero visualizar mi historial de rachas y progreso a lo largo del tiempo, para que pueda entender mis patrones y celebrar mi evolución.

**Justificación Técnica:** La visualización de progreso histórico aumenta motivación intrínseca al hacer tangible el esfuerzo acumulado. El Pillar_History estructurado permite análisis de patrones (ej: "completo más pilares de movimiento los lunes"). Los gráficos con Victory Native proporcionan visualizaciones performantes en React Native.

#### Acceptance Criteria

1. THE Zeal_System SHALL implementar una pantalla de historial (StreakScreen) que muestre el Pillar_History de los últimos 90 días
2. THE Zeal_System SHALL visualizar el historial como un calendario donde cada día muestra el pilar completado con código de color
3. WHEN el usuario toca un día específico en el calendario, THE Zeal_System SHALL mostrar detalles de las Pillar_Completion_Metrics de ese día
4. THE Zeal_System SHALL calcular y mostrar estadísticas agregadas: total de días activos, pilar más completado, racha promedio
5. THE Zeal_System SHALL implementar un gráfico de línea mostrando la evolución de Experience_Points en los últimos 30 días
6. THE Zeal_System SHALL mostrar un gráfico de barras comparando la frecuencia de completitud de cada pilar (nutrición vs sueño vs movimiento)
7. WHEN el usuario alcanza un nuevo récord personal (ej: racha más larga), THE Zeal_System SHALL destacar visualmente ese logro en el historial
8. THE Zeal_System SHALL permitir filtrar el historial por tipo de pilar para análisis específico
9. THE Zeal_System SHALL calcular "tasa de consistencia" como porcentaje de días con pilar completado en los últimos 30 días
10. THE Zeal_System SHALL permitir exportar el historial completo como archivo JSON para backup personal

### Requirement 12: Manejo de Errores y Recuperación

**User Story:** Como usuario de Zeal AI, quiero que la app maneje errores gracefully y nunca pierda mi progreso, para que confíe en el sistema incluso cuando algo falla.

**Justificación Técnica:** La pérdida de progreso es la causa #1 de abandono en apps de gamificación. El sistema de persistencia multi-capa (AsyncStorage + backup en memoria) garantiza durabilidad. El manejo de errores con retry automático y fallback a modo offline permite operación continua sin conexión.

#### Acceptance Criteria

1. THE Zeal_System SHALL guardar el estado en AsyncStorage después de cada acción crítica (completar pilar, subir nivel, desbloquear logro)
2. WHEN una operación de guardado falla, THE Zeal_System SHALL reintentar hasta 3 veces con backoff exponencial (1s, 2s, 4s)
3. WHEN todos los reintentos fallan, THE Zeal_System SHALL mantener los cambios en memoria y mostrar advertencia al usuario
4. THE Zeal_System SHALL implementar un sistema de cola para operaciones pendientes que se ejecutarán cuando la app vuelva a estar disponible
5. WHEN la app detecta corrupción de datos en AsyncStorage, THE Zeal_System SHALL intentar recuperar desde backup o inicializar estado limpio
6. THE Zeal_System SHALL registrar todos los errores críticos en un log local para debugging
7. WHEN el Mock_API_Service simula un error de red, THE Zeal_System SHALL mostrar mensaje de error específico y opción de reintentar
8. THE Zeal_System SHALL implementar boundary components de React para capturar errores de renderizado sin crashear la app completa
9. WHEN ocurre un error inesperado, THE Zeal_System SHALL mostrar pantalla de error amigable con opción de reportar el problema
10. THE Zeal_System SHALL incluir un modo de recuperación en configuración que permite resetear estado corrupto manteniendo datos esenciales (nivel, racha más larga)

### Requirement 13: Optimización de Performance

**User Story:** Como usuario de Zeal AI, quiero que la app responda instantáneamente a mis acciones, para que la experiencia sea fluida y no me frustre con delays.

**Justificación Técnica:** La percepción de performance es crítica para engagement: delays >300ms son perceptibles y frustrantes. React Native tiene limitaciones de performance que requieren optimización consciente. El uso de React.memo, useMemo, useCallback y FlatList optimizado garantiza 60fps incluso con listas largas.

#### Acceptance Criteria

1. THE Zeal_System SHALL renderizar la pantalla principal (HomeScreen) en menos de 500ms desde el launch
2. THE Zeal_System SHALL responder a interacciones del usuario (toques, swipes) en menos de 100ms
3. THE Zeal_System SHALL usar React.memo para componentes que reciben props complejas y no cambian frecuentemente
4. THE Zeal_System SHALL implementar listas largas (historial, logros) usando FlatList con virtualización
5. WHEN se cargan imágenes de logros, THE Zeal_System SHALL usar lazy loading y placeholders
6. THE Zeal_System SHALL limitar animaciones simultáneas a máximo 3 para evitar drops de frames
7. THE Zeal_System SHALL usar useMemo para cálculos costosos (ej: estadísticas agregadas del historial)
8. THE Zeal_System SHALL implementar debouncing para acciones que pueden dispararse múltiples veces rápidamente
9. WHEN la app está en background, THE Zeal_System SHALL pausar animaciones y reducir actualizaciones de estado
10. THE Zeal_System SHALL mantener el bundle size de JavaScript por debajo de 5MB para tiempos de carga rápidos

### Requirement 14: Testing y Calidad de Código

**User Story:** Como desarrollador de Zeal AI, quiero una suite de tests completa que garantice que el sistema de gamificación funciona correctamente, para que pueda refactorizar con confianza y prevenir regresiones.

**Justificación Técnica:** El sistema de gamificación tiene lógica compleja (cálculo de rachas, rotación de pilares, niveles) que es propensa a bugs. Jest con React Native Testing Library permite testing unitario y de integración. La cobertura >80% garantiza que cambios futuros no rompan funcionalidad existente.

#### Acceptance Criteria

1. THE Zeal_System SHALL incluir tests unitarios para todos los módulos core: Streak_Manager, Level_System, Achievement_System, Pillar_Rotation_Engine
2. THE Zeal_System SHALL alcanzar cobertura de código mínima de 80% en módulos de gamificación
3. THE Zeal_System SHALL incluir tests de integración para flujos completos: completar pilar → actualizar racha → desbloquear logro
4. THE Zeal_System SHALL incluir tests para casos edge: cambio de día a medianoche, racha rota, nivel máximo alcanzado
5. THE Zeal_System SHALL usar mocks para AsyncStorage y Expo Notifications en tests
6. THE Zeal_System SHALL incluir tests de snapshot para componentes visuales críticos (StreakCounter, LevelProgress)
7. THE Zeal_System SHALL validar que todos los tests pasen antes de permitir commits (pre-commit hook)
8. THE Zeal_System SHALL incluir tests de performance para operaciones críticas (carga de historial, cálculo de estadísticas)
9. THE Zeal_System SHALL documentar casos de test complejos con comentarios explicativos
10. THE Zeal_System SHALL incluir tests de accesibilidad verificando que componentes tengan labels apropiados para lectores de pantalla



### Requirement 15: Preparación para Integración con Backend Real

**User Story:** Como desarrollador de Zeal AI, quiero que la arquitectura frontend esté preparada para integración con backend real, para que la migración desde Mock_API_Service sea directa y sin refactorización mayor.

**Justificación Técnica:** El patrón Service Layer con abstracción de API permite cambiar implementación sin tocar lógica de negocio. El diseño de esquemas de datos compatible con REST/GraphQL facilita integración futura. La sincronización de datos locales a servidor garantiza que no se pierda progreso durante migración.

#### Acceptance Criteria

1. THE Mock_API_Service SHALL implementar la misma interfaz (métodos y firmas) que el futuro servicio de API real
2. THE Zeal_System SHALL usar un toggle de configuración (USE_MOCK) que permita cambiar entre Mock_API_Service y API real sin modificar código de componentes
3. THE Zeal_System SHALL diseñar esquemas de datos (User, Streak, Achievement) compatibles con serialización JSON para transmisión HTTP
4. THE Zeal_System SHALL incluir campos de sincronización en los esquemas: id (UUID), createdAt, updatedAt, syncedAt
5. WHEN se implementa el backend real, THE Zeal_System SHALL incluir lógica de sincronización que envíe datos locales al servidor
6. THE Zeal_System SHALL implementar manejo de conflictos para casos donde datos locales y servidor difieren (last-write-wins como estrategia inicial)
7. THE Zeal_System SHALL incluir un método de migración (DataMigration.syncLocalToServer) que transfiera todo el estado local al servidor
8. THE Zeal_System SHALL validar respuestas de API usando esquemas de validación (ej: Zod, Yup) para detectar inconsistencias
9. WHEN la API real retorna errores, THE Zeal_System SHALL mapear códigos de error HTTP a mensajes de usuario amigables
10. THE Zeal_System SHALL incluir documentación de API esperada (endpoints, métodos, payloads) para facilitar implementación de backend

### Requirement 16: Configuración y Personalización

**User Story:** Como usuario de Zeal AI, quiero personalizar aspectos del sistema de gamificación según mis preferencias, para que la experiencia se adapte a mi estilo de vida.

**Justificación Técnica:** La personalización aumenta percepción de control y satisfacción del usuario. Las configuraciones deben balancear flexibilidad con simplicidad para evitar overwhelm. El sistema de configuración centralizado facilita sincronización futura con backend.

#### Acceptance Criteria

1. THE Zeal_System SHALL implementar una pantalla de configuración (SettingsScreen) accesible desde el menú principal
2. THE Zeal_System SHALL permitir al usuario configurar el horario de notificación diaria entre 6:00 AM y 12:00 PM
3. THE Zeal_System SHALL permitir al usuario activar/desactivar tipos específicos de notificaciones: recordatorios diarios, advertencias de racha, logros, subidas de nivel
4. THE Zeal_System SHALL permitir al usuario elegir la estrategia de rotación de pilares: automática (round-robin), basada en estadísticas, o manual
5. WHEN el usuario elige rotación manual, THE Zeal_System SHALL requerir que seleccione su pilar cada día
6. THE Zeal_System SHALL permitir al usuario configurar umbrales personalizados para completitud de pilares (ej: 85% de macros en lugar de 90%)
7. THE Zeal_System SHALL permitir al usuario activar/desactivar sonidos y haptic feedback
8. THE Zeal_System SHALL permitir al usuario elegir tema visual: claro, oscuro, o automático según hora del día
9. THE Zeal_System SHALL persistir todas las configuraciones en AsyncStorage
10. THE Zeal_System SHALL incluir un botón de "Restaurar valores por defecto" que resetee configuraciones sin afectar progreso del usuario

### Requirement 17: Seguridad y Privacidad de Datos

**User Story:** Como usuario de Zeal AI, quiero que mis datos personales y de progreso estén protegidos, para que confíe en la app con información sensible sobre mi salud.

**Justificación Técnica:** Los datos de salud son sensibles y requieren protección especial. AsyncStorage no está encriptado por defecto, requiriendo Expo SecureStore para datos críticos. El cumplimiento con GDPR/CCPA es obligatorio para apps de salud. La minimización de datos reduce superficie de ataque.

#### Acceptance Criteria

1. THE Zeal_System SHALL almacenar datos sensibles (tokens de autenticación futuros) usando Expo SecureStore en lugar de AsyncStorage
2. THE Zeal_System SHALL implementar el principio de minimización de datos: solo recopilar información necesaria para funcionalidad
3. THE Zeal_System SHALL incluir una política de privacidad accesible desde configuración explicando qué datos se recopilan y cómo se usan
4. THE Zeal_System SHALL permitir al usuario exportar todos sus datos en formato JSON (derecho de portabilidad GDPR)
5. THE Zeal_System SHALL permitir al usuario eliminar permanentemente su cuenta y todos los datos asociados (derecho al olvido GDPR)
6. WHEN el usuario solicita eliminación de cuenta, THE Zeal_System SHALL mostrar confirmación explicando que la acción es irreversible
7. THE Zeal_System SHALL NO transmitir datos a terceros sin consentimiento explícito del usuario
8. THE Zeal_System SHALL validar y sanitizar todas las entradas del usuario para prevenir inyección de código
9. THE Zeal_System SHALL incluir timeout de sesión después de 30 días de inactividad para proteger datos en dispositivos compartidos
10. THE Zeal_System SHALL registrar accesos a datos sensibles en un audit log local para debugging de seguridad

### Requirement 18: Internacionalización y Accesibilidad

**User Story:** Como usuario de Zeal AI que habla español, quiero que toda la interfaz esté en mi idioma, para que entienda completamente la experiencia sin barreras de lenguaje.

**Justificación Técnica:** La internacionalización (i18n) es crítica para mercados latinoamericanos. React Native i18n permite cambio de idioma sin recargar app. La accesibilidad no es opcional: 15% de usuarios tienen alguna discapacidad. El soporte de lectores de pantalla y tamaños de fuente escalables garantiza inclusividad.

#### Acceptance Criteria

1. THE Zeal_System SHALL implementar soporte para al menos dos idiomas: español e inglés
2. THE Zeal_System SHALL detectar automáticamente el idioma del dispositivo y usar ese idioma por defecto
3. THE Zeal_System SHALL permitir al usuario cambiar el idioma manualmente desde configuración
4. THE Zeal_System SHALL traducir todos los textos de interfaz: pantallas, botones, notificaciones, mensajes de error
5. THE Zeal_System SHALL usar archivos de traducción separados (es.json, en.json) para facilitar adición de nuevos idiomas
6. THE Zeal_System SHALL formatear fechas y números según la locale del usuario (ej: DD/MM/YYYY vs MM/DD/YYYY)
7. THE Zeal_System SHALL incluir accessibilityLabel en todos los componentes interactivos para lectores de pantalla
8. THE Zeal_System SHALL soportar tamaños de fuente escalables respetando configuración de accesibilidad del sistema operativo
9. THE Zeal_System SHALL mantener contraste mínimo de 4.5:1 entre texto y fondo para cumplir WCAG 2.1 AA
10. THE Zeal_System SHALL permitir navegación completa usando solo teclado/switch control para usuarios con movilidad limitada



### Requirement 19: Monitoreo y Analytics

**User Story:** Como product manager de Zeal AI, quiero entender cómo los usuarios interactúan con el sistema de gamificación, para que pueda tomar decisiones basadas en datos sobre mejoras futuras.

**Justificación Técnica:** Los analytics son esenciales para product-market fit. El AnalyticsService con abstracción permite cambiar proveedores (Firebase, Amplitude, Mixpanel) sin refactorizar. El tracking de eventos específicos de gamificación (racha completada, logro desbloqueado) proporciona insights únicos sobre engagement.

#### Acceptance Criteria

1. THE Zeal_System SHALL implementar un AnalyticsService que registre eventos clave de gamificación
2. THE AnalyticsService SHALL registrar eventos: streak_completed, streak_broken, level_up, achievement_unlocked, pillar_completed, pillar_changed
3. THE AnalyticsService SHALL incluir propiedades contextuales en cada evento: userId, timestamp, currentLevel, currentStreak
4. WHEN la app está en modo desarrollo, THE AnalyticsService SHALL registrar eventos en console.log en lugar de enviarlos a servidor
5. THE AnalyticsService SHALL implementar batching de eventos para reducir consumo de batería y datos
6. THE AnalyticsService SHALL enviar batch de eventos cada 5 minutos o cuando se acumulen 20 eventos
7. THE AnalyticsService SHALL incluir eventos de funnel de onboarding: onboarding_started, test_completed, route_assigned, first_pillar_completed
8. THE AnalyticsService SHALL registrar métricas de performance: app_launch_time, screen_load_time, api_response_time
9. THE AnalyticsService SHALL respetar preferencias de privacidad del usuario: permitir opt-out de analytics en configuración
10. THE AnalyticsService SHALL incluir identificadores anónimos (UUID) en lugar de información personal identificable

### Requirement 20: Documentación y Mantenibilidad

**User Story:** Como desarrollador que se une al equipo de Zeal AI, quiero documentación clara de la arquitectura y código, para que pueda entender el sistema rápidamente y contribuir efectivamente.

**Justificación Técnica:** La documentación reduce tiempo de onboarding de nuevos desarrolladores en 50%. Los comentarios JSDoc permiten autocompletado en IDEs. La documentación de arquitectura (este documento + design.md futuro) proporciona contexto de decisiones técnicas. El código autodocumentado con nombres descriptivos reduce necesidad de comentarios inline.

#### Acceptance Criteria

1. THE Zeal_System SHALL incluir comentarios JSDoc en todos los módulos principales: Streak_Manager, Level_System, Achievement_System
2. THE Zeal_System SHALL documentar la interfaz pública de cada módulo con descripción de parámetros y valores de retorno
3. THE Zeal_System SHALL incluir un README.md en la raíz del proyecto explicando: setup, estructura de carpetas, comandos principales
4. THE Zeal_System SHALL incluir diagramas de arquitectura actualizados en formato Mermaid dentro del código
5. THE Zeal_System SHALL usar nombres de variables y funciones descriptivos que expliquen su propósito sin necesidad de comentarios
6. THE Zeal_System SHALL incluir comentarios explicativos para lógica compleja (ej: algoritmo de rotación de pilares, cálculo de experiencia)
7. THE Zeal_System SHALL documentar decisiones arquitectónicas importantes en un archivo ARCHITECTURE.md
8. THE Zeal_System SHALL incluir ejemplos de uso para custom hooks principales (useStreak, useLevel, useAchievements)
9. THE Zeal_System SHALL mantener un CHANGELOG.md registrando cambios significativos en cada versión
10. THE Zeal_System SHALL incluir guías de troubleshooting para problemas comunes (ej: racha no se actualiza, notificaciones no llegan)

## Requisitos No Funcionales

### Performance

1. THE Zeal_System SHALL cargar la pantalla principal en menos de 500ms en dispositivos de gama media (iPhone 11, Samsung Galaxy S10)
2. THE Zeal_System SHALL mantener 60 FPS durante animaciones en dispositivos de gama media
3. THE Zeal_System SHALL consumir menos de 50MB de RAM durante operación normal
4. THE Zeal_System SHALL ocupar menos de 100MB de almacenamiento incluyendo datos de usuario

### Escalabilidad

1. THE Zeal_System SHALL soportar Pillar_History de hasta 365 días sin degradación de performance
2. THE Zeal_System SHALL soportar hasta 100 logros diferentes sin impactar tiempo de carga
3. THE Zeal_System SHALL diseñar esquemas de datos preparados para sincronización con backend que maneje millones de usuarios

### Confiabilidad

1. THE Zeal_System SHALL tener tasa de crash menor a 0.1% de sesiones
2. THE Zeal_System SHALL recuperarse automáticamente de errores no críticos sin perder datos del usuario
3. THE Zeal_System SHALL mantener integridad de datos incluso si la app se cierra abruptamente

### Usabilidad

1. THE Zeal_System SHALL permitir a usuarios nuevos completar su primer pilar en menos de 5 minutos desde la instalación
2. THE Zeal_System SHALL mantener flujos principales (completar pilar, ver progreso) en máximo 3 taps desde pantalla principal
3. THE Zeal_System SHALL proporcionar feedback visual inmediato (<100ms) para todas las interacciones del usuario

### Compatibilidad

1. THE Zeal_System SHALL funcionar en iOS 13+ y Android 8+
2. THE Zeal_System SHALL soportar tamaños de pantalla desde 4.7" (iPhone SE) hasta 6.7" (iPhone Pro Max)
3. THE Zeal_System SHALL funcionar correctamente en modo portrait y landscape

### Mantenibilidad

1. THE Zeal_System SHALL mantener cobertura de tests mínima de 80% en módulos core
2. THE Zeal_System SHALL usar linting (ESLint) y formatting (Prettier) automático para mantener consistencia de código
3. THE Zeal_System SHALL modularizar funcionalidad para permitir agregar nuevos tipos de pilares sin refactorización mayor

## Dependencias Técnicas

### Librerías Principales

- **React Native**: Framework principal (versión 0.71+)
- **Expo**: Toolchain y servicios (SDK 48+)
- **Zustand**: Gestión de estado (versión 4+)
- **AsyncStorage**: Persistencia local
- **Expo Notifications**: Notificaciones push
- **React Navigation**: Navegación entre pantallas
- **React Native Reanimated**: Animaciones performantes
- **Victory Native**: Gráficos y visualizaciones

### Librerías de Desarrollo

- **Jest**: Testing framework
- **React Native Testing Library**: Testing de componentes
- **ESLint**: Linting de código
- **Prettier**: Formatting de código
- **TypeScript** (opcional pero recomendado): Type safety

## Riesgos y Mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Pérdida de datos locales por corrupción de AsyncStorage | Alto | Media | Implementar sistema de backup automático, validación de integridad de datos, recuperación desde estado limpio |
| Notificaciones no llegan por permisos denegados | Medio | Alta | Explicar claramente beneficios durante onboarding, permitir reconfigurar permisos desde settings, fallback a notificaciones in-app |
| Algoritmo de rotación de pilares no balanceado | Medio | Alta | Implementar múltiples estrategias, permitir override manual, ajustar basándose en analytics |
| Curva de experiencia desbalanceada (muy fácil o muy difícil) | Medio | Media | Diseñar curva ajustable mediante configuración, monitorear tiempo promedio para subir nivel, permitir ajustes sin migración de datos |
| Performance degradada en dispositivos de gama baja | Medio | Media | Testing en dispositivos reales de gama baja, optimización de animaciones, lazy loading de componentes pesados |
| Usuarios no entienden el concepto de pilares rotativos | Alto | Media | Onboarding claro con ejemplos visuales, tutorial interactivo, tooltips contextuales en primeros usos |
| Migración a backend real introduce bugs | Alto | Baja | Diseño de API mock idéntico a API real, tests de integración exhaustivos, migración gradual por features |

## Criterios de Aceptación del Proyecto

El sistema de gamificación se considerará completo cuando:

1. Todos los 20 requisitos funcionales estén implementados y validados
2. La cobertura de tests alcance mínimo 80% en módulos core
3. El onboarding completo tome menos de 5 minutos para usuarios nuevos
4. La tasa de crash sea menor a 0.1% en testing beta con 100+ usuarios
5. Las notificaciones push funcionen correctamente en iOS y Android
6. El sistema persista datos correctamente entre sesiones sin pérdida
7. La documentación técnica esté completa y actualizada
8. El código pase todos los checks de linting y formatting
9. La app funcione correctamente en dispositivos de gama media y alta
10. El toggle USE_MOCK permita cambiar entre mock y API real sin errores

## Próximos Pasos

Una vez aprobado este documento de requisitos, los siguientes pasos son:

1. **Revisión y Feedback**: Stakeholders revisan requisitos y proponen ajustes
2. **Diseño Técnico (design.md)**: Crear diagramas UML, pseudocódigo detallado, especificaciones de API
3. **Creación de Tasks (tasks.md)**: Descomponer requisitos en tareas implementables con estimaciones
4. **Implementación**: Desarrollo siguiendo las fases definidas en architecture-gamification-system.md
5. **Testing y QA**: Validación de cada requisito con tests automatizados y manuales
6. **Beta Testing**: Pruebas con usuarios reales para validar UX y detectar edge cases
7. **Lanzamiento**: Deploy a producción con monitoreo de métricas clave

---

**Documento generado para:** Zeal AI - Fase 4: Sistema de Gamificación Integral  
**Fecha:** Febrero 2025  
**Versión:** 1.0  
**Workflow:** Requirements-First  
**Spec ID:** af6a2549-c261-437d-aa4d-aee33d000844
