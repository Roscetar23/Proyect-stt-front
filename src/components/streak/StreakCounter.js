import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../../stores';

/**
 * Displays current streak count with fire emoji
 * @param {string} size - Size variant: 'small', 'medium', or 'large'
 * @param {object} style - Custom styles to apply to container
 */
export const StreakCounter = ({ size = 'medium', style }) => {
  const currentStreak = useGameStore(state => state.user?.currentStreak || 0);
  
  const sizeStyles = {
    small: { fontSize: 16, iconSize: 20 },
    medium: { fontSize: 24, iconSize: 32 },
    large: { fontSize: 36, iconSize: 48 }
  };
  
  const { fontSize, iconSize } = sizeStyles[size] || sizeStyles.medium;
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.count, { fontSize }]}>
        {currentStreak}
      </Text>
      <Text style={[styles.icon, { fontSize: iconSize }]}>
        🔥
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  count: {
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  icon: {
    lineHeight: 1
  }
});
