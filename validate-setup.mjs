// Script de validación para Checkpoint Tarea 5
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Validando servicios base...\n');

let allTestsPassed = true;

// Test 1: Verificar estructura de archivos
console.log('✓ Test 1: Verificando estructura de archivos...');
const requiredFiles = [
  'src/services/index.js',
  'src/services/storageService.js',
  'src/services/mockAPI.js',
  'src/data/index.js',
  'src/data/mockUsers.js',
  'src/data/mockAchievements.js',
  'src/data/mockRoutes.js'
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    console.log(`  ❌ Archivo faltante: ${file}`);
    allTestsPassed = false;
  }
}

if (allTestsPassed) {
  console.log('  ✅ Todos los archivos requeridos existen\n');
}

// Test 2: Verificar exportaciones de servicios
console.log('✓ Test 2: Verificando exportaciones de servicios...');
try {
  const servicesIndex = readFileSync('src/services/index.js', 'utf-8');
  
  if (servicesIndex.includes('export') && 
      servicesIndex.includes('storageService') && 
      servicesIndex.includes('mockAPI')) {
    console.log('  ✅ index.js exporta storageService y mockAPI correctamente');
  } else {
    console.log('  ❌ index.js no tiene las exportaciones correctas');
    allTestsPassed = false;
  }
  
  const storageService = readFileSync('src/services/storageService.js', 'utf-8');
  if (storageService.includes('export default') && 
      storageService.includes('class StorageService')) {
    console.log('  ✅ storageService.js tiene export default y clase StorageService');
  } else {
    console.log('  ❌ storageService.js no tiene la estructura correcta');
    allTestsPassed = false;
  }
  
  const mockAPI = readFileSync('src/services/mockAPI.js', 'utf-8');
  if (mockAPI.includes('export default') && 
      mockAPI.includes('getUserData') &&
      mockAPI.includes('getAchievements') &&
      mockAPI.includes('getLevelRoutes') &&
      mockAPI.includes('updateStreak')) {
    console.log('  ✅ mockAPI.js tiene export default y todos los métodos requeridos\n');
  } else {
    console.log('  ❌ mockAPI.js no tiene todos los métodos requeridos');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error leyendo archivos de servicios:', error.message);
  allTestsPassed = false;
}

// Test 3: Verificar datos mock
console.log('✓ Test 3: Verificando datos mock...');
try {
  const dataIndex = readFileSync('src/data/index.js', 'utf-8');
  
  if (dataIndex.includes('export') && 
      dataIndex.includes('mockUsers') && 
      dataIndex.includes('mockAchievements') &&
      dataIndex.includes('mockRoutes')) {
    console.log('  ✅ data/index.js exporta mockUsers, mockAchievements y mockRoutes');
  } else {
    console.log('  ❌ data/index.js no tiene las exportaciones correctas');
    allTestsPassed = false;
  }
  
  const mockUsers = readFileSync('src/data/mockUsers.js', 'utf-8');
  const usersMatch = mockUsers.match(/export const mockUsers = \[([\s\S]*?)\];/);
  if (usersMatch && mockUsers.includes('user-001') && mockUsers.includes('Ana García')) {
    console.log('  ✅ mockUsers.js contiene datos de usuario correctos');
  } else {
    console.log('  ❌ mockUsers.js no tiene la estructura correcta');
    allTestsPassed = false;
  }
  
  const mockAchievements = readFileSync('src/data/mockAchievements.js', 'utf-8');
  if (mockAchievements.includes('export const mockAchievements') && 
      mockAchievements.includes('first_week')) {
    console.log('  ✅ mockAchievements.js contiene datos de logros correctos');
  } else {
    console.log('  ❌ mockAchievements.js no tiene la estructura correcta');
    allTestsPassed = false;
  }
  
  const mockRoutes = readFileSync('src/data/mockRoutes.js', 'utf-8');
  if (mockRoutes.includes('export const mockRoutes') && 
      mockRoutes.includes('beginner')) {
    console.log('  ✅ mockRoutes.js contiene datos de rutas correctos\n');
  } else {
    console.log('  ❌ mockRoutes.js no tiene la estructura correcta');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error leyendo archivos de datos:', error.message);
  allTestsPassed = false;
}

// Test 4: Verificar métodos de StorageService
console.log('✓ Test 4: Verificando métodos de StorageService...');
try {
  const storageService = readFileSync('src/services/storageService.js', 'utf-8');
  const requiredMethods = ['setItem', 'getItem', 'removeItem', 'clear', 'getAllKeys'];
  
  let allMethodsPresent = true;
  for (const method of requiredMethods) {
    if (!storageService.includes(`async ${method}(`)) {
      console.log(`  ❌ Método faltante: ${method}`);
      allMethodsPresent = false;
      allTestsPassed = false;
    }
  }
  
  if (allMethodsPresent) {
    console.log('  ✅ StorageService tiene todos los métodos requeridos (setItem, getItem, removeItem, clear, getAllKeys)\n');
  }
} catch (error) {
  console.log('  ❌ Error verificando StorageService:', error.message);
  allTestsPassed = false;
}

// Test 5: Verificar métodos de MockAPI
console.log('✓ Test 5: Verificando métodos de MockAPI...');
try {
  const mockAPI = readFileSync('src/services/mockAPI.js', 'utf-8');
  const requiredMethods = ['getUserData', 'getAchievements', 'getLevelRoutes', 'updateStreak'];
  
  let allMethodsPresent = true;
  for (const method of requiredMethods) {
    if (!mockAPI.includes(`async ${method}(`)) {
      console.log(`  ❌ Método faltante: ${method}`);
      allMethodsPresent = false;
      allTestsPassed = false;
    }
  }
  
  if (allMethodsPresent) {
    console.log('  ✅ MockAPI tiene todos los métodos requeridos (getUserData, getAchievements, getLevelRoutes, updateStreak)\n');
  }
} catch (error) {
  console.log('  ❌ Error verificando MockAPI:', error.message);
  allTestsPassed = false;
}

// Resultado final
if (allTestsPassed) {
  console.log('🎉 ¡Todos los tests pasaron exitosamente!');
  console.log('✅ Storage Service y Mock API Service están correctamente estructurados\n');
  console.log('📝 Nota: Este script valida la estructura del código.');
  console.log('   Para pruebas funcionales completas, ejecuta la app en Expo.\n');
  process.exit(0);
} else {
  console.log('❌ Algunos tests fallaron. Revisa los errores arriba.\n');
  process.exit(1);
}
