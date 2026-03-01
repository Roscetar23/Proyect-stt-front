# Requirements Document

## Introduction

Este documento define los requisitos para la Fase 3: Sistema de Niveles del sistema de gamificación. Esta fase implementa el sistema de progresión tipo RPG con rutas personalizadas, permitiendo a los usuarios avanzar a través de niveles de maestría según su experiencia y compromiso. El sistema incluye 4 rutas diferenciadas (beginner, intermediate, advanced, expert), test de evaluación inicial, componentes de UI para visualizar progreso, y pantallas dedicadas para gestionar la progresión del usuario.

## Glossary

- **Level_System**: Sistema que gestiona niveles, experiencia y progresión del usuario
- **Experience (XP)**: Puntos acumulados por completar actividades que determinan el nivel
- **Level**: Número que representa el progreso del usuario en su ruta actual
- **Route**: Camino de progresión seleccionado (beginner, intermediate, advanced, expert)
- **Level_Info**: Información de un nivel específico (título, XP requerido, features desbloqueadas)
- **Unlocked_Features**: Funcionalidades que se desbloquean al alcanzar ciertos niveles
- **Level_Progress**: Progreso actual hacia el siguiente nivel (porcentaje y XP)
- **Level_History**: Registro histórico de niveles alcanzados
- **Route_Change**: Proceso de cambiar de una ruta a otra al completar niveles específicos
- **Assessment_Test**: Test inicial para recomendar ruta apropiada al usuario
- **Level_Up**: Evento que ocurre cuando el usuario alcanza un nuevo nivel
- **Experience_Bar**: Componente UI que muestra progreso de experiencia
- **Level_Badge**: Componente UI que muestra el nivel actual del usuario
- **Route_Selector**: Componente UI para seleccionar o cambiar de ruta

## Requirements

### Requirement 1: Cálculo de Nivel Basado en Experiencia

**User Story:** Como usuario, quiero que mi nivel se calcule automáticamente basándose en mi experiencia acumulada, para que pueda ver mi progreso de forma clara.

#### Acceptance Criteria

1. THE Level_System SHALL calcular el nivel actual basándose en la experiencia total y la ruta seleccionada
2. WHEN el usuario gana experiencia, THE Level_System SHALL recalcular el nivel automáticamente
3. THE Level_System SHALL usar la tabla de niveles específica de cada ruta para determinar el nivel
4. FOR ALL rutas, THE Level_System SHALL garantizar que el nivel nunca disminuye
5. WHEN el usuario alcanza la experiencia requerida para un nivel, THE Level_System SHALL actualizar el nivel inmediatamente

### Requirement 2: Gestión de Experiencia

**User Story:** Como usuario, quiero ganar experiencia por completar actividades, para que pueda progresar en mi nivel.

#### Acceptance Criteria

1. WHEN el usuario completa un pilar, THE Level_System SHALL otorgar 50 XP
2. WHEN el usuario alcanza un hito de racha (7, 30, 100 días), THE Level_System SHALL otorgar 100 XP adicionales
3. WHEN el usuario desbloquea un logro, THE Level_System SHALL otorgar 75 XP
4. THE Level_System SHALL acumular toda la experiencia ganada en el perfil del usuario
5. THE Level_System SHALL persistir la experiencia en AsyncStorage automáticamente

### Requirement 3: Sistema de Rutas de Progresión

**User Story:** Como usuario, quiero poder elegir una ruta de progresión que se ajuste a mi nivel de experiencia, para que el sistema se adapte a mis necesidades.

#### Acceptance Criteria

1. THE Level_System SHALL ofrecer 4 rutas: beginner (niveles 1-10), intermediate (11-20), advanced (21-25), expert (26-30)
2. WHEN un usuario nuevo se registra, THE Level_System SHALL permitir seleccionar una ruta inicial
3. THE Level_System SHALL almacenar la ruta seleccionada en el perfil del usuario
4. FOR ALL rutas, THE Level_System SHALL definir niveles con experiencia requerida y features desbloqueadas
5. THE Level_System SHALL permitir cambiar de ruta solo al completar la ruta actual

### Requirement 4: Información de Nivel

**User Story:** Como usuario, quiero ver información detallada sobre mi nivel actual, para que entienda qué he desbloqueado y qué viene después.

#### Acceptance Criteria

