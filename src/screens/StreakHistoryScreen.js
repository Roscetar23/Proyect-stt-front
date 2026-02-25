import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StreakCalendar, StreakStats } from '../components/streak';
import { useStreak } from '../hooks';

export const StreakHistoryScreen = ({ navigation }) => {
  const { pillarHistory } = useStreak();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Rachas</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos 30 Días</Text>
        <StreakCalendar daysToShow={30} />
      </View>
      
      <View style={styles.section}>
        <StreakStats />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <Text style={styles.summaryText}>
          Total de días registrados: {pillarHistory.length}
        </Text>
        <Text style={styles.summaryText}>
          Días completados: {pillarHistory.filter(e => e.completed).length}
        </Text>
      </View>
    </ScrollView>
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
    color: '#333'
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  }
});
