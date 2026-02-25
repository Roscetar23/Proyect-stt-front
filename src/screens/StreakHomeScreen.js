import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { StreakCounter, PillarCard, StreakStats } from '../components/streak';
import { useStreak, usePillarRotation } from '../hooks';
import { useGameStore } from '../stores';

export const StreakHomeScreen = ({ navigation }) => {
  usePillarRotation(); // Auto-rotate pillar
  useStreak(); // Initialize streak data
  const currentStreak = useGameStore(state => state.user?.currentStreak || 0);
  const dailyPillar = useGameStore(state => state.dailyPillar);
  
  const [celebrationAnim] = useState(new Animated.Value(0));
  const [counterAnim] = useState(new Animated.Value(1));
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showAtRiskWarning, setShowAtRiskWarning] = useState(false);
  const [hoursUntilMidnight, setHoursUntilMidnight] = useState(0);
  const [showStreakLostMessage, setShowStreakLostMessage] = useState(false);
  const [previousStreak, setPreviousStreak] = useState(currentStreak);
  
  // Requirement 16.4, 16.5: Detect when streak is lost and show motivational message
  useEffect(() => {
    if (previousStreak > 0 && currentStreak === 0) {
      setShowStreakLostMessage(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowStreakLostMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    setPreviousStreak(currentStreak);
  }, [currentStreak, previousStreak]);
  
  // Requirement 16.1, 16.2, 16.3: Check if streak is at risk (< 6 hours to midnight and not completed)
  useEffect(() => {
    const checkAtRisk = () => {
      if (!dailyPillar || dailyPillar.completed) {
        setShowAtRiskWarning(false);
        return;
      }
      
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const hoursLeft = (midnight - now) / (1000 * 60 * 60);
      setHoursUntilMidnight(Math.floor(hoursLeft));
      
      if (hoursLeft < 6) {
        setShowAtRiskWarning(true);
      } else {
        setShowAtRiskWarning(false);
      }
    };
    
    checkAtRisk();
    const interval = setInterval(checkAtRisk, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [dailyPillar]);
  
  // Requirement 15.2, 15.3: Get personalized congratulation message with milestone detection
  const getCelebrationMessage = (streak) => {
    // Requirement 15.3: Detect milestones (7, 30, 100 days) and show special message
    if (streak === 100) {
      return '🏆 ¡INCREÍBLE! ¡100 DÍAS DE RACHA! ¡Eres una leyenda!';
    } else if (streak === 30) {
      return '🌟 ¡IMPRESIONANTE! ¡30 DÍAS DE RACHA! ¡Sigue así!';
    } else if (streak === 7) {
      return '🎯 ¡EXCELENTE! ¡UNA SEMANA COMPLETA! ¡Vas muy bien!';
    } else if (streak >= 10) {
      return `🔥 ¡Fantástico! ¡${streak} días de racha!`;
    } else if (streak >= 5) {
      return `💪 ¡Muy bien! ¡${streak} días consecutivos!`;
    } else if (streak >= 3) {
      return `✨ ¡Genial! ¡${streak} días seguidos!`;
    } else {
      return '🎉 ¡Pilar Completado! ¡Sigue así!';
    }
  };
  
  // Requirement 15.1, 15.2, 15.4: Enhanced celebration with animation and personalized message
  const handleComplete = () => {
    const message = getCelebrationMessage(currentStreak);
    setCelebrationMessage(message);
    
    // Requirement 15.4: Animate StreakCounter update
    Animated.sequence([
      Animated.timing(counterAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(counterAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
    
    // Requirement 15.1: Show celebration animation
    Animated.sequence([
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(celebrationAnim, {
        toValue: 0,
        duration: 400,
        delay: 2000,
        useNativeDriver: true
      })
    ]).start();
  };
  
  const celebrationScale = celebrationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Racha</Text>
        {/* Requirement 15.4: Animated StreakCounter */}
        <Animated.View style={{ transform: [{ scale: counterAnim }] }}>
          <StreakCounter size="large" />
        </Animated.View>
      </View>
      
      {/* Requirement 16.2, 16.3: Show at-risk warning if < 6 hours to midnight */}
      {showAtRiskWarning && (
        <View style={styles.atRiskWarning}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>¡Tu racha está en riesgo!</Text>
            <Text style={styles.warningText}>
              Quedan {hoursUntilMidnight} hora{hoursUntilMidnight !== 1 ? 's' : ''} para completar tu pilar del día
            </Text>
            <Text style={styles.warningMotivation}>
              ¡No pierdas tu progreso! 💪
            </Text>
          </View>
        </View>
      )}
      
      {/* Requirement 16.4, 16.5: Show motivational message when streak is lost */}
      {showStreakLostMessage && (
        <View style={styles.streakLostMessage}>
          <Text style={styles.streakLostIcon}>💙</Text>
          <View style={styles.streakLostContent}>
            <Text style={styles.streakLostTitle}>No te preocupes</Text>
            <Text style={styles.streakLostText}>
              Todos tenemos días difíciles. Lo importante es volver a empezar.
            </Text>
            <Text style={styles.streakLostMotivation}>
              ¡Comienza una nueva racha hoy! 🌟
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowStreakLostMessage(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <PillarCard 
        style={styles.pillarCard}
        onComplete={handleComplete}
      />
      
      <StreakStats style={styles.stats} />
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('StreakHistory')}
        >
          <Text style={styles.buttonText}>Ver Historial</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('PillarSelection')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Cambiar Pilar
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Requirement 15.1, 15.2: Enhanced celebration overlay with personalized message */}
      <Animated.View 
        style={[
          styles.celebration,
          {
            opacity: celebrationAnim,
            transform: [{ scale: celebrationScale }]
          }
        ]}
        pointerEvents="none"
      >
        <Text style={styles.celebrationText}>🎉</Text>
        <Text style={styles.celebrationMessage}>{celebrationMessage}</Text>
      </Animated.View>
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  atRiskWarning: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFC107',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  warningIcon: {
    fontSize: 32,
    marginRight: 12
  },
  warningContent: {
    flex: 1
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4
  },
  warningMotivation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404'
  },
  streakLostMessage: {
    margin: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  streakLostIcon: {
    fontSize: 32,
    marginRight: 12
  },
  streakLostContent: {
    flex: 1
  },
  streakLostTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 4
  },
  streakLostText: {
    fontSize: 14,
    color: '#1565C0',
    marginBottom: 4
  },
  streakLostMotivation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0'
  },
  closeButton: {
    padding: 8,
    marginLeft: 8
  },
  closeButtonText: {
    fontSize: 20,
    color: '#1565C0',
    fontWeight: 'bold'
  },
  pillarCard: {
    margin: 16
  },
  stats: {
    margin: 16
  },
  actions: {
    padding: 16,
    gap: 12
  },
  button: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B35'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  secondaryButtonText: {
    color: '#FF6B35'
  },
  celebration: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  celebrationText: {
    fontSize: 80
  },
  celebrationMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'center'
  }
});
