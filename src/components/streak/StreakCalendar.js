import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useGameStore } from '../../stores';
import { isSameDay } from '../../utils/dateHelpers';

const PILLAR_ICONS = {
  nutrition: '🥗',
  sleep: '😴',
  movement: '🏃'
};

const EMPTY_ARRAY = [];

/**
 * Displays calendar view of streak history
 */
export const StreakCalendar = ({ daysToShow = 30, style }) => {
  const pillarHistory = useGameStore(state => state.streak?.pillarHistory || EMPTY_ARRAY);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // 📅 DEBUG: Log al inicio del componente
  console.log('📅 [StreakCalendar] Rendering with pillarHistory:', pillarHistory.length, 'entries');
  console.log('📅 [StreakCalendar] Last entry:', pillarHistory[pillarHistory.length - 1]);
  
  // Generate last N days - memoized to prevent recalculation on every render
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      result.push(date);
    }
    
    return result;
  }, [daysToShow]);
  
  const getDayData = useCallback((date) => {
    const dateISO = date.toISOString();
    
    // Get ALL entries for this day (not just the first one)
    const entries = pillarHistory.filter(entry => 
      isSameDay(entry.date, dateISO)
    );
    
    const isToday = date.toDateString() === new Date().toDateString();
    if (isToday && entries.length > 0) {
      console.log('📅 [StreakCalendar] Found', entries.length, 'entries for TODAY:', entries);
    }
    
    return entries;  // Return array instead of single entry
  }, [pillarHistory]);
  
  const renderDay = (date, index) => {
    const dayEntries = getDayData(date);  // Now it's an array
    const hasEntries = dayEntries.length > 0;
    const allCompleted = hasEntries && dayEntries.every(e => e.completed);
    const someCompleted = hasEntries && dayEntries.some(e => e.completed);
    
    const isToday = date.toDateString() === new Date().toDateString();
    if (isToday) {
      console.log('📅 [StreakCalendar] Rendering TODAY:', {
        date: date.toDateString(),
        dayEntries,
        hasEntries,
        allCompleted,
        someCompleted
      });
    }
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.day,
          allCompleted && styles.completedDay,
          someCompleted && !allCompleted && styles.partiallyCompletedDay
        ]}
        onPress={() => dayEntries.length > 0 && setSelectedDay(dayEntries)}
      >
        <Text style={styles.dayNumber}>{date.getDate()}</Text>
        {/* Show all pillar icons stacked */}
        {hasEntries && (
          <View style={styles.iconsContainer}>
            {dayEntries.slice(0, 3).map((entry, i) => (
              <Text key={i} style={styles.pillarIcon}>
                {PILLAR_ICONS[entry.pillar]}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.grid}>
        {days.map((date, index) => renderDay(date, index))}
      </View>
      
      {selectedDay && Array.isArray(selectedDay) && (
        <Modal
          visible={!!selectedDay}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedDay(null)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedDay(null)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {new Date(selectedDay[0].date).toLocaleDateString()}
              </Text>
              <Text style={styles.modalSubtitle}>
                {selectedDay.length} pilar{selectedDay.length > 1 ? 'es' : ''} completado{selectedDay.length > 1 ? 's' : ''}
              </Text>
              {selectedDay.map((entry, index) => (
                <View key={index} style={styles.entryContainer}>
                  <Text style={styles.modalPillar}>
                    {PILLAR_ICONS[entry.pillar]} {entry.pillar}
                  </Text>
                  <Text style={styles.modalStatus}>
                    {entry.completed ? '✓ Completado' : '✗ No completado'}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  completedDay: {
    backgroundColor: '#C8E6C9',
    borderColor: '#4CAF50'
  },
  incompletedDay: {
    backgroundColor: '#FFCDD2',
    borderColor: '#F44336'
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333'
  },
  pillarIcon: {
    fontSize: 10,
    marginTop: 2
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 2
  },
  partiallyCompletedDay: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FFC107'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  entryContainer: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  modalPillar: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666'
  },
  modalStatus: {
    fontSize: 14,
    color: '#666'
  }
});
