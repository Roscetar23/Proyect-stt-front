# Requirements Document

## Introduction

Este documento define los requisitos para la Fase 2: Sistema de Rachas del sistema de gamificación. Esta fase implementa el núcleo del sistema de rachas, incluyendo el cálculo de rachas basado en completación diaria de pilares, la rotación automática y manual de pilares, componentes de UI para visualizar rachas, y pantallas dedicadas para gestionar el progreso del usuario. El sistema de rachas es fundamental para mantener la motivación y el compromiso del usuario con sus hábitos de bienestar.

## Glossary

- **Streak_System**: Sistema que rastrea y gestiona rachas de completación de pilares
- **Streak_Manager**: Módulo que encapsula la lógica de cálculo y validación de rachas
- **Daily_Pillar**: Pilar asignado para el día actual (nutrition, sleep, o movement)
- **Pillar_Rotation**: Proceso de seleccionar el pilar del día siguiente
- **Rotation_Strategy**: Algoritmo usado para rotar pilares (round-robin, stats-based, weighted-random)
- **Pillar_History**: Registro histórico de pilares completados y sus métricas
- **Streak_Counter**: Componente UI que muestra el conteo actual de la racha
- **Streak_Calendar**: Componente UI que visualiza el historial de rachas en formato calendario
- **Pillar_Card**: Componente UI que muestra el pilar del día con progreso
- **Streak_Stats**: Componente UI que muestra estadísticas de rachas
- **Streak_Active**: Estado que indica si la racha está activa (última completación dentro de 24h)
- **Manual_Selection**: Capacidad del usuario de elegir manualmente el pilar del día
- **Automatic_Rotation**: Rotación automática de pilares a medianoche

## Requirements

### Requirement 1: Cálculo de Racha Actual

**User Story:** Como usuario, quiero que el sistema calcule mi racha actual basándose en mi historial de pilares, para que pueda ver mi progreso de consistencia.

#### Acceptance Criteria

1. THE Streak_Manager SHALL calcular la racha actual contando días consecutivos con pilares completados
2. WHEN un pilar se completa, THE Streak_Manager SHALL incrementar la racha actual en 1
3. WHEN un día se salta sin completar el pilar, THE Streak_Manager SHALL resetear la racha actual a 0
4. THE Streak_Manager SHALL considerar días consecutivos basándose en fechas calendario, no en períodos de 24 horas
5. THE Streak_Manager SHALL actualizar la racha más larga si la racha actual la supera

### Requirement 2: Verificación de Racha Activa

**User Story:** Como usuario, quiero saber si mi racha está activa, para que pueda tomar acción antes de perderla.

#### Acceptance Criteria

1. THE Streak_Manager SHALL considerar una racha activa si la última completación fue dentro de las últimas 24 horas
2. WHEN la última completación fue hace más de 24 horas, THE Streak_Manager SHALL marcar la racha como inactiva
3. THE Streak_Manager SHALL verificar el estado de la racha cada vez que se consulta
4. WHEN la racha está inactiva y se completa un pilar, THE Streak_Manager SHALL iniciar una nueva racha desde 1

### Requirement 3: Rotación Automática de Pilares

**User Story:** Como usuario, quiero que el sistema rote automáticamente mi pilar diario a medianoche, para que siempre tenga un objetivo claro cada día.

#### Acceptance Criteria

1. THE Streak_System SHALL rotar el pilar automáticamente a medianoche hora local
2. THE Automatic_Rotation SHALL usar la estrategia round-robin por defecto
3. WHEN se rota automáticamente, THE Streak_System SHALL marcar el pilar como no seleccionado manualmente
4. THE Automatic_Rotation SHALL registrar la rotación en el Pillar_History
5. THE Streak_System SHALL seleccionar el siguiente pilar en secuencia: nutrition → sleep → movement → nutrition

### Requirement 4: Selección Manual de Pilares

**User Story:** Como usuario, quiero poder elegir manualmente mi pilar del día, para que tenga flexibilidad en mi rutina.

#### Acceptance Criteria

1. THE Streak_System SHALL permitir al usuario seleccionar manualmente cualquiera de los 3 pilares
2. WHEN el usuario selecciona manualmente un pilar, THE Streak_System SHALL marcar isManuallySet como true
3. THE Manual_Selection SHALL sobrescribir la rotación automática para ese día
4. THE Streak_System SHALL permitir cambiar la selección manual hasta que el pilar sea completado
5. WHEN un pilar es seleccionado manualmente, THE Streak_System SHALL actualizar el Daily_Pillar inmediatamente

### Requirement 5: Estrategias de Rotación

