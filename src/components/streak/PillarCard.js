import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../stores';

const PILLAR_CONFIG = {
  nutrition: {
    name: 'Nutrición',
    icon: '🥗',
    color: '#4CAF50'
  },
  sleep: {
    name: 'Sueño',
    icon: '😴',
    color: '#2196F3'
  },
  movement: {
    name: 'Movimiento',
    icon: '🏃',
    color: '#FF9800'
  }
};

/**
 * Displays daily pillar with progress and completion button
 * 
 * Requirements:
 * - 9.1: Display the name of the daily pillar
 * - 9.2: Display the corresponding icon
 * - 9.3: Display the pillar objective
 * - 9.4: Display current progress toward the objective
 * - 9.5: Include a button to mark the pillar as completed
 * - 9.6: When pillar is completed, show a visual completed state
 */
export const PillarCard = ({ onComplete, style }) => {
  const dailyPillar = useGameStore(state => state.dailyPillar);
  const updateStreak = useGameStore(state => state.updateStreak);
  
  if (!dailyPillar) {
    return null;
  }
  
  const config = PILLAR_CONFIG[dailyPillar.pillar];
  const { target, progress, completed } = dailyPillar;
  const progressPercent = Math.min(100, (progress / target.value) * 100);
  
  const handleComplete = () => {
    if (!completed && progressPercent >= 100) {
      updateStreak(true);
      onComplete?.();
    }
  };
  
  return (
    <View style={[styles.card, { borderColor: config.color }, style]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{config.icon}</Text>
        <Text style={styles.name}>{config.name}</Text>
      </View>
      
      <View style={styles.target}>
        <Text style={styles.targetText}>
          Objetivo: {target.value} {target.unit}
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progressPercent}%`, backgroundColor: config.color }
          ]} 
        />
      </View>
      
      <Text style={styles.progressText}>
        {progress} / {target.value} {target.unit}
      </Text>
      
      {!completed && (
        <TouchableOpacity
          style={styles.devButton}
          onPress={() => useGameStore.getState().simulateProgress()}
        >
          <Text style={styles.devButtonText}>🧪 Simular Progreso (Dev)</Text>
        </TouchableOpacity>
      )}
      
      {completed ? (
        <View style={[styles.completedBadge, { backgroundColor: config.color }]}>
          <Text style={styles.completedText}>✓ Completado</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.completeButton,
            { backgroundColor: config.color },
            progressPercent < 100 && styles.disabledButton
          ]}
          onPress={handleComplete}
          disabled={progressPercent < 100}
        >
          <Text style={styles.buttonText}>Marcar como Completado</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  icon: {
    fontSize: 32,
    marginRight: 12
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  target: {
    marginBottom: 8
  },
  targetText: {
    fontSize: 14,
    color: '#666'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressFill: {
    height: '100%',
    borderRadius: 4
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12
  },
  completeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.5
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  completedBadge: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  completedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  devButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 8
  },
  devButtonText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600'
  }
});
