/**
 * usePillarRotation Hook
 * 
 * Custom hook for automatic pillar rotation.
 * Checks if the daily pillar needs rotation and automatically rotates at midnight.
 * 
 * The store itself prevents duplicate rotations via lastRotationCheck field.
 */

import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

/**
 * Custom hook for automatic pillar rotation
 * Automatically rotates pillar when a new day starts
 * 
 * The rotation logic and duplicate prevention is handled by the store,
 * so this hook simply triggers a rotation check on mount and at intervals.
 */
export const usePillarRotation = () => {
  const rotatePillar = useGameStore((state) => state.rotatePillar);
  
  useEffect(() => {
    // Check rotation on mount
    // The store will handle whether rotation is actually needed
    rotatePillar(false);
    
    // Check every minute to detect midnight transition
    // The store prevents duplicate rotations on the same day
    const interval = setInterval(() => {
      rotatePillar(false);
    }, 60000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [rotatePillar]);
};
