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

// Step 4: Test screen imports
let StreakHomeScreen, StreakHistoryScreen, PillarSelectionScreen, LevelMapScreen;
try {
  const homeModule = require('./src/screens/StreakHomeScreen');
  StreakHomeScreen = homeModule.StreakHomeScreen;
  
  const historyModule = require('./src/screens/StreakHistoryScreen');
  StreakHistoryScreen = historyModule.StreakHistoryScreen;
  
  const selectionModule = require('./src/screens/PillarSelectionScreen');
  PillarSelectionScreen = selectionModule.PillarSelectionScreen;
  
  const levelModule = require('./src/screens/LevelMapScreen');
  LevelMapScreen = levelModule.default;
  
  console.log('✅ Screen imports successful');
} catch (error) {
  console.error('❌ Screen import failed:', error);
  importError = importError || `Screen import error: ${error.message}`;
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
  console.log('🚀 App component rendering...');

  // If imports failed, show fallback
  if (importError) {
    return <FallbackUI />;
  }

  const [activeScreen, setActiveScreen] = useState('home');
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const { initializeUser } = storeState;

  // Initialize with mock data on mount
  React.useEffect(() => {
    if (!initialized && initializeUser && mockAPI) {
      const initialize = async () => {
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

          // Start with 0 streak for testing
          useGameStore.setState({
            achievements: achievementsWithStatus,
            streak: {
              currentCount: 0,
              lastCompletedDate: null,
              pillarHistory: []  // Empty history
            },
            dailyPillar: {
              date: new Date().toISOString(),
              pillar: 'nutrition',
              isManuallySet: false,
              target: { type: 'default', value: 1, unit: 'completion' },
              progress: 0,
              completed: false
            },
            user: {
              ...userData,
              experience: userData.experience || 500, // Default XP for testing
              selectedRoute: userData.selectedRoute || 'beginner', // Default route
              currentStreak: 0,
              longestStreak: userData.longestStreak || 0
            }
          });

          setInitialized(true);
          console.log('✅ User initialized on mount');
        } catch (err) {
          console.error('❌ Initialization failed:', err);
          setError(`Initialization error: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      initialize();
    }
  }, [initialized, initializeUser]);

  // Create mock navigation object
  const navigation = {
    navigate: (screen) => {
      const screenMap = {
        'StreakHistory': 'history',
        'PillarSelection': 'selection',
        'LevelTest': 'levels'
      };
      setActiveScreen(screenMap[screen] || screen);
    },
    goBack: () => setActiveScreen('home')
  };

  // Render active screen
  const renderScreen = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Inicializando...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      );
    }

    if (!initialized) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      );
    }

    // Render the appropriate screen
    switch (activeScreen) {
      case 'home':
        return StreakHomeScreen ? <StreakHomeScreen navigation={navigation} /> : null;
      case 'history':
        return StreakHistoryScreen ? <StreakHistoryScreen navigation={navigation} /> : null;
      case 'selection':
        return PillarSelectionScreen ? <PillarSelectionScreen navigation={navigation} /> : null;
      case 'levels':
        return LevelMapScreen ? <LevelMapScreen navigation={navigation} /> : null;
      default:
        return <Text>Screen not found</Text>;
    }
  };

  console.log('✅ Rendering streak system UI');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeScreen === 'home' && styles.activeTab]}
          onPress={() => setActiveScreen('home')}
        >
          <Text style={[styles.tabIcon, activeScreen === 'home' && styles.activeTabIcon]}>
            🏠
          </Text>
          <Text style={[styles.tabLabel, activeScreen === 'home' && styles.activeTabLabel]}>
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeScreen === 'history' && styles.activeTab]}
          onPress={() => setActiveScreen('history')}
        >
          <Text style={[styles.tabIcon, activeScreen === 'history' && styles.activeTabIcon]}>
            📅
          </Text>
          <Text style={[styles.tabLabel, activeScreen === 'history' && styles.activeTabLabel]}>
            Historial
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeScreen === 'selection' && styles.activeTab]}
          onPress={() => setActiveScreen('selection')}
        >
          <Text style={[styles.tabIcon, activeScreen === 'selection' && styles.activeTabIcon]}>
            🎯
          </Text>
          <Text style={[styles.tabLabel, activeScreen === 'selection' && styles.activeTabLabel]}>
            Pilares
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeScreen === 'levels' && styles.activeTab]}
          onPress={() => setActiveScreen('levels')}
        >
          <Text style={[styles.tabIcon, activeScreen === 'levels' && styles.activeTabIcon]}>
            🗺️
          </Text>
          <Text style={[styles.tabLabel, activeScreen === 'levels' && styles.activeTabLabel]}>
            Camino
          </Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#F5F5F5',
  },
  screenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#FF6B35',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  activeTabIcon: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
}) : {};
