# Sistema de Rachas - Guía de Uso

## Descripción General

El Sistema de Rachas es un módulo de gamificación que rastrea y gestiona rachas de completación de pilares diarios. Los usuarios deben completar un pilar cada día (Nutrición, Sueño, o Movimiento) para mantener su racha activa.

## Arquitectura

### Componentes Principales

1. **StreakManager** (`src/modules/streakManager/`)
   - Módulo central que encapsula la lógica de rachas
   - Calcula rachas actuales y verifica estado activo
   - Gestiona rotación de pilares con múltiples estrategias

2. **Zustand Store** (`src/stores/gameStore.js`)
   - Gestiona el estado global de rachas
   - Persiste datos en AsyncStorage automáticamente
   - Acciones: `updateStreak`, `rotatePillar`, `addExperience`

3. **Componentes UI** (`src/components/streak/`)
   - `StreakCounter`: Muestra el contador de racha con emoji 🔥
   - `PillarCard`: Tarjeta del pilar del día con progreso
   - `StreakCalendar`: Calendario visual de historial
   - `StreakStats`: Estadísticas de rachas

4. **Pantallas** (`src/screens/`)
   - `StreakHomeScreen`: Pantalla principal de rachas
   - `StreakHistoryScreen`: Historial detallado
   - `PillarSelectionScreen`: Selección manual de pilar

5. **Hooks Personalizados** (`src/hooks/`)
   - `useStreak`: Acceso a estado y acciones de rachas
   - `usePillarRotation`: Rotación automática de pilares

## Uso Básico

### 1. Inicializar el Sistema

```javascript
import { useGameStore } from './stores/gameStore';

// Inicializar usuario
useGameStore.getState().initializeUser({
  id: 'user-001',
  name: 'Usuario',
  level: 1,
  experience: 0,
  currentStreak: 0,
  longestStreak: 0,
  stats: {
    nutrition: 50,
    sleep: 50,
    movement: 50
  }
});

// Inicializar streak
useGameStore.setState({
  streak: {
    id: 'streak-001',
    userId: 'user-001',
    currentCount: 0,
    lastCompletedDate: null,
    pillarHistory: []
  }
});

// Rotar al primer pilar
useGameStore.getState().rotatePillar(false);
```

### 2. Mostrar Contador de Racha

```javascript
import { StreakCounter } from './components/streak';

function MyScreen() {
  return (
    <View>
      <StreakCounter size="large" />
    </View>
  );
}
```

### 3. Mostrar Pilar del Día

```javascript
import { PillarCard } from './components/streak';

function MyScreen() {
  const handleComplete = () => {
    console.log('¡Pilar completado!');
  };

  return (
    <PillarCard onComplete={handleComplete} />
  );
}
```

### 4. Completar un Pilar

```javascript
import { useGameStore } from './stores/gameStore';

function completePillar() {
  const store = useGameStore.getState();
  const dailyPillar = store.dailyPillar;
  
  // Simular progreso completo
  useGameStore.setState({
    dailyPillar: {
      ...dailyPillar,
      progress: dailyPillar.target.value
    }
  });
  
  // Actualizar racha
  store.updateStreak(true);
}
```

### 5. Selección Manual de Pilar

```javascript
import { useGameStore } from './stores/gameStore';
import { PILLARS } from './utils/constants';

function selectPillar() {
  const store = useGameStore.getState();
  
  // Seleccionar pilar manualmente
  store.rotatePillar(true, PILLARS.SLEEP);
}
```

### 6. Usar Hook de Racha

```javascript
import { useStreak } from './hooks';

function MyComponent() {
  const {
    currentStreak,
    longestStreak,
    isActive,
    dailyPillar,
    pillarHistory,
    completePillar,
    selectPillar
  } = useStreak();
  
  return (
    <View>
      <Text>Racha Actual: {currentStreak}</Text>
      <Text>Racha Más Larga: {longestStreak}</Text>
      <Text>Estado: {isActive ? 'Activa' : 'Inactiva'}</Text>
    </View>
  );
}
```

### 7. Rotación Automática

```javascript
import { usePillarRotation } from './hooks';

function MyScreen() {
  // Este hook automáticamente rota el pilar a medianoche
  usePillarRotation();
  
  return <View>...</View>;
}
```

## Estrategias de Rotación

### Round-Robin (Por Defecto)

