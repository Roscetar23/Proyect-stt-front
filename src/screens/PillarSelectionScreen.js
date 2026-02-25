import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStreak } from '../hooks';

const PILLARS = [
  {
    id: 'nutrition',
    name: 'Nutrición',
    icon: '🥗',
    description: 'Alimentación saludable y balanceada',
    color: '#4CAF50'
  },
  {
    id: 'sleep',
    name: 'Sueño',
    icon: '😴',
    description: 'Descanso y recuperación adecuada',
    color: '#2196F3'
  },
  {
    id: 'movement',
    name: 'Movimiento',
    icon: '🏃',
    description: 'Actividad física y ejercicio',
    color: '#FF9800'
  }
];

export const PillarSelectionScreen = ({ navigation }) => {
  const { dailyPillar, selectPillar } = useStreak();
  
  const handleSelect = (pillarId) => {
    console.log('🔍 [PillarSelection] Selecting pillar:', pillarId);
    
    // Permitir cambio de pilar incluso si está completado (para testing)
    // if (dailyPillar?.completed) {
    //   console.log('⚠️ [PillarSelection] Pillar already completed, blocking change');
    //   return;
    // }
    
    const selectedPillarName = PILLARS.find(p => p.id === pillarId)?.name;
    console.log('🔍 [PillarSelection] Calling selectPillar for:', selectedPillarName);
    
    // Call selectPillar directly (skip confirmation for now - web testing)
    selectPillar(pillarId);
    
    console.log('✅ [PillarSelection] Pillar changed, navigating back');
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecciona tu Pilar</Text>
        <Text style={styles.subtitle}>
          Elige en qué quieres enfocarte hoy
        </Text>
      </View>
      
      <View style={styles.pillars}>
        {PILLARS.map(pillar => (
          <TouchableOpacity
            key={pillar.id}
            style={[
              styles.pillarOption,
              { borderColor: pillar.color },
              dailyPillar?.pillar === pillar.id && styles.selectedPillar
            ]}
            onPress={() => handleSelect(pillar.id)}
          >
            <Text style={styles.pillarIcon}>{pillar.icon}</Text>
            <Text style={styles.pillarName}>{pillar.name}</Text>
            <Text style={styles.pillarDescription}>{pillar.description}</Text>
            
            {dailyPillar?.pillar === pillar.id && (
              <View style={[styles.badge, { backgroundColor: pillar.color }]}>
                <Text style={styles.badgeText}>Actual</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Permitir cambio de pilar incluso si está completado (para testing) */}
      {/* {dailyPillar?.completed && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            ⚠️ Ya completaste el pilar de hoy. Vuelve mañana para seleccionar uno nuevo.
          </Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  pillars: {
    padding: 16,
    gap: 16
  },
  pillarOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  selectedPillar: {
    borderWidth: 3
  },
  pillarIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  pillarName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  pillarDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  notice: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107'
  },
  noticeText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center'
  }
});
