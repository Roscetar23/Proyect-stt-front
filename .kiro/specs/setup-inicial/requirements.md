# Requirements Document

## Introduction

Este documento define los requisitos para la Fase 1: Setup Inicial del sistema de gamificación. Esta fase establece la base técnica del proyecto, incluyendo la estructura de carpetas, el estado global con Zustand, el servicio de API mock para desarrollo, y la persistencia local con AsyncStorage. El objetivo es crear una fundación sólida y escalable que permita el desarrollo ágil de las funcionalidades de gamificación en fases posteriores.

## Glossary

- **App**: La aplicación móvil React Native con Expo
- **Zustand_Store**: Sistema de gestión de estado global utilizando la librería Zustand
- **Mock_API_Service**: Servicio que simula un backend real con datos locales para desarrollo
- **AsyncStorage**: Sistema de almacenamiento persistente local de React Native
- **Project_Structure**: Organización de carpetas y archivos del proyecto según arquitectura definida
- **Game_State**: Estado global que contiene datos del usuario, rachas, pilares y logros
- **Storage_Service**: Servicio que encapsula operaciones de AsyncStorage
- **Mock_Data**: Datos de prueba predefinidos para simular usuarios, logros y rutas

## Requirements

### Requirement 1: Estructura de Carpetas del Proyecto

**User Story:** Como desarrollador, quiero una estructura de carpetas organizada y escalable, para que el código sea mantenible y siga las mejores prácticas de arquitectura.

#### Acceptance Criteria

1. THE App SHALL crear la estructura de carpetas src/ con subdirectorios: components/, screens/, hooks/, stores/, services/, modules/, utils/, y data/
2. WITHIN components/, THE App SHALL crear subdirectorios: common/, streak/, level/, y achievement/
3. THE Project_Structure SHALL seguir la organización definida en el documento de arquitectura
4. FOR ALL carpetas creadas, la estructura SHALL ser navegable y accesible desde la raíz del proyecto
5. THE Project_Structure SHALL incluir archivos index.js en cada subdirectorio para facilitar imports

### Requirement 2: Configuración de Zustand Store

**User Story:** Como desarrollador, quiero un sistema de estado global con Zustand, para que pueda gestionar el estado de la aplicación de forma predecible y eficiente.

#### Acceptance Criteria

1. THE Zustand_Store SHALL gestionar el estado global con las propiedades: user, streak, dailyPillar, y achievements
2. THE Zustand_Store SHALL implementar persistencia utilizando el middleware zustand/persist
3. WHEN el estado cambia, THE Zustand_Store SHALL persistir automáticamente los datos en AsyncStorage
4. THE Zustand_Store SHALL incluir acciones: updateStreak, rotatePillar, addExperience, y unlockAchievement
5. WHEN la App se inicia, THE Zustand_Store SHALL cargar el estado persistido desde AsyncStorage
6. THE Zustand_Store SHALL utilizar AsyncStorage como storage engine para la persistencia

### Requirement 3: Mock API Service

**User Story:** Como desarrollador, quiero un servicio de API mock, para que pueda desarrollar y probar funcionalidades sin depender de un backend real.

#### Acceptance Criteria

1. THE Mock_API_Service SHALL simular latencia de red con un delay configurable de 500ms
2. THE Mock_API_Service SHALL implementar métodos: getUserData, updateStreak, getAchievements, y getLevelRoutes
3. WHEN se invoca un método, THE Mock_API_Service SHALL retornar datos mock después del delay simulado
4. THE Mock_API_Service SHALL utilizar datos predefinidos desde el directorio data/
5. THE Mock_API_Service SHALL implementar el patrón Singleton para garantizar una única instancia
6. FOR ALL métodos async, THE Mock_API_Service SHALL retornar Promises que resuelven con datos mock válidos

### Requirement 4: Servicio de Almacenamiento Local

**User Story:** Como desarrollador, quiero un servicio que encapsule AsyncStorage, para que las operaciones de persistencia sean consistentes y fáciles de mantener.

#### Acceptance Criteria

1. THE Storage_Service SHALL encapsular operaciones de AsyncStorage: getItem, setItem, removeItem, y clear
2. WHEN se almacenan datos, THE Storage_Service SHALL serializar objetos JavaScript a JSON
3. WHEN se recuperan datos, THE Storage_Service SHALL deserializar JSON a objetos JavaScript
4. IF una operación de almacenamiento falla, THEN THE Storage_Service SHALL registrar el error y retornar null
5. THE Storage_Service SHALL implementar manejo de errores para todas las operaciones async
6. THE Storage_Service SHALL utilizar claves con prefijo consistente para evitar colisiones

