// Simplified App.js with error boundaries and progressive loading
import React, { useState } from 'react';

// Step 1: Test basic React Native imports
let StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator;
let importError = null;

try {
  const ExpoStatusBar = require('expo-status-bar');
  StatusBar = ExpoStatusBar.StatusBar;
  
  const RN = require('react-native');
  StyleSheet = RN.StyleSheet;
  Text = RN.Text;
  View = RN.View;
  ScrollView = RN.ScrollView;
  TouchableOpacity = RN.TouchableOpacity;
  ActivityIndicator = RN.ActivityIndicator;
  
  console.log('✅ React Native imports successful');
} catch (error) {
  importError = `React Native import error: ${error.message}`;
  console.error('❌ React Native import failed:', error);
}

// Step 2: Test store imports
let useGameStore;
try {
  const storeModule = require('./src/stores');
  useGameStore = storeModule.useGameStore;
  console.log('✅ Store imports successful');
} catch (error) {
  console.error('❌ Store import failed:', error);
  importError = importError || `Store import error: ${error.message}`;
}

// Step 3: Test service imports
let mockAPI;
try {
  const apiModule = require('./src/services/mockAPI');
  mockAPI = apiModule.default;
  console.log('✅ API imports successful');
} catch (error) {
  console.error('❌ API import failed:', error);
  importError = importError || `API import error: ${error.message}`;
}

// Step 4: Test utility imports
let calculateProgress, calculateExperienceForNextLevel;
try {
  const utilsModule = require('./src/utils');
  calculateProgress = utilsModule.calculateProgress;
  calculateExperienceForNextLevel = utilsModule.calculateExperienceForNextLevel;
  console.log('✅ Utils imports successful');
} catch (error) {
  console.error('❌ Utils import failed:', error);
  importError = importError || `Utils import error: ${error.message}`;
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>⚠️ Error Detected</Text>
          <Text style={errorStyles.message}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <Text style={errorStyles.stack}>
            {this.state.error?.stack || 'No stack trace'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Fallback UI if imports failed
function FallbackUI() {
  if (!View || !Text) {
    return null; // Can't even render basic components
  }

  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.title}>⚠️ Import Error</Text>
      <Text style={errorStyles.message}>{importError}</Text>
      <Text style={errorStyles.hint}>
        Check console for details. Possible issues:
      </Text>
      <Text style={errorStyles.hint}>• Missing dependencies</Text>
      <Text style={errorStyles.hint}>• File path errors</Text>
      <Text style={errorStyles.hint}>• Syntax errors in imported files</Text>
    </View>
  );
}

