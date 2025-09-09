import type { SrsStageInfo } from '@/types';
import { SRS_INTERVALS } from '@/constants/vocabulary.constants';

/**
 * SRS (Spaced Repetition System) utilities
 */

/**
 * Get display information for an SRS stage including name and color
 */
export function getSrsStageInfo(stage: number | null): SrsStageInfo {
  if (stage === null) return { name: 'Not Learned', color: 'default' };

  switch (stage) {
    case 1:
      return { name: 'Apprentice I', color: 'danger' };
    case 2:
      return { name: 'Apprentice II', color: 'danger' };
    case 3:
      return { name: 'Apprentice III', color: 'danger' };
    case 4:
      return { name: 'Guru I', color: 'warning' };
    case 5:
      return { name: 'Guru II', color: 'warning' };
    case 6:
      return { name: 'Master I', color: 'primary' };
    case 7:
      return { name: 'Master II', color: 'primary' };
    case 8:
      return { name: 'Enlightened', color: 'secondary' };
    case 9:
      return { name: 'Burned', color: 'success' };
    default:
      return { name: 'Unknown', color: 'default' };
  }
}

/**
 * Calculate the next SRS stage and review time optimistically (same logic as server)
 * Used for optimistic updates in review submissions
 */
export function calculateOptimisticSrsUpdate(
  currentSrsStage: number,
  correct: boolean,
): {
  newSrsStage: number;
  nextReviewAt: Date | null;
} {
  const now = new Date();
  let newSrsStage = currentSrsStage;

  if (correct) {
    // Move to next SRS stage (max 9)
    if (newSrsStage < 9) {
      newSrsStage++;
    }
  } else {
    // Reset to Apprentice 1 (stage 1) on incorrect answer
    newSrsStage = 1;
  }

  // Calculate next review time
  const intervalHours = SRS_INTERVALS[newSrsStage as keyof typeof SRS_INTERVALS];
  let nextReviewAt: Date | null = null;

  if (intervalHours !== null) {
    nextReviewAt = new Date(now.getTime() + intervalHours * 60 * 60 * 1000);
  }
  // If intervalHours is null (burned), nextReviewAt stays null

  return {
    newSrsStage,
    nextReviewAt,
  };
}