**User Story:** Como desarrollador, quiero múltiples estrategias de rotación de pilares, para que el sistema pueda adaptarse a diferentes necesidades de usuarios.

#### Acceptance Criteria

1. THE Streak_Manager SHALL implementar estrategia round-robin que rota pilares en orden secuencial
2. THE Streak_Manager SHALL implementar estrategia stats-based que prioriza el pilar con menor progreso
3. THE Streak_Manager SHALL implementar estrategia weighted-random que selecciona aleatoriamente con pesos basados en stats
4. THE Rotation_Strategy SHALL ser configurable por usuario
5. FOR ALL estrategias, THE Streak_Manager SHALL garantizar que cada pilar aparece al menos una vez cada 7 días

### Requirement 6: Validación de Completación de Pilares

**User Story:** Como usuario, quiero que el sistema valide cuando completo mi pilar del día, para que mi racha se actualice correctamente.

#### Acceptance Criteria

1. THE Streak_Manager SHALL validar que el pilar completado corresponde al Daily_Pillar asignado
2. WHEN se completa el pilar correcto, THE Streak_Manager SHALL marcar completed como true
3. WHEN se intenta completar un pilar diferente al asignado, THE Streak_Manager SHALL rechazar la completación
4. THE Streak_Manager SHALL registrar las métricas del pilar completado en Pillar_History
5. THE Streak_Manager SHALL actualizar el progreso del pilar en tiempo real

### Requirement 7: Componente Streak Counter

**User Story:** Como usuario, quiero ver mi conteo de racha actual con un emoji de fuego, para que pueda visualizar rápidamente mi progreso.

#### Acceptance Criteria

1. THE Streak_Counter SHALL mostrar el número de la racha actual
2. THE Streak_Counter SHALL incluir un emoji de fuego (🔥) junto al número
3. WHEN la racha es 0, THE Streak_Counter SHALL mostrar "0 🔥" o un estado vacío
4. THE Streak_Counter SHALL actualizar en tiempo real cuando la racha cambia
5. THE Streak_Counter SHALL ser reutilizable en múltiples pantallas

### Requirement 8: Componente Streak Calendar

**User Story:** Como usuario, quiero ver un calendario visual de mi historial de rachas, para que pueda identificar patrones en mi consistencia.

#### Acceptance Criteria

1. THE Streak_Calendar SHALL mostrar los últimos 30 días en formato calendario
2. THE Streak_Calendar SHALL marcar días completados con un indicador visual (ej: color verde o checkmark)
3. THE Streak_Calendar SHALL marcar días no completados con un indicador diferente (ej: color gris)
4. THE Streak_Calendar SHALL mostrar el pilar completado cada día (nutrition, sleep, movement)
5. WHEN el usuario toca un día, THE Streak_Calendar SHALL mostrar detalles de ese día (pilar, métricas)

### Requirement 9: Componente Pillar Card

**User Story:** Como usuario, quiero ver una tarjeta con mi pilar del día, su objetivo y mi progreso, para que sepa qué debo completar hoy.

#### Acceptance Criteria

1. THE Pillar_Card SHALL mostrar el nombre del pilar del día (Nutrición, Sueño, o Movimiento)
2. THE Pillar_Card SHALL mostrar el icono correspondiente al pilar (🥗, 😴, o 🏃)
3. THE Pillar_Card SHALL mostrar el objetivo del pilar (ej: "8 horas de sueño")
4. THE Pillar_Card SHALL mostrar el progreso actual hacia el objetivo
5. THE Pillar_Card SHALL incluir un botón para marcar el pilar como completado
6. WHEN el pilar está completado, THE Pillar_Card SHALL mostrar un estado visual de completado

### Requirement 10: Componente Streak Stats

**User Story:** Como usuario, quiero ver estadísticas de mis rachas, para que pueda entender mi desempeño general.

#### Acceptance Criteria

1. THE Streak_Stats SHALL mostrar la racha actual
2. THE Streak_Stats SHALL mostrar la racha más larga alcanzada
3. THE Streak_Stats SHALL calcular y mostrar la tasa de completación (días completados / días totales)
4. THE Streak_Stats SHALL mostrar el conteo de completaciones por pilar
5. THE Streak_Stats SHALL actualizar automáticamente cuando cambian los datos

### Requirement 11: Pantalla Streak Home

**User Story:** Como usuario, quiero una pantalla principal de rachas que muestre mi pilar del día y progreso, para que tenga una vista centralizada de mi estado actual.

#### Acceptance Criteria