// Main App Component
function App() {
  console.log('� App component rendering...');
  
  // If imports failed, show fallback
  if (importError) {
    return <FallbackUI />;
  }

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  
  // Safely get store state
  let storeState = {};
  try {
    if (useGameStore) {
      storeState = useGameStore();
      console.log('✅ Store state accessed:', Object.keys(storeState));
    }
  } catch (err) {
    console.error('❌ Store access failed:', err);
    setError(`Store error: ${err.message}`);
  }

  const {
    user,
    dailyPillar,
    achievements = [],
    initializeUser,
    addExperience,
    updateStreak,
    rotatePillar,
    unlockAchievement,
    resetState
  } = storeState;

  // Show temporary message
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  // Safe action wrapper
  const safeAction = (action, successMsg) => async () => {
    try {
      setError(null);
      await action();
      showMessage(successMsg);
    } catch (err) {
      console.error('Action error:', err);
      setError(err.message);
      showMessage(`❌ Error: ${err.message}`);
    }
  };

  // Initialize with mock data
  const handleInitialize = safeAction(async () => {
    setLoading(true);
    try {
      const userData = await mockAPI.getUserData('user-001');
      const achievementsData = await mockAPI.getAchievements('user-001');
      
      initializeUser(userData);
      
      const achievementsWithStatus = achievementsData.map(ach => ({
        ...ach,
        unlockedAt: userData.completedAchievements.includes(ach.id) 
          ? new Date().toISOString() 
          : null
      }));
      
      useGameStore.setState({ 
        achievements: achievementsWithStatus,
        streak: {
          currentCount: userData.currentStreak,
          lastCompletedDate: new Date().toISOString()
        },
        dailyPillar: {
          date: new Date().toISOString(),
          pillar: 'nutrition',
          isManuallySet: false,
          target: { type: 'default', value: 1, unit: 'completion' },
          progress: 0,
          completed: false
        }
      });
    } finally {
      setLoading(false);
    }
  }, '✅ User initialized!');

  // Calculate progress safely
  let progress = 0;
  let nextLevelExp = 0;
  let currentLevelExp = 0;
  let expInLevel = 0;
  let expNeeded = 0;

  try {
    if (user && calculateProgress && calculateExperienceForNextLevel) {
      progress = calculateProgress(user.experience, user.level);
      nextLevelExp = calculateExperienceForNextLevel(user.level);
      currentLevelExp = calculateExperienceForNextLevel(user.level - 1);
      expInLevel = user.experience - currentLevelExp;
      expNeeded = nextLevelExp - currentLevelExp;
    }
  } catch (err) {
    console.error('Progress calculation error:', err);
  }

  // Helper functions
  const getPillarEmoji = (pillar) => {
    const emojis = { nutrition: '🥗', sleep: '😴', movement: '🏃' };
    return emojis[pillar] || '❓';
  };

  const getPillarName = (pillar) => {
    const names = { nutrition: 'Nutrición', sleep: 'Sueño', movement: 'Movimiento' };
    return names[pillar] || pillar;
  };

  console.log('✅ Rendering main UI');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎮 Gamification Demo</Text>
          <Text style={styles.subtitle}>Sistema de Gamificación</Text>
          <Text style={styles.status}>✅ All imports loaded successfully!</Text>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Message Toast */}
        {message ? (
          <View style={styles.messageToast}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        )}

        {/* User Info Section */}
        {user ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>� User Information</Text>
            <View style={styles.card}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>⭐ Level</Text>
                  <Text style={styles.statValue}>{user.level}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>💎 Experience</Text>
                  <Text style={styles.statValue}>{user.experience}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>🔥 Streak</Text>
                  <Text style={styles.statValue}>{user.currentStreak}</Text>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>
                  Progress to Level {user.level + 1}
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {expInLevel} / {expNeeded} XP ({Math.round(progress)}%)
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.emptyText}>No user data. Initialize to start!</Text>
          </View>
        )}

        {/* Daily Pillar Section */}
        {dailyPillar && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Daily Pillar</Text>
            <View style={styles.card}>
              <View style={styles.pillarHeader}>
                <Text style={styles.pillarEmoji}>
                  {getPillarEmoji(dailyPillar.pillar)}
                </Text>
                <Text style={styles.pillarName}>
                  {getPillarName(dailyPillar.pillar)}
                </Text>
              </View>
              <Text style={styles.pillarStatus}>
                {dailyPillar.completed ? '✅ Completed' : '⏳ Pending'}
              </Text>
            </View>
          </View>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Achievements</Text>
            <View style={styles.achievementsList}>
              {achievements.slice(0, 6).map((achievement) => (
                <View 
                  key={achievement.id} 
                  style={[
                    styles.achievementCard,
                    achievement.unlockedAt && styles.achievementUnlocked
                  ]}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDesc}>{achievement.description}</Text>
                  <Text style={styles.achievementStatus}>
                    {achievement.unlockedAt ? '🔓 Unlocked' : '🔒 Locked'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Actions</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonPrimary]} 
            onPress={handleInitialize}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🚀 Initialize User</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSuccess]} 
            onPress={safeAction(() => addExperience(50), '⭐ +50 XP added!')}
            disabled={!user}
          >
            <Text style={styles.buttonText}>⭐ Add +50 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonWarning]} 
            onPress={safeAction(() => updateStreak(true), '🔥 Streak updated!')}
            disabled={!user}
          >
            <Text style={styles.buttonText}>🔥 Complete Daily Pillar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonInfo]} 
            onPress={safeAction(() => rotatePillar(), '🔄 Pillar rotated!')}
            disabled={!user}
          >
            <Text style={styles.buttonText}>🔄 Rotate Pillar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={safeAction(() => {
              const lockedAchievement = achievements.find(a => !a.unlockedAt);
              if (lockedAchievement) {
                unlockAchievement(lockedAchievement.id);
              }
            }, '🏆 Achievement unlocked!')}
            disabled={!user || achievements.length === 0}
          >
            <Text style={styles.buttonText}>🏆 Unlock Achievement</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonDanger]} 
            onPress={safeAction(() => resetState(), '🔄 State reset!')}
          >
            <Text style={styles.buttonText}>🔄 Reset State</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All infrastructure working! 🎉
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Wrap App with Error Boundary
export default function AppWithErrorBoundary() {
  try {
    return (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Fatal error:', error);
    return <FallbackUI />;
  }
}

// Error styles
const errorStyles = StyleSheet?.create ? StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fee',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c00',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#600',
    marginBottom: 12,
  },
  stack: {
    fontSize: 12,
    color: '#900',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 14,
    color: '#600',
    marginTop: 4,
  },
}) : {};

// Main styles
const styles = StyleSheet?.create ? StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  status: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 8,
  },
  errorBox: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fcc',
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
  },
  messageToast: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  progressSection: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pillarEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  pillarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  pillarStatus: {
    fontSize: 14,
    color: '#64748b',
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  achievementUnlocked: {
    backgroundColor: '#fff',
    borderColor: '#6366f1',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementStatus: {
    fontSize: 11,
    color: '#64748b',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#6366f1',
  },
  buttonSuccess: {
    backgroundColor: '#10b981',
  },
  buttonWarning: {
    backgroundColor: '#f59e0b',
  },
  buttonInfo: {
    backgroundColor: '#3b82f6',
  },
  buttonSecondary: {
    backgroundColor: '#8b5cf6',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    padding: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
}) : {};
