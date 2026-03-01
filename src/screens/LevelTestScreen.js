import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { levelSystem } from '../modules';

/**
 * Pantalla de prueba para visualizar el Sistema de Niveles
 * Esta es una pantalla temporal para testing - NO es la UI final
 */
export default function LevelTestScreen() {
  const [experience, setExperience] = useState('500');
  const [route, setRoute] = useState('beginner');
  const [testScore, setTestScore] = useState('50');

  const currentLevel = levelSystem.calculateLevel(parseInt(experience) || 0, route);
  const levelInfo = levelSystem.getLevelInfo(currentLevel, route);
  const progress = levelSystem.calculateProgress(parseInt(experience) || 0, currentLevel, route);
  const features = levelSystem.getUnlockedFeatures(currentLevel, route);
  const routeInfo = levelSystem.getRouteInfo(route);

  const routes = ['beginner', 'intermediate', 'advanced', 'expert'];
  const routeColors = {
    beginner: '#4CAF50',
    intermediate: '#2196F3',
    advanced: '#9C27B0',
    expert: '#FF9800'
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎮 Sistema de Niveles - Test</Text>
      
      {/* Selector de Ruta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seleccionar Ruta</Text>
        <View style={styles.routeButtons}>
          {routes.map(r => (
            <TouchableOpacity
              key={r}
              style={[
                styles.routeButton,
                { backgroundColor: routeColors[r] },
                route === r && styles.routeButtonActive
              ]}
              onPress={() => setRoute(r)}
            >
              <Text style={styles.routeButtonText}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Input de Experiencia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiencia (XP)</Text>
        <TextInput
          style={styles.input}
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
          placeholder="Ingresa XP"
        />
        <View style={styles.xpButtons}>
          <TouchableOpacity
            style={styles.xpButton}
            onPress={() => setExperience(String(parseInt(experience || 0) + 50))}
          >
            <Text style={styles.xpButtonText}>+50 XP (Pilar)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.xpButton}
            onPress={() => setExperience(String(parseInt(experience || 0) + 100))}
          >
            <Text style={styles.xpButtonText}>+100 XP (Hito)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Información de Ruta */}
      <View style={[styles.section, { backgroundColor: routeColors[route] + '20' }]}>
        <Text style={styles.sectionTitle}>📍 Ruta Actual</Text>
        <Text style={styles.routeName}>{routeInfo?.name}</Text>
        <Text style={styles.routeDescription}>{routeInfo?.description}</Text>
        <Text style={styles.routeLevels}>
          Niveles: {routeInfo?.levels[0].level} - {routeInfo?.levels[routeInfo.levels.length - 1].level}
        </Text>
      </View>

      {/* Nivel Actual */}
      <View style={[styles.section, styles.levelCard]}>
        <View style={styles.levelHeader}>
          <View style={[styles.levelBadge, { backgroundColor: routeColors[route] }]}>
            <Text style={styles.levelNumber}>{currentLevel}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>{levelInfo?.title || 'N/A'}</Text>
            <Text style={styles.levelXP}>
              {levelInfo?.experienceRequired || 0} XP requerido
            </Text>
          </View>
        </View>
      </View>

      {/* Barra de Progreso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Progreso al Siguiente Nivel</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress.percent}%`,
                  backgroundColor: routeColors[route]
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress.percent)}% - {Math.round(progress.current)} / {Math.round(progress.needed)} XP
          </Text>
        </View>
        <Text style={styles.progressDetail}>
          Faltan {Math.round(progress.needed - progress.current)} XP para nivel {currentLevel + 1}
        </Text>
      </View>

      {/* Features Desbloqueadas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔓 Features Desbloqueadas ({features.length})</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureChip}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Test de Evaluación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Test de Evaluación</Text>
        <TextInput
          style={styles.input}
          value={testScore}
          onChangeText={setTestScore}
          keyboardType="numeric"
          placeholder="Puntaje (0-100)"
        />
        <Text style={styles.testResult}>
          Ruta recomendada: {levelSystem.assessUserLevel({ score: parseInt(testScore) || 0 })}
        </Text>
      </View>

      {/* Cambio de Ruta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛤️ Cambio de Ruta</Text>
        {routes.map(targetRoute => {
          if (targetRoute === route) return null;
          const canChange = levelSystem.canChangeRoute(currentLevel, route, targetRoute);
          return (
            <View key={targetRoute} style={styles.routeChangeRow}>
              <Text style={styles.routeChangeText}>
                {route} → {targetRoute}
              </Text>
              <Text style={[styles.routeChangeStatus, canChange && styles.routeChangeAllowed]}>
                {canChange ? '✅ Permitido' : '❌ Bloqueado'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Información de Debug */}
      <View style={[styles.section, styles.debugSection]}>
        <Text style={styles.sectionTitle}>🔍 Debug Info</Text>
        <Text style={styles.debugText}>XP: {experience}</Text>
        <Text style={styles.debugText}>Nivel: {currentLevel}</Text>
        <Text style={styles.debugText}>Ruta: {route}</Text>
        <Text style={styles.debugText}>Progreso: {progress.percent.toFixed(2)}%</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  routeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  routeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  routeButtonActive: {
    borderWidth: 3,
    borderColor: '#000',
  },
  routeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  xpButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  xpButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  xpButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  routeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  routeLevels: {
    fontSize: 12,
    color: '#999',
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  levelXP: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressDetail: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#1976D2',
  },
  testResult: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  routeChangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  routeChangeText: {
    fontSize: 14,
    color: '#333',
  },
  routeChangeStatus: {
    fontSize: 14,
    color: '#F44336',
  },
  routeChangeAllowed: {
    color: '#4CAF50',
  },
  debugSection: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});
