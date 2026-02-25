import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../../stores';

// Stable empty array to prevent infinite loops
const EMPTY_ARRAY = [];

/**
 * Displays streak statistics
 */
export const StreakStats = ({ style }) => {
  const user = useGameStore(state => state.user);
  const pillarHistory = useGameStore(state => state.streak?.pillarHistory || EMPTY_ARRAY);
  
  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;
  
  // Calculate completion rate (memoized to prevent recalculation)
  const completionRate = useMemo(() => {
    const totalDays = pillarHistory.length;
    const completedDays = pillarHistory.filter(entry => entry.completed).length;
    return totalDays > 0 
      ? Math.round((completedDays / totalDays) * 100) 
      : 0;
  }, [pillarHistory]);
  
  // Count completions by pillar (memoized to prevent recalculation)
  const pillarCounts = useMemo(() => {
    return pillarHistory.reduce((acc, entry) => {
      if (entry.completed) {
        acc[entry.pillar] = (acc[entry.pillar] || 0) + 1;
      }
      return acc;
    }, {});
  }, [pillarHistory]);
  
  const renderStat = (label, value, icon) => (
    <View style={styles.stat}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
  
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Estadísticas</Text>
      
      <View style={styles.statsGrid}>
        {renderStat('Racha Actual', currentStreak, '🔥')}
        {renderStat('Racha Más Larga', longestStreak, '🏆')}
        {renderStat('Tasa de Completación', `${completionRate}%`, '📊')}
      </View>
      
      <View style={styles.pillarStats}>
        <Text style={styles.subtitle}>Por Pilar</Text>
        <View style={styles.pillarRow}>
          <Text style={styles.pillarStat}>🥗 {pillarCounts.nutrition || 0}</Text>
          <Text style={styles.pillarStat}>😴 {pillarCounts.sleep || 0}</Text>
          <Text style={styles.pillarStat}>🏃 {pillarCounts.movement || 0}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333'
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  stat: {
    alignItems: 'center'
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  pillarStats: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666'
  },
  pillarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  pillarStat: {
    fontSize: 16,
    color: '#333'
  }
});
