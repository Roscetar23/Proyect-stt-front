/**
 * Script de prueba para el Sistema de Niveles
 * Ejecutar con: node test-level-system.js
 */

// Usar require para CommonJS
const levelSystem = require('./src/modules/levelSystem').default;

console.log('🎮 Probando Sistema de Niveles\n');

// Test 1: Calcular nivel desde experiencia
console.log('📊 Test 1: Calcular Nivel');
const level1 = levelSystem.calculateLevel(0, 'beginner');
const level2 = levelSystem.calculateLevel(500, 'beginner');
const level3 = levelSystem.calculateLevel(5000, 'beginner');
console.log(`  - 0 XP → Nivel ${level1}`);
console.log(`  - 500 XP → Nivel ${level2}`);
console.log(`  - 5000 XP → Nivel ${level3}\n`);

// Test 2: Obtener información de nivel
console.log('📋 Test 2: Información de Nivel');
const levelInfo = levelSystem.getLevelInfo(5, 'beginner');
console.log(`  - Nivel 5: ${levelInfo.title}`);
console.log(`  - XP Requerido: ${levelInfo.experienceRequired}`);
console.log(`  - Features: ${levelInfo.unlockedFeatures.join(', ')}\n`);

// Test 3: Calcular progreso
console.log('📈 Test 3: Progreso hacia Siguiente Nivel');
const progress = levelSystem.calculateProgress(2000, 5, 'beginner');
console.log(`  - Progreso: ${progress.percent.toFixed(1)}%`);
console.log(`  - XP Actual en nivel: ${progress.current}`);
console.log(`  - XP Necesario: ${progress.needed}\n`);

// Test 4: Features desbloqueadas
console.log('🔓 Test 4: Features Desbloqueadas');
const features = levelSystem.getUnlockedFeatures(5, 'beginner');
console.log(`  - Total features: ${features.length}`);
console.log(`  - Features: ${features.join(', ')}\n`);

// Test 5: Cambio de ruta
console.log('🛤️  Test 5: Cambio de Ruta');
const canChange1 = levelSystem.canChangeRoute(10, 'beginner', 'intermediate');
const canChange2 = levelSystem.canChangeRoute(5, 'beginner', 'intermediate');
console.log(`  - Nivel 10 beginner → intermediate: ${canChange1 ? '✅ Sí' : '❌ No'}`);
console.log(`  - Nivel 5 beginner → intermediate: ${canChange2 ? '✅ Sí' : '❌ No'}\n`);

// Test 6: Assessment test
console.log('🎯 Test 6: Test de Evaluación');
const route1 = levelSystem.assessUserLevel({ score: 25 });
const route2 = levelSystem.assessUserLevel({ score: 50 });
const route3 = levelSystem.assessUserLevel({ score: 75 });
const route4 = levelSystem.assessUserLevel({ score: 95 });
console.log(`  - Score 25% → ${route1}`);
console.log(`  - Score 50% → ${route2}`);
console.log(`  - Score 75% → ${route3}`);
console.log(`  - Score 95% → ${route4}\n`);

// Test 7: Información de rutas
console.log('🗺️  Test 7: Información de Rutas');
const routes = levelSystem.getAllRoutes();
Object.keys(routes).forEach(routeId => {
  const route = routes[routeId];
  console.log(`  - ${route.name}: ${route.levels.length} niveles (${route.description})`);
});

console.log('\n✅ Todos los tests completados!');
