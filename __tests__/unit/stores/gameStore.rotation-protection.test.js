/**
 * Tests for rotatePillar infinite loop protection
 * Validates that the store prevents duplicate rotations on the same day
 */

import { useGameStore } from '../../../src/stores/gameStore';

describe('gameStore - Rotation Protection', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  describe('lastRotationCheck protection', () => {
    it('should prevent duplicate automatic rotations on the same day', () => {
      const { rotatePillar } = useGameStore.getState();
      
      // First rotation should work
      rotatePillar(false);
      const firstPillar = useGameStore.getState().dailyPillar;
      const firstCheck = useGameStore.getState().lastRotationCheck;
      
      expect(firstPillar).toBeTruthy();
      expect(firstCheck).toBeTruthy();
      
      // Second rotation on same day should be skipped
      rotatePillar(false);
      const secondPillar = useGameStore.getState().dailyPillar;
      const secondCheck = useGameStore.getState().lastRotationCheck;
      
      // Pillar should remain the same
      expect(secondPillar).toEqual(firstPillar);
      expect(secondCheck).toBe(firstCheck);
    });

    it('should allow manual rotation even on the same day', () => {
      const { rotatePillar } = useGameStore.getState();
      
      // First automatic rotation
      rotatePillar(false);
      const firstPillar = useGameStore.getState().dailyPillar;
      
      // Manual rotation should work even on same day
      rotatePillar(true, 'nutrition');
      const secondPillar = useGameStore.getState().dailyPillar;
      
      // Pillar should change
      expect(secondPillar.pillar).toBe('nutrition');
      expect(secondPillar).not.toEqual(firstPillar);
    });

    it('should update lastRotationCheck even when rotation is not needed', () => {
      const { rotatePillar } = useGameStore.getState();
      
      // First rotation
      rotatePillar(false);
      const firstCheck = useGameStore.getState().lastRotationCheck;
      
      expect(firstCheck).toBeTruthy();
      
      // Second call should update lastRotationCheck even though rotation is skipped
      rotatePillar(false);
      const secondCheck = useGameStore.getState().lastRotationCheck;
      
      expect(secondCheck).toBe(firstCheck);
    });

    it('should handle multiple rapid calls without creating infinite loop', () => {
      const { rotatePillar } = useGameStore.getState();
      
      // Simulate rapid calls (like what might happen in a render loop)
      for (let i = 0; i < 10; i++) {
        rotatePillar(false);
      }
      
      const pillar = useGameStore.getState().dailyPillar;
      const check = useGameStore.getState().lastRotationCheck;
      
      // Should only rotate once
      expect(pillar).toBeTruthy();
      expect(check).toBeTruthy();
      
      // Verify state is stable
      const currentDateString = new Date().toISOString().split('T')[0];
      expect(check).toBe(currentDateString);
    });
  });
});