1. THE Level_System SHALL proporcionar el título del nivel actual (ej: "Novato", "Aprendiz", "Maestro")
2. THE Level_System SHALL mostrar la experiencia requerida para el nivel actual
3. THE Level_System SHALL listar las features desbloqueadas en el nivel actual
4. THE Level_System SHALL mostrar la experiencia necesaria para el siguiente nivel
5. THE Level_System SHALL calcular el progreso hacia el siguiente nivel como porcentaje

### Requirement 5: Progreso Hacia Siguiente Nivel

**User Story:** Como usuario, quiero ver mi progreso hacia el siguiente nivel, para que sepa cuánto me falta para avanzar.

#### Acceptance Criteria

1. THE Level_System SHALL calcular el porcentaje de progreso hacia el siguiente nivel
2. THE Level_System SHALL mostrar la experiencia actual dentro del nivel (XP ganado desde el último level up)
3. THE Level_System SHALL mostrar la experiencia total necesaria para alcanzar el siguiente nivel
4. WHEN el usuario está en el nivel máximo de su ruta, THE Level_System SHALL indicar que ha completado la ruta
5. THE Level_System SHALL actualizar el progreso en tiempo real cuando se gana experiencia

### Requirement 6: Features Desbloqueadas

**User Story:** Como usuario, quiero ver qué funcionalidades he desbloqueado, para que pueda aprovechar todas las capacidades disponibles.

#### Acceptance Criteria

1. THE Level_System SHALL mantener una lista de todas las features desbloqueadas hasta el nivel actual
2. WHEN el usuario sube de nivel, THE Level_System SHALL agregar las nuevas features a la lista
3. THE Level_System SHALL proporcionar descripciones de cada feature desbloqueada
4. THE Level_System SHALL indicar visualmente las features recién desbloqueadas
5. THE Level_System SHALL persistir la lista de features desbloqueadas en el perfil del usuario

### Requirement 7: Cambio de Ruta

**User Story:** Como usuario, quiero poder cambiar a una ruta más avanzada cuando complete mi ruta actual, para que pueda seguir progresando.

#### Acceptance Criteria

1. THE Level_System SHALL permitir cambiar de ruta solo al completar el último nivel de la ruta actual
2. WHEN el usuario completa beginner (nivel 10), THE Level_System SHALL permitir cambiar a intermediate
3. WHEN el usuario completa intermediate (nivel 20), THE Level_System SHALL permitir cambiar a advanced
4. WHEN el usuario completa advanced (nivel 25), THE Level_System SHALL permitir cambiar a expert
5. THE Level_System SHALL mostrar un indicador visual cuando el cambio de ruta esté disponible
6. WHEN el usuario cambia de ruta, THE Level_System SHALL actualizar las features desbloqueadas según la nueva ruta

### Requirement 8: Test de Evaluación Inicial

**User Story:** Como usuario nuevo, quiero realizar un test de evaluación, para que el sistema me recomiende la ruta más apropiada.

#### Acceptance Criteria

1. THE Level_System SHALL ofrecer un test de evaluación opcional para usuarios nuevos
2. THE Level_System SHALL evaluar el puntaje del test y recomendar una ruta (0-30%: beginner, 31-60%: intermediate, 61-85%: advanced, 86-100%: expert)
3. THE Level_System SHALL permitir al usuario aceptar o rechazar la recomendación
4. WHEN el usuario rechaza la recomendación, THE Level_System SHALL permitir seleccionar manualmente cualquier ruta
5. THE Level_System SHALL guardar el resultado del test en el perfil del usuario

### Requirement 9: Historial de Niveles

**User Story:** Como usuario, quiero ver un historial de los niveles que he alcanzado, para que pueda revisar mi progresión a lo largo del tiempo.

#### Acceptance Criteria

1. THE Level_System SHALL registrar cada nivel alcanzado con fecha y hora
2. THE Level_System SHALL incluir en el historial: nivel, ruta, fecha de desbloqueo, y features desbloqueadas
3. THE Level_System SHALL mantener el historial completo desde el inicio
4. THE Level_System SHALL permitir visualizar el historial en orden cronológico
5. THE Level_System SHALL persistir el historial en AsyncStorage

### Requirement 10: Componente Level Progress

**User Story:** Como usuario, quiero ver un componente visual de mi progreso de nivel, para que pueda entender rápidamente mi estado actual.

#### Acceptance Criteria

