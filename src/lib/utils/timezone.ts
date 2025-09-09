/**
 * Timezone utilities for handling server/client date mismatches
 */

/**
 * Convert a server UTC date to local timezone for display
 */
export function convertUTCToLocal(utcDate: Date): Date {
  return new Date(utcDate.getTime());
}

/**
 * Get current time in user's local timezone
 */
export function getLocalNow(): Date {
  return new Date();
}

/**
 * Check if a date is ready for review (accounting for timezone)
 */
export function isReadyForReview(nextReviewAt: Date | null): boolean {
  if (!nextReviewAt) return false;
  const now = getLocalNow();
  const reviewTime = convertUTCToLocal(nextReviewAt);
  return reviewTime <= now;
}