Rota pilares en secuencia: Nutrición → Sueño → Movimiento → Nutrición

```javascript
store.rotatePillar(false, null, 'round-robin');
```

### Stats-Based

Selecciona el pilar con menor estadística del usuario

```javascript
store.rotatePillar(false, null, 'stats-based');
```

### Weighted-Random

Selección aleatoria ponderada por estadísticas inversas (menor stat = mayor probabilidad)

```javascript
store.rotatePillar(false, null, 'weighted-random');
```

## Estructura de Datos

### DailyPillar

```javascript
{
  date: '2024-02-16T00:00:00.000Z',
  pillar: 'nutrition', // 'nutrition' | 'sleep' | 'movement'
  isManuallySet: false,
  target: {
    type: 'meals',
    value: 3,
    unit: 'comidas saludables'
  },
  progress: 0,
  completed: false
}
```

### Streak

```javascript
{
  id: 'streak-001',
  userId: 'user-001',
  currentCount: 7,
  lastCompletedDate: '2024-02-15T22:30:00.000Z',
  pillarHistory: [
    {
      date: '2024-02-15T00:00:00.000Z',
      pillar: 'nutrition',
      completed: true,
      metrics: {
        progress: 3,
        target: { value: 3 }
      }
    }
  ]
}
```

## API del StreakManager

### calculateCurrentStreak(pillarHistory)

Calcula la racha actual basándose en el historial de pilares.

**Parámetros:**
- `pillarHistory` (Array): Historial de completaciones

**Retorna:**
- `number`: Conteo de racha actual

**Ejemplo:**
```javascript
import streakManager from './modules/streakManager';

const history = [
  { date: '2024-02-13', pillar: 'nutrition', completed: true },
  { date: '2024-02-14', pillar: 'sleep', completed: true },
  { date: '2024-02-15', pillar: 'movement', completed: true }
];

const streak = streakManager.calculateCurrentStreak(history);
// streak = 3
```

### isStreakActive(lastCompletedDate)

Verifica si la racha está activa (última completación dentro de 24 horas).

**Parámetros:**
- `lastCompletedDate` (string): Fecha ISO de última completación

**Retorna:**
- `boolean`: true si la racha está activa

**Ejemplo:**
```javascript
const isActive = streakManager.isStreakActive('2024-02-15T22:30:00.000Z');
// isActive = true (si dentro de 24h)
```

### validateCompletion(pillar, dailyPillar)

Valida que el pilar completado coincide con el pilar del día.

**Parámetros:**
- `pillar` (string): Pilar siendo completado
- `dailyPillar` (object): Objeto del pilar del día

**Retorna:**
- `boolean`: true si la completación es válida

**Ejemplo:**
```javascript
const isValid = streakManager.validateCompletion('nutrition', {
  pillar: 'nutrition',
  date: '2024-02-15'
});
// isValid = true
```

### rotatePillar(manual, selectedPillar, strategy, userStats, pillarHistory)

Rota el pilar del día (automático o manual).

**Parámetros:**
- `manual` (boolean): Si es rotación manual
- `selectedPillar` (string): Pilar seleccionado (para manual)
- `strategy` (string): Estrategia de rotación (para automático)
- `userStats` (object): Estadísticas del usuario
- `pillarHistory` (Array): Historial de pilares

**Retorna:**
- `object`: Nuevo objeto DailyPillar

**Ejemplo:**
```javascript
const newPillar = streakManager.rotatePillar(
  false, // automático
  null,
  'round-robin',
  { nutrition: 50, sleep: 50, movement: 50 },
  []
);
```

## Componentes UI

### StreakCounter

Muestra el contador de racha con emoji de fuego.

**Props:**
- `size` (string): 'small' | 'medium' | 'large' (default: 'medium')
- `style` (object): Estilos personalizados

**Ejemplo:**
```javascript
<StreakCounter size="large" style={{ marginTop: 20 }} />
```

### PillarCard

Muestra el pilar del día con progreso y botón de completación.

**Props:**
- `onComplete` (function): Callback cuando se completa el pilar
- `style` (object): Estilos personalizados

**Ejemplo:**
```javascript
<PillarCard 
  onComplete={() => console.log('Completado!')}
  style={{ margin: 16 }}
/>
```

### StreakCalendar

Muestra calendario visual del historial de rachas.

**Props:**
- `daysToShow` (number): Número de días a mostrar (default: 30)
- `style` (object): Estilos personalizados