1. THE Level_Progress SHALL mostrar el nivel actual con número grande y visible
2. THE Level_Progress SHALL mostrar el título del nivel (ej: "Aprendiz")
3. THE Level_Progress SHALL incluir una barra de progreso visual hacia el siguiente nivel
4. THE Level_Progress SHALL mostrar XP actual / XP necesario en formato numérico
5. THE Level_Progress SHALL mostrar cuánta XP falta para el siguiente nivel
6. THE Level_Progress SHALL actualizar automáticamente cuando cambia la experiencia

### Requirement 11: Componente Experience Bar

**User Story:** Como usuario, quiero ver una barra de experiencia, para que pueda visualizar mi progreso de forma intuitiva.

#### Acceptance Criteria

1. THE Experience_Bar SHALL mostrar una barra horizontal con progreso visual
2. THE Experience_Bar SHALL usar colores que indiquen el porcentaje de progreso
3. THE Experience_Bar SHALL incluir animación suave cuando aumenta la experiencia
4. THE Experience_Bar SHALL mostrar el porcentaje de progreso como texto
5. THE Experience_Bar SHALL ser reutilizable en múltiples pantallas

### Requirement 12: Componente Level Badge

**User Story:** Como usuario, quiero ver un badge con mi nivel actual, para que pueda identificar rápidamente mi progreso.

#### Acceptance Criteria

1. THE Level_Badge SHALL mostrar el número de nivel en un diseño circular o badge
2. THE Level_Badge SHALL usar colores diferentes según la ruta (beginner: verde, intermediate: azul, advanced: morado, expert: dorado)
3. THE Level_Badge SHALL incluir el icono o símbolo de la ruta
4. THE Level_Badge SHALL soportar diferentes tamaños (small, medium, large)
5. THE Level_Badge SHALL ser reutilizable en múltiples componentes

### Requirement 13: Componente Route Selector

**User Story:** Como usuario, quiero ver un selector de rutas, para que pueda elegir o cambiar mi ruta de progresión.

#### Acceptance Criteria

1. THE Route_Selector SHALL mostrar las 4 rutas disponibles con nombre y descripción
2. THE Route_Selector SHALL indicar visualmente la ruta actual del usuario
3. THE Route_Selector SHALL deshabilitar rutas que no están disponibles para el usuario
4. THE Route_Selector SHALL mostrar los requisitos para desbloquear rutas no disponibles
5. WHEN el usuario selecciona una ruta, THE Route_Selector SHALL actualizar la ruta en el store

### Requirement 14: Componente Unlocked Features List

**User Story:** Como usuario, quiero ver una lista de features desbloqueadas, para que sepa qué funcionalidades tengo disponibles.

#### Acceptance Criteria

1. THE Unlocked_Features_List SHALL mostrar todas las features desbloqueadas hasta el nivel actual
2. THE Unlocked_Features_List SHALL agrupar features por categoría o nivel
3. THE Unlocked_Features_List SHALL indicar visualmente las features recién desbloqueadas
4. THE Unlocked_Features_List SHALL incluir descripciones breves de cada feature
5. THE Unlocked_Features_List SHALL actualizar automáticamente cuando se desbloquean nuevas features

### Requirement 15: Pantalla Level Home

**User Story:** Como usuario, quiero una pantalla principal de niveles, para que pueda ver mi progreso y gestionar mi ruta.

#### Acceptance Criteria

1. THE Level_Home_Screen SHALL mostrar el Level_Badge en la parte superior
2. THE Level_Home_Screen SHALL mostrar el Level_Progress con barra de experiencia
3. THE Level_Home_Screen SHALL mostrar la ruta actual y su descripción
4. THE Level_Home_Screen SHALL mostrar las Unlocked_Features más recientes
5. THE Level_Home_Screen SHALL incluir navegación a Level_History_Screen
6. WHEN el usuario puede cambiar de ruta, THE Level_Home_Screen SHALL mostrar un botón para Route_Selection_Screen

### Requirement 16: Pantalla Level History

**User Story:** Como usuario, quiero una pantalla de historial de niveles, para que pueda revisar mi progresión completa.

#### Acceptance Criteria

1. THE Level_History_Screen SHALL mostrar todos los niveles alcanzados en orden cronológico
2. THE Level_History_Screen SHALL incluir para cada nivel: número, título, fecha, ruta, y features desbloqueadas
3. THE Level_History_Screen SHALL permitir filtrar por ruta
4. THE Level_History_Screen SHALL mostrar estadísticas generales (niveles totales, tiempo promedio por nivel)
5. THE Level_History_Screen SHALL incluir navegación de regreso a Level_Home_Screen

