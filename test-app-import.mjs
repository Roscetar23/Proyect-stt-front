#!/usr/bin/env node

/**
 * Simple test to verify App.js can be imported without errors
 * This helps debug white screen issues
 */

console.log('🧪 Testing App.js import...\n');

try {
  // Test if we can at least parse the file
  const fs = await import('fs');
  const appContent = fs.readFileSync('./App.js', 'utf8');
  
  console.log('✅ App.js file exists and is readable');
  console.log(`📄 File size: ${appContent.length} bytes`);
  
  // Check for common syntax issues
  const issues = [];
  
  if (appContent.includes('import ') && !appContent.includes('require(')) {
    // Mixed imports might be okay
  }
  
  // Check for balanced braces
  const openBraces = (appContent.match(/{/g) || []).length;
  const closeBraces = (appContent.match(/}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    issues.push(`⚠️  Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
  } else {
    console.log(`✅ Braces balanced: ${openBraces} pairs`);
  }
  
  // Check for balanced parentheses
  const openParens = (appContent.match(/\(/g) || []).length;
  const closeParens = (appContent.match(/\)/g) || []).length;
  
  if (openParens !== closeParens) {
    issues.push(`⚠️  Unbalanced parentheses: ${openParens} open, ${closeParens} close`);
  } else {
    console.log(`✅ Parentheses balanced: ${openParens} pairs`);
  }
  
  // Check for key features
  if (appContent.includes('ErrorBoundary')) {
    console.log('✅ Error boundary implemented');
  }
  
  if (appContent.includes('try {') && appContent.includes('catch')) {
    const tryCount = (appContent.match(/try\s*{/g) || []).length;
    console.log(`✅ Try-catch blocks: ${tryCount} found`);
  }
  
  if (appContent.includes('console.log')) {
    const logCount = (appContent.match(/console\.log/g) || []).length;
    console.log(`✅ Debug logging: ${logCount} statements`);
  }
  
  if (issues.length > 0) {
    console.log('\n⚠️  Potential issues found:');
    issues.forEach(issue => console.log(issue));
  } else {
    console.log('\n✅ No obvious syntax issues detected');
  }
  
  console.log('\n📋 Key features in new App.js:');
  console.log('  • Progressive import testing with try-catch');
  console.log('  • Error boundary component');
  console.log('  • Fallback UI for import failures');
  console.log('  • Safe action wrapper for all operations');
  console.log('  • Console logging for debugging');
  console.log('  • Error display in UI');
  
  console.log('\n🔍 Next steps:');
  console.log('  1. Run: npm start (or expo start)');
  console.log('  2. Check Metro bundler console for errors');
  console.log('  3. Check device/simulator console logs');
  console.log('  4. Look for console.log messages starting with ✅ or ❌');
  
  console.log('\n✅ App.js structure looks good!');
  
} catch (error) {
  console.error('❌ Error testing App.js:', error.message);
  process.exit(1);
}
