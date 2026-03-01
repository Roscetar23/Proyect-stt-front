import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  TextInput
} from 'react-native';
import { levelSystem } from '../modules';
import { useGameStore } from '../stores';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Configuración del mapa
const NODE_SIZE = 70;
const NODE_SPACING = 120;
const ZIG_ZAG_OFFSET = screenWidth * 0.25; // Offset para el patrón zig-zag

// Colores por mundo
const WORLD_COLORS = {
  beginner: {
    primary: '#4CAF50',
    secondary: '#81C784',
    background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
    accent: '#2E7D32',
    light: '#E8F5E8'
  },
  intermediate: {
    primary: '#2196F3',
    secondary: '#64B5F6',
    background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    accent: '#1565C0',
    light: '#E3F2FD'
  },
  advanced: {
    primary: '#9C27B0',
    secondary: '#BA68C8',
    background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    accent: '#6A1B9A',
    light: '#F3E5F5'
  },
  expert: {
    primary: '#FFD700',
    secondary: '#FFF176',
    background: 'linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)',
    accent: '#F57F17',
    light: '#FFFDE7'
  }
};

export default function LevelMapScreen() {
  const user = useGameStore(state => state.user);
  const addExperience = useGameStore(state => state.addExperience);
  const currentXP = user?.experience || 0;
  const currentRoute = user?.selectedRoute || 'beginner';
  
  const scrollViewRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [mapData, setMapData] = useState([]);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [testXP, setTestXP] = useState('50');
  
  // Animaciones
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    generateMapData();
    startPulseAnimation();
  }, [currentXP, currentRoute]);

  const generateMapData = () => {
    const routes = ['beginner', 'intermediate', 'advanced', 'expert'];
    const allNodes = [];
    
    routes.forEach((route, routeIndex) => {
      const routeInfo = levelSystem.getRouteInfo(route);
      if (!routeInfo) return;
      
      routeInfo.levels.forEach((levelInfo, levelIndex) => {
        const currentLevel = levelSystem.calculateLevel(currentXP, currentRoute);
        const isUnlocked = levelInfo.level <= currentLevel + 1; // Allow seeing next level
        const isCompleted = currentXP >= levelInfo.experienceRequired;
        const isCurrent = currentLevel === levelInfo.level && currentRoute === route;
        
        // Patrón zig-zag: alternar entre izquierda y derecha
        const isLeft = levelIndex % 2 === 0;
        const baseX = screenWidth / 2;
        const offsetX = isLeft ? -ZIG_ZAG_OFFSET : ZIG_ZAG_OFFSET;
        
        allNodes.push({
          ...levelInfo,
          route,
          routeIndex,
          isUnlocked,
          isCompleted,
          isCurrent,
          worldColor: WORLD_COLORS[route],
          // Posición en el mapa (zig-zag)
          x: baseX + offsetX,
          y: routeIndex * 700 + levelIndex * NODE_SPACING + 150,
          isLeft
        });
      });
    });
    
    setMapData(allNodes);
    
    // Auto-scroll al nivel actual
    setTimeout(() => {
      const currentNode = allNodes.find(node => node.isCurrent);
      if (currentNode && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: Math.max(0, currentNode.y - screenHeight / 2),
          animated: true
        });
      }
    }, 500);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const calculateProgress = (node) => {
    if (!node.isCurrent) return 0;
    const prevLevel = node.level - 1;
    const prevXP = prevLevel > 0 ? levelSystem.getLevelInfo(prevLevel, node.route)?.experienceRequired || 0 : 0;
    const currentLevelXP = node.experienceRequired - prevXP;
    const userProgressXP = currentXP - prevXP;
    return Math.max(0, Math.min(1, userProgressXP / currentLevelXP));
  };

  const renderProgressRing = (node) => {
    if (!node.isCurrent) return null;
    
    const progress = calculateProgress(node);
    const circumference = 2 * Math.PI * (NODE_SIZE / 2 + 8);
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - progress);
    
    return (
      <View style={styles.progressRingContainer}>
        <View style={[styles.progressRing, { borderColor: node.worldColor.primary }]}>
          <View 
            style={[
              styles.progressFill,
              {
                backgroundColor: node.worldColor.primary,
                transform: [{ rotate: `${progress * 360}deg` }]
              }
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: node.worldColor.accent }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    );
  };

  const renderConnectingPath = (node, index) => {
    if (index === 0) return null;
    
    const prevNode = mapData[index - 1];
    if (!prevNode || prevNode.route !== node.route) return null;
    
    const isActive = prevNode.isCompleted;
    const pathColor = isActive ? node.worldColor.primary : '#DDDDDD';
    
    // Calcular la curva entre nodos
    const startX = prevNode.x;
    const startY = prevNode.y + NODE_SIZE / 2;
    const endX = node.x;
    const endY = node.y - NODE_SIZE / 2;
    
    const midY = (startY + endY) / 2;
    
    return (
      <View
        key={`path-${index}`}
        style={[
          styles.connectingPath,
          {
            left: Math.min(startX, endX) - 2,
            top: startY,
            width: Math.abs(endX - startX) + 4,
            height: endY - startY,
            backgroundColor: pathColor,
            opacity: isActive ? 0.8 : 0.3
          }
        ]}
      />
    );
  };

  const renderNode = (node, index) => {
    const { isUnlocked, isCompleted, isCurrent, worldColor } = node;
    
    let nodeColor = worldColor.primary;
    let textColor = '#FFFFFF';
    let borderColor = '#FFFFFF';
    
    if (!isUnlocked) {
      nodeColor = '#CCCCCC';
      textColor = '#666666';
      borderColor = '#999999';
    } else if (isCompleted) {
      nodeColor = worldColor.accent;
      borderColor = worldColor.secondary;
    } else if (isCurrent) {
      nodeColor = worldColor.secondary;
      borderColor = worldColor.primary;
    }
    
    return (
      <View key={`node-container-${node.route}-${node.level}`}>
        {/* Connecting Path */}
        {renderConnectingPath(node, index)}
        
        {/* Node */}
        <TouchableOpacity
          style={[
            styles.nodeContainer,
            { 
              left: node.x - NODE_SIZE / 2,
              top: node.y - NODE_SIZE / 2
            }
          ]}
          onPress={() => setSelectedNode(node)}
          activeOpacity={0.8}
        >
          {/* Progress Ring for Current Node */}
          {renderProgressRing(node)}
          
          <Animated.View
            style={[
              styles.node,
              {
                backgroundColor: nodeColor,
                borderColor: borderColor,
                transform: isCurrent ? [{ scale: pulseAnim }] : [{ scale: 1 }]
              }
            ]}
          >
            {/* Número del nivel */}
            <Text style={[styles.nodeText, { color: textColor }]}>
              {node.level}
            </Text>
            
            {/* Iconos de estado */}
            {isCompleted && (
              <View style={[styles.statusIcon, styles.completedIcon]}>
                <Text style={styles.completedText}>✓</Text>
              </View>
            )}
            
            {!isUnlocked && (
              <View style={[styles.statusIcon, styles.lockedIcon]}>
                <Text style={styles.lockedText}>🔒</Text>
              </View>
            )}
            
            {isCurrent && (
              <View style={[styles.statusIcon, styles.currentIcon]}>
                <Text style={styles.currentText}>▶</Text>
              </View>
            )}
          </Animated.View>
          
          {/* Título del nivel */}
          <Text style={[
            styles.nodeTitle,
            { 
              color: isUnlocked ? worldColor.accent : '#999999',
              textAlign: node.isLeft ? 'right' : 'left',
              marginLeft: node.isLeft ? -40 : 40,
            }
          ]}>
            {node.title}
          </Text>
          
          {/* Tooltip para nodo actual */}
          {isCurrent && (
            <View style={[
              styles.tooltip,
              { 
                backgroundColor: worldColor.primary,
                left: node.isLeft ? -80 : 20
              }
            ]}>
              <Text style={styles.tooltipText}>CONTINUAR</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderWorldSection = (route, routeIndex) => {
    const worldColor = WORLD_COLORS[route];
    const routeInfo = levelSystem.getRouteInfo(route);
    
    const worldNames = {
      beginner: '🌿 Bosque Principiante',
      intermediate: '🌊 Costa Intermedia', 
      advanced: '🔮 Valle Avanzado',
      expert: '🔥 Cumbre Experta'
    };
    
    return (
      <View
        key={route}
        style={[
          styles.worldSection,
          {
            top: routeIndex * 700 + 50,
            backgroundColor: worldColor.light
          }
        ]}
      >
        <Text style={[styles.worldTitle, { color: worldColor.accent }]}>
          {worldNames[route]}
        </Text>
        <Text style={[styles.worldDescription, { color: worldColor.accent }]}>
          {routeInfo?.description || ''}
        </Text>
        <Text style={[styles.worldLevels, { color: worldColor.primary }]}>
          Niveles {routeInfo?.levels[0]?.level} - {routeInfo?.levels[routeInfo.levels.length - 1]?.level}
        </Text>
      </View>
    );
  };

  const handleAddXP = () => {
    const xpAmount = parseInt(testXP) || 50;
    addExperience(xpAmount);
  };

  const handleSetXP = (amount) => {
    const currentUserXP = user?.experience || 0;
    const difference = amount - currentUserXP;
    if (difference > 0) {
      addExperience(difference);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con información del usuario */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => setShowDevPanel(!showDevPanel)}
          onLongPress={() => setShowDevPanel(!showDevPanel)}
        >
          <Text style={styles.headerTitle}>🗺️ Camino de Leyendas</Text>
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>🔥 Racha: {user?.currentStreak || 0}</Text>
          <Text style={styles.statText}>💎 XP: {currentXP}</Text>
          <Text style={styles.statText}>
            🛡️ Nivel: {levelSystem.calculateLevel(currentXP, currentRoute)}
          </Text>
        </View>
      </View>

      {/* Panel de Desarrollo */}
      {showDevPanel && (
        <View style={styles.devPanel}>
          <Text style={styles.devTitle}>🕹️ Panel de Pruebas</Text>
          <View style={styles.devControls}>
            <View style={styles.xpInputContainer}>
              <TextInput
                style={styles.xpInput}
                value={testXP}
                onChangeText={setTestXP}
                keyboardType="numeric"
                placeholder="XP"
              />
              <TouchableOpacity style={styles.addXPButton} onPress={handleAddXP}>
                <Text style={styles.addXPText}>+{testXP} XP</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickXPButtons}>
              <TouchableOpacity style={styles.quickXPButton} onPress={() => handleSetXP(1000)}>
                <Text style={styles.quickXPText}>1K XP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickXPButton} onPress={() => handleSetXP(10000)}>
                <Text style={styles.quickXPText}>10K XP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickXPButton} onPress={() => handleSetXP(40000)}>
                <Text style={styles.quickXPText}>40K XP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Mapa scrolleable */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.mapContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: mapData.length > 0 ? Math.max(...mapData.map(n => n.y)) + 300 : 2500
        }}
      >
        {/* Secciones de mundo (fondos) */}
        {['beginner', 'intermediate', 'advanced', 'expert'].map(renderWorldSection)}
        
        {/* Nodos de niveles */}
        {mapData.map(renderNode)}
      </ScrollView>

      {/* Panel de información del nodo seleccionado */}
      {selectedNode && (
        <View style={styles.infoPanel}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedNode(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <Text style={[styles.infoPanelTitle, { color: selectedNode.worldColor.accent }]}>
            Nivel {selectedNode.level}: {selectedNode.title}
          </Text>
          
          <Text style={styles.infoPanelText}>
            XP Requerido: {selectedNode.experienceRequired.toLocaleString()}
          </Text>
          
          {selectedNode.isCurrent && (
            <>
              <Text style={styles.infoPanelProgress}>
                Progreso: {currentXP.toLocaleString()}/{selectedNode.experienceRequired.toLocaleString()} XP
              </Text>
              <Text style={styles.infoPanelProgress}>
                ({Math.round(calculateProgress(selectedNode) * 100)}% Completado)
              </Text>
              <Text style={styles.infoPanelNext}>
                ¡Solo {(selectedNode.experienceRequired - currentXP).toLocaleString()} XP más!
              </Text>
            </>
          )}
          
          {selectedNode.isCompleted && (
            <Text style={styles.infoPanelCompleted}>
              ✅ ¡Nivel Completado! Funcionalidades desbloqueadas.
            </Text>
          )}
          
          {!selectedNode.isUnlocked && (
            <Text style={styles.infoPanelLocked}>
              🔒 Completa los niveles anteriores para desbloquear
            </Text>
          )}
          
          <Text style={styles.infoPanelRoute}>
            🗺️ {selectedNode.route.charAt(0).toUpperCase() + selectedNode.route.slice(1)}
          </Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  devPanel: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFB74D',
  },
  devTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 10,
  },
  devControls: {
    alignItems: 'center',
  },
  xpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  xpInput: {
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    width: 80,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  addXPButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addXPText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  quickXPButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  quickXPButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickXPText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  worldSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 680,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    marginHorizontal: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  worldTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  worldDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 5,
  },
  worldLevels: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.9,
  },
  nodeContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressRingContainer: {
    position: 'absolute',
    top: -15,
    left: -15,
    width: NODE_SIZE + 30,
    height: NODE_SIZE + 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    width: NODE_SIZE + 16,
    height: NODE_SIZE + 16,
    borderRadius: (NODE_SIZE + 16) / 2,
    borderWidth: 4,
    borderColor: '#E0E0E0',
    position: 'absolute',
  },
  progressFill: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    borderTopRightRadius: (NODE_SIZE + 16) / 2,
    borderBottomRightRadius: (NODE_SIZE + 16) / 2,
    right: 0,
  },
  progressText: {
    position: 'absolute',
    bottom: -25,
    fontSize: 12,
    fontWeight: 'bold',
  },
  connectingPath: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  nodeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 120,
    position: 'absolute',
    top: NODE_SIZE + 5,
  },
  statusIcon: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    top: -8,
    right: -8,
  },
  completedIcon: {
    backgroundColor: '#4CAF50',
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lockedIcon: {
    backgroundColor: '#757575',
  },
  lockedText: {
    fontSize: 12,
  },
  currentIcon: {
    backgroundColor: '#FF9800',
  },
  currentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    top: -40,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    maxHeight: screenHeight * 0.5,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 25,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  infoPanelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingRight: 50,
  },
  infoPanelText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  infoPanelProgress: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 5,
  },
  infoPanelNext: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoPanelCompleted: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 10,
  },
  infoPanelLocked: {
    fontSize: 16,
    color: '#757575',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  infoPanelRoute: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 10,
  },
});