### Requirement 5: Datos Mock Iniciales

**User Story:** Como desarrollador, quiero datos mock predefinidos, para que pueda probar la aplicación con datos realistas durante el desarrollo.

#### Acceptance Criteria

1. THE Mock_Data SHALL incluir al menos 2 usuarios de ejemplo con propiedades completas
2. THE Mock_Data SHALL incluir al menos 10 logros de diferentes categorías: streak, level, pillar, y special
3. THE Mock_Data SHALL incluir las 4 rutas de nivel: beginner, intermediate, advanced, y expert
4. FOR ALL usuarios mock, los datos SHALL incluir: id, name, level, experience, currentStreak, longestStreak, selectedRoute, completedAchievements, y stats
5. FOR ALL logros mock, los datos SHALL incluir: id, title, description, icon, category, requirement, y unlockedAt
6. THE Mock_Data SHALL estar organizado en archivos separados: mockUsers.js, mockAchievements.js, y mockRoutes.js

### Requirement 6: Configuración de Dependencias

**User Story:** Como desarrollador, quiero que todas las dependencias necesarias estén instaladas y configuradas, para que pueda comenzar a desarrollar sin problemas de configuración.

#### Acceptance Criteria

1. THE App SHALL incluir zustand como dependencia en package.json
2. THE App SHALL incluir @react-native-async-storage/async-storage como dependencia
3. THE App SHALL incluir expo-notifications como dependencia para futuras fases
4. WHEN se ejecuta npm install, THE App SHALL instalar todas las dependencias sin errores
5. THE App SHALL documentar las versiones específicas de cada dependencia en package.json

### Requirement 7: Integración de Store con AsyncStorage

**User Story:** Como usuario, quiero que mis datos persistan entre sesiones, para que no pierda mi progreso al cerrar la aplicación.

#### Acceptance Criteria

1. WHEN el usuario cierra la App, THE Zustand_Store SHALL guardar el estado completo en AsyncStorage
2. WHEN el usuario abre la App, THE Zustand_Store SHALL restaurar el estado desde AsyncStorage
3. IF no existe estado persistido, THEN THE Zustand_Store SHALL inicializar con valores por defecto
4. THE Zustand_Store SHALL utilizar la clave 'game-storage' para almacenar el estado
5. WHEN el estado se restaura, THE Zustand_Store SHALL validar la estructura de datos antes de aplicarla

### Requirement 8: Configuración de Toggle Mock/Real API

**User Story:** Como desarrollador, quiero poder alternar entre API mock y real, para que la transición a backend real sea sencilla en el futuro.

#### Acceptance Criteria

1. THE App SHALL incluir una constante USE_MOCK configurable en el servicio de API
2. WHEN USE_MOCK es true, THE App SHALL utilizar Mock_API_Service
3. WHEN USE_MOCK es false, THE App SHALL preparar la estructura para llamadas a API real
4. THE App SHALL incluir API_BASE_URL configurable según entorno de desarrollo o producción
5. THE App SHALL documentar cómo cambiar entre modo mock y modo real en comentarios del código

### Requirement 9: Utilidades de Fecha y Cálculos

**User Story:** Como desarrollador, quiero funciones utilitarias para fechas y cálculos, para que las operaciones comunes sean reutilizables y consistentes.

#### Acceptance Criteria

1. THE App SHALL incluir utilidades de fecha: getCurrentDate, isToday, isSameDay, y getDaysDifference
2. THE App SHALL incluir utilidades de cálculo: calculateExperience, calculateLevel, y calculateProgress
3. THE App SHALL incluir constantes del sistema en utils/constants.js
4. FOR ALL funciones utilitarias, THE App SHALL incluir documentación JSDoc
5. THE App SHALL exportar todas las utilidades desde archivos index.js para facilitar imports

### Requirement 10: Validación de Setup Inicial

**User Story:** Como desarrollador, quiero validar que el setup inicial está completo y funcional, para que pueda comenzar a desarrollar funcionalidades con confianza.

#### Acceptance Criteria

1. THE App SHALL poder importar y utilizar Zustand_Store sin errores
2. THE App SHALL poder invocar métodos de Mock_API_Service y recibir datos mock
3. THE App SHALL poder persistir y recuperar datos usando Storage_Service
4. THE App SHALL poder acceder a Mock_Data desde cualquier parte del código
5. WHEN se ejecuta la App, THE App SHALL inicializar sin errores de configuración o dependencias faltantes