**Ejemplo:**
```javascript
<StreakCalendar daysToShow={30} />
```

### StreakStats

Muestra estadísticas de rachas.

**Props:**
- `style` (object): Estilos personalizados

**Ejemplo:**
```javascript
<StreakStats style={{ margin: 16 }} />
```

## Pantallas

### StreakHomeScreen

Pantalla principal que muestra:
- Contador de racha
- Pilar del día con progreso
- Estadísticas resumidas
- Navegación a historial y selección

**Navegación:**
```javascript
navigation.navigate('StreakHome');
```

### StreakHistoryScreen

Pantalla de historial que muestra:
- Calendario de últimos 30 días
- Estadísticas detalladas
- Resumen de días completados

**Navegación:**
```javascript
navigation.navigate('StreakHistory');
```

### PillarSelectionScreen

Pantalla de selección manual que muestra:
- 3 pilares disponibles
- Indicador del pilar actual
- Descripción de cada pilar

**Navegación:**
```javascript
navigation.navigate('PillarSelection');
```

## Hooks Personalizados

### useStreak

Hook para acceder a estado y acciones de rachas.

**Retorna:**
```javascript
{
  currentStreak: number,
  longestStreak: number,
  isActive: boolean,
  dailyPillar: object,
  pillarHistory: Array,
  completePillar: (pillar: string) => boolean,
  selectPillar: (pillar: string) => void
}
```

### usePillarRotation

Hook para rotación automática de pilares. Se ejecuta automáticamente al montar el componente y verifica cada minuto si es necesario rotar.

**Retorna:**
```javascript
{
  dailyPillar: object,
  needsRotation: boolean
}
```

## Manejo de Errores

El sistema implementa manejo de errores en múltiples capas:

1. **Validación de Inputs**: Todos los métodos validan sus parámetros
2. **Valores por Defecto**: Retorna valores seguros en caso de error
3. **Logging**: Registra errores en consola para debugging
4. **Recuperación Graceful**: El sistema continúa funcionando con datos parciales

**Ejemplo:**
```javascript
try {
  const streak = streakManager.calculateCurrentStreak(invalidHistory);
  // Retorna 0 en lugar de lanzar error
} catch (error) {
  console.error('Error:', error);
}
```

## Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests específicos
npm test -- __tests__/integration/streakFlow.test.js

# Con cobertura
npm test -- --coverage
```

### Cobertura Actual

- **StreakManager**: 85.83% ✓
- **Strategies**: 97.67% ✓
- **Store Integration**: 75.55%

## Mejores Prácticas

1. **Siempre usar hooks**: Preferir `useStreak` y `usePillarRotation` sobre acceso directo al store
2. **Validar completación**: Verificar que el progreso alcanza el target antes de completar
3. **Manejar estados de carga**: Verificar que `dailyPillar` existe antes de renderizar
4. **Persistencia automática**: El store persiste automáticamente en AsyncStorage
5. **Rotación protegida**: El store previene rotaciones duplicadas en el mismo día

## Troubleshooting

### La racha no se actualiza

**Problema**: La racha permanece en 0 después de completar pilares.

**Solución**: Verificar que:
1. El pilar tiene `progress >= target.value`
2. Se llama a `updateStreak(true)` después de completar
3. El historial se está guardando correctamente

### El pilar no rota automáticamente

**Problema**: El pilar no cambia a medianoche.

**Solución**: Verificar que:
1. Se está usando el hook `usePillarRotation`
2. El componente permanece montado
3. No hay errores en la consola

### La selección manual no funciona

**Problema**: No se puede cambiar el pilar manualmente.

**Solución**: Verificar que:
1. El pilar actual no está completado
2. Se pasa `manual=true` a `rotatePillar`
3. El pilar seleccionado es válido ('nutrition', 'sleep', 'movement')

## Recursos Adicionales

- **Documentación de Diseño**: `.kiro/specs/sistema-rachas/design.md`
- **Requisitos**: `.kiro/specs/sistema-rachas/requirements.md`
- **Tests de Integración**: `__tests__/integration/streakFlow.test.js`
- **Tests Unitarios**: `__tests__/unit/modules/streakManager.test.js`

## Soporte

Para preguntas o problemas, consultar:
1. Tests de integración para ejemplos de uso
2. Documentación de diseño para detalles técnicos
3. Código fuente con comentarios JSDoc
