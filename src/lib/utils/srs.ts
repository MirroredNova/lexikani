import type { SrsStageInfo } from '@/types';

/**
 * SRS (Spaced Repetition System) utilities
 */

/**
 * Get display information for an SRS stage including name and color
 */
export function getSrsStageInfo(stage: number | null): SrsStageInfo {
  if (stage === null) return { name: 'Not Learned', color: 'default' };

  switch (stage) {
    case 0:
      return { name: 'Apprentice 1', color: 'danger' };
    case 1:
      return { name: 'Apprentice 2', color: 'danger' };
    case 2:
      return { name: 'Apprentice 3', color: 'danger' };
    case 3:
      return { name: 'Apprentice 4', color: 'danger' };
    case 4:
      return { name: 'Guru 1', color: 'warning' };
    case 5:
      return { name: 'Guru 2', color: 'warning' };
    case 6:
      return { name: 'Master', color: 'primary' };
    case 7:
      return { name: 'Enlightened', color: 'secondary' };
    case 8:
      return { name: 'Burned', color: 'success' };
    default:
      return { name: 'Unknown', color: 'default' };
  }
}

/**
 * Check if an SRS stage represents a mastered word (Guru level or higher)
 */
export function isMasteredSrsStage(stage: number | null): boolean {
  return stage !== null && stage >= 4;
}

/**
 * Check if an SRS stage represents a burned (fully learned) word
 */
export function isBurnedSrsStage(stage: number | null): boolean {
  return stage === 8;
}

/**
 * Get the category of an SRS stage for filtering
 */
export function getSrsStageCategory(stage: number | null): string {
  if (stage === null) return 'not-learned';
  if (stage <= 3) return 'apprentice';
  if (stage <= 5) return 'guru';
  if (stage <= 7) return 'master-enlightened';
  return 'burned';
}