### Requirement 17: Pantalla Route Selection

**User Story:** Como usuario, quiero una pantalla para seleccionar o cambiar mi ruta, para que pueda elegir el camino de progresión apropiado.

#### Acceptance Criteria

1. THE Route_Selection_Screen SHALL mostrar las 4 rutas con nombre, descripción y niveles incluidos
2. THE Route_Selection_Screen SHALL indicar la ruta actual del usuario
3. THE Route_Selection_Screen SHALL deshabilitar rutas no disponibles con explicación de requisitos
4. WHEN el usuario selecciona una ruta disponible, THE Route_Selection_Screen SHALL actualizar la ruta en el store
5. THE Route_Selection_Screen SHALL mostrar confirmación antes de cambiar de ruta
6. THE Route_Selection_Screen SHALL navegar de regreso después de seleccionar ruta

### Requirement 18: Pantalla Assessment Test

**User Story:** Como usuario nuevo, quiero una pantalla de test de evaluación, para que el sistema me recomiende la ruta apropiada.

#### Acceptance Criteria

1. THE Assessment_Test_Screen SHALL mostrar una serie de preguntas sobre experiencia y conocimiento
2. THE Assessment_Test_Screen SHALL calcular un puntaje basado en las respuestas
3. THE Assessment_Test_Screen SHALL recomendar una ruta basada en el puntaje
4. THE Assessment_Test_Screen SHALL permitir aceptar la recomendación o elegir manualmente
5. THE Assessment_Test_Screen SHALL guardar el resultado del test en el perfil del usuario
6. THE Assessment_Test_Screen SHALL navegar a la pantalla principal después de completar

### Requirement 19: Integración con Zustand Store

**User Story:** Como desarrollador, quiero que el sistema de niveles se integre con el Zustand Store existente, para que el estado sea consistente y persistente.

#### Acceptance Criteria

1. THE Level_System SHALL utilizar la acción addExperience del Zustand Store
2. WHEN se gana experiencia, THE Level_System SHALL invocar addExperience con la cantidad correcta
3. THE Level_System SHALL leer el nivel actual desde useGameStore
4. THE Level_System SHALL actualizar levelProgress en el store cuando cambia el nivel o la ruta
5. THE Level_System SHALL garantizar que todos los cambios persisten en AsyncStorage automáticamente

### Requirement 20: Celebración de Level Up

**User Story:** Como usuario, quiero recibir feedback inmediato cuando subo de nivel, para que me sienta motivado y recompensado.

#### Acceptance Criteria

1. WHEN el usuario sube de nivel, THE Level_System SHALL mostrar una animación de celebración
2. THE Level_System SHALL mostrar el nuevo nivel alcanzado con su título
3. THE Level_System SHALL listar las nuevas features desbloqueadas
4. IF el usuario alcanza un nivel hito (5, 10, 15, 20, 25, 30), THEN THE Level_System SHALL mostrar una celebración especial
5. THE Level_System SHALL permitir al usuario cerrar la celebración y continuar

### Requirement 21: Notificación de Cambio de Ruta Disponible

**User Story:** Como usuario, quiero saber cuando puedo cambiar a una ruta más avanzada, para que no pierda la oportunidad de progresar.

#### Acceptance Criteria

1. WHEN el usuario completa el último nivel de su ruta actual, THE Level_System SHALL mostrar una notificación
2. THE Level_System SHALL indicar qué nueva ruta está disponible
3. THE Level_System SHALL incluir un botón para ir directamente a Route_Selection_Screen
4. THE Level_System SHALL permitir posponer el cambio de ruta
5. THE Level_System SHALL recordar que el cambio de ruta está disponible hasta que el usuario lo realice

### Requirement 22: Sincronización con Sistema de Rachas

**User Story:** Como desarrollador, quiero que el sistema de niveles se sincronice con el sistema de rachas, para que la experiencia se otorgue automáticamente.

#### Acceptance Criteria

1. WHEN el usuario completa un pilar, THE Level_System SHALL recibir 50 XP automáticamente
2. WHEN el usuario alcanza un hito de racha, THE Level_System SHALL recibir 100 XP adicionales
3. THE Level_System SHALL detectar level ups causados por completar pilares
4. THE Level_System SHALL mostrar celebración de level up después de completar pilar si aplica
5. THE Level_System SHALL mantener sincronización consistente entre ambos sistemas