1. THE Streak_Home_Screen SHALL mostrar el Streak_Counter en la parte superior
2. THE Streak_Home_Screen SHALL mostrar el Pillar_Card del día actual
3. THE Streak_Home_Screen SHALL mostrar un resumen de Streak_Stats
4. THE Streak_Home_Screen SHALL incluir navegación a Streak_History_Screen
5. THE Streak_Home_Screen SHALL incluir un botón para selección manual de pilar
6. WHEN el pilar del día se completa, THE Streak_Home_Screen SHALL mostrar feedback visual de celebración

### Requirement 12: Pantalla Streak History

**User Story:** Como usuario, quiero una pantalla dedicada para ver mi historial de rachas, para que pueda analizar mi progreso a lo largo del tiempo.

#### Acceptance Criteria

1. THE Streak_History_Screen SHALL mostrar el Streak_Calendar con los últimos 30 días
2. THE Streak_History_Screen SHALL permitir navegar a meses anteriores
3. THE Streak_History_Screen SHALL mostrar estadísticas detalladas por período (semana, mes)
4. THE Streak_History_Screen SHALL permitir filtrar por pilar específico
5. THE Streak_History_Screen SHALL incluir navegación de regreso a Streak_Home_Screen

### Requirement 13: Pantalla Pillar Selection

**User Story:** Como usuario, quiero una pantalla para seleccionar manualmente mi pilar del día, para que pueda elegir según mis necesidades actuales.

#### Acceptance Criteria

1. THE Pillar_Selection_Screen SHALL mostrar los 3 pilares disponibles como opciones seleccionables
2. THE Pillar_Selection_Screen SHALL indicar visualmente el pilar actualmente asignado
3. WHEN el usuario selecciona un pilar, THE Pillar_Selection_Screen SHALL actualizar el Daily_Pillar
4. THE Pillar_Selection_Screen SHALL mostrar una descripción de cada pilar
5. THE Pillar_Selection_Screen SHALL incluir navegación de regreso a Streak_Home_Screen
6. WHEN el pilar del día ya está completado, THE Pillar_Selection_Screen SHALL deshabilitar la selección

### Requirement 14: Integración con Zustand Store

**User Story:** Como desarrollador, quiero que el sistema de rachas se integre con el Zustand Store existente, para que el estado sea consistente y persistente.

#### Acceptance Criteria

1. THE Streak_System SHALL utilizar las acciones updateStreak y rotatePillar del Zustand Store
2. WHEN se completa un pilar, THE Streak_System SHALL invocar updateStreak con los datos correctos
3. WHEN se rota un pilar, THE Streak_System SHALL invocar rotatePillar con la estrategia seleccionada
4. THE Streak_System SHALL leer el estado actual desde useGameStore
5. THE Streak_System SHALL garantizar que todos los cambios persisten en AsyncStorage automáticamente

### Requirement 15: Feedback de Completación

**User Story:** Como usuario, quiero recibir feedback inmediato cuando completo mi pilar del día, para que me sienta motivado y recompensado.

#### Acceptance Criteria

1. WHEN el usuario completa el pilar del día, THE Streak_System SHALL mostrar una animación de celebración
2. THE Streak_System SHALL mostrar un mensaje de felicitación personalizado
3. IF la racha alcanza un hito (7, 30, 100 días), THEN THE Streak_System SHALL mostrar un mensaje especial
4. THE Streak_System SHALL actualizar el Streak_Counter con animación
5. THE Streak_System SHALL añadir experiencia al usuario usando addExperience del store

### Requirement 16: Notificación de Racha en Riesgo

**User Story:** Como usuario, quiero saber si mi racha está en riesgo de perderse, para que pueda tomar acción a tiempo.

#### Acceptance Criteria

1. WHEN faltan menos de 6 horas para medianoche y el pilar no está completado, THE Streak_System SHALL mostrar una advertencia
2. THE Streak_System SHALL indicar visualmente que la racha está en riesgo
3. THE Streak_System SHALL mostrar el tiempo restante hasta medianoche
4. WHEN la racha se pierde, THE Streak_System SHALL mostrar un mensaje informativo (no punitivo)
5. THE Streak_System SHALL ofrecer motivación para comenzar una nueva racha

### Requirement 17: Historial de Rotación de Pilares

**User Story:** Como desarrollador, quiero que el sistema registre el historial de rotaciones de pilares, para que pueda analizar patrones y optimizar estrategias.

#### Acceptance Criteria

1. THE Streak_Manager SHALL registrar cada rotación de pilar en Pillar_History
2. FOR ALL rotaciones, THE Streak_Manager SHALL guardar: fecha, pilar seleccionado, estrategia usada, y si fue manual
3. THE Pillar_History SHALL ser accesible para análisis y visualización
4. THE Streak_Manager SHALL mantener al menos 90 días de historial
5. THE Pillar_History SHALL incluir métricas del pilar cuando se completa
