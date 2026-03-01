# Level System Module

Sistema de gestión de niveles y progresión tipo RPG para el sistema de gamificación.

## 🎯 Características

- **4 Rutas de Progresión**: Beginner, Intermediate, Advanced, Expert
- **30 Niveles Totales**: 10 + 10 + 5 + 5 distribuidos en las rutas
- **Sistema de Experiencia**: Gana XP por completar actividades
- **Features Desbloqueables**: Funcionalidades que se activan al subir de nivel
- **Validación Robusta**: Manejo seguro de entradas inválidas
- **Test de Evaluación**: Recomienda ruta según habilidad del usuario

## 📦 Estructura

```
src/modules/levelSystem/
├── index.js                    # Clase principal LevelSystem (singleton)
├── routes.js                   # Definiciones de las 4 rutas
├── validators.js               # Funciones de validación
├── experienceCalculator.js     # Cálculos de XP
└── README.md                   # Esta documentación
```

## 🚀 Uso Básico

```javascript
import { levelSystem } from '../modules';

// Calcular nivel desde experiencia
const level = levelSystem.calculateLevel(500, 'beginner');
console.log(level); // 3

// Obtener información de un nivel
const info = levelSystem.getLevelInfo(5, 'beginner');
console.log(info);
// {
//   level: 5,
//   experienceRequired: 1600,
//   title: 'Dedicado',
//   unlockedFeatures: ['achievement_badges']
// }

// Calcular progreso hacia siguiente nivel
const progress = levelSystem.calculateProgress(2000, 5, 'beginner');
console.log(progress);
// {
//   percent: 44.4,
//   current: 400,
//   needed: 900
// }

// Obtener features desbloqueadas
const features = levelSystem.getUnlockedFeatures(5, 'beginner');
console.log(features);
// ['basic_tracking', 'daily_tips', 'weekly_summary', 'custom_goals', 'achievement_badges']

// Verificar si puede cambiar de ruta
const canChange = levelSystem.canChangeRoute(10, 'beginner', 'intermediate');
console.log(canChange); // true

// Evaluar nivel del usuario
const route = levelSystem.assessUserLevel({ score: 75 });
console.log(route); // 'advanced'
```

## 🎮 Rutas Disponibles

### Beginner (Niveles 1-10)
- **Color**: Verde (#4CAF50)
- **Descripción**: Para quienes comienzan su viaje de bienestar
- **XP Requerido**: 0 - 8,100
- **Features**: 10 funcionalidades básicas

### Intermediate (Niveles 11-20)
- **Color**: Azul (#2196F3)
- **Descripción**: Para quienes tienen experiencia en hábitos saludables
- **XP Requerido**: 10,000 - 36,100
- **Features**: 10 funcionalidades intermedias

### Advanced (Niveles 21-25)
- **Color**: Morado (#9C27B0)
- **Descripción**: Para expertos en optimización de bienestar
- **XP Requerido**: 40,000 - 57,600
- **Features**: 5 funcionalidades avanzadas

### Expert (Niveles 26-30)
- **Color**: Naranja (#FF9800)
- **Descripción**: Para maestros del bienestar integral
- **XP Requerido**: 62,500 - 84,100
- **Features**: 5 funcionalidades expertas

## 💰 Sistema de Experiencia

| Acción | XP Otorgado |
|--------|-------------|
| Completar un pilar | 50 XP |
| Hito de racha (7, 30, 100 días) | 100 XP |
| Desbloquear un logro | 75 XP |

## 🔄 Cambio de Ruta

Para cambiar de ruta, el usuario debe:
1. Completar el último nivel de su ruta actual
2. La nueva ruta debe ser la siguiente en secuencia

**Niveles de completación:**
- Beginner → Intermediate: Nivel 10
- Intermediate → Advanced: Nivel 20
- Advanced → Expert: Nivel 25

## 🧪 Testing

Ejecuta el script de prueba:

```bash
node test-level-system.js
```

O ejecuta los tests unitarios:

```bash
npm test -- __tests__/unit/modules/levelSystem.test.js
```

## 📊 API Reference

### `calculateLevel(experience, route)`
Calcula el nivel actual basado en experiencia y ruta.

**Parámetros:**
- `experience` (number): Experiencia total del usuario
- `route` (string): Ruta actual ('beginner', 'intermediate', 'advanced', 'expert')

**Retorna:** (number) Nivel actual

### `getLevelInfo(level, route)`
Obtiene información detallada de un nivel específico.

**Parámetros:**
- `level` (number): Número de nivel
- `route` (string): Ruta actual

**Retorna:** (object|null) Información del nivel o null si no existe

### `getExperienceForNextLevel(currentLevel, route)`
Obtiene la experiencia necesaria para el siguiente nivel.

**Parámetros:**
- `currentLevel` (number): Nivel actual
- `route` (string): Ruta actual

**Retorna:** (number) XP requerido para siguiente nivel (0 si está en nivel máximo)

### `calculateProgress(currentExp, currentLevel, route)`
Calcula el progreso hacia el siguiente nivel.

**Parámetros:**
- `currentExp` (number): Experiencia actual
- `currentLevel` (number): Nivel actual
- `route` (string): Ruta actual

**Retorna:** (object) `{ percent, current, needed }`

### `getUnlockedFeatures(level, route)`
Obtiene todas las features desbloqueadas hasta el nivel actual.

**Parámetros:**
- `level` (number): Nivel actual
- `route` (string): Ruta actual

**Retorna:** (string[]) Array de IDs de features

### `canChangeRoute(currentLevel, currentRoute, targetRoute)`
Verifica si el usuario puede cambiar de ruta.

**Parámetros:**
- `currentLevel` (number): Nivel actual
- `currentRoute` (string): Ruta actual
- `targetRoute` (string): Ruta objetivo

**Retorna:** (boolean) true si puede cambiar

### `assessUserLevel(testResults)`
Evalúa el nivel del usuario basado en resultados de test.

**Parámetros:**
- `testResults` (object): `{ score: number }` (0-100)

**Retorna:** (string) Ruta recomendada

### `getRouteInfo(route)`
Obtiene información de una ruta específica.

**Parámetros:**
- `route` (string): ID de la ruta

**Retorna:** (object|null) Información de la ruta

### `getAllRoutes()`
Obtiene todas las rutas disponibles.

**Retorna:** (object) Todas las rutas

## ✅ Estado de Implementación

- [x] Estructura del módulo
- [x] Cálculo de niveles
- [x] Información de niveles
- [x] Sistema de experiencia
- [x] Progreso hacia siguiente nivel
- [x] Features desbloqueadas
- [x] Cambio de ruta
- [x] Test de evaluación
- [x] Validaciones
- [x] Tests unitarios
- [ ] Integración con Zustand Store
- [ ] Componentes de UI
- [ ] Pantallas
- [ ] Celebraciones de level up

## 📝 Notas

- El sistema usa un patrón Singleton para garantizar una única instancia
- Todas las entradas son validadas para evitar errores
- Los valores inválidos se manejan con defaults seguros
- El sistema es completamente funcional y listo para integrar con la UI
