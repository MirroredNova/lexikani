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

/**
 * Format a date for local display with timezone consideration
 */
export function formatLocalDateTime(date: Date): string {
  return date.toLocaleString();
}

/**
 * Calculate hours between two dates accounting for timezone
 */
export function getHoursBetween(date1: Date, date2: Date): number {
  return Math.floor((date2.getTime() - date1.getTime()) / (60 * 60 * 1000));
}

/**
 * Debug utilities for timezone troubleshooting
 */
export function getTimezoneDebugInfo() {
  const now = new Date();
  const utcNow = new Date(now.getTime());

  return {
    // Basic timezone info
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: now.getTimezoneOffset(), // minutes behind UTC
    timezoneOffsetHours: now.getTimezoneOffset() / -60, // hours ahead of UTC

    // Current times
    localTime: now.toLocaleString(),
    localTimeISO: now.toISOString(),
    utcTime: utcNow.toUTCString(),

    // For debugging
    localHour: now.getHours(),
    utcHour: utcNow.getUTCHours(),

    // Human readable offset
    offsetString: `UTC${now.getTimezoneOffset() <= 0 ? '+' : ''}${(now.getTimezoneOffset() / -60).toFixed(1)}`,
  };
}

/**
 * Debug log timezone info to console
 */
export function debugTimezone(label: string = 'Timezone Debug') {
  const info = getTimezoneDebugInfo();
  console.group(`🌍 ${label}`);
  console.log('Timezone:', info.timezone);
  console.log('Offset:', info.offsetString);
  console.log('Local Time:', info.localTime);
  console.log('UTC Time:', info.utcTime);
  console.log('Local Hour:', info.localHour);
  console.log('UTC Hour:', info.utcHour);
  console.groupEnd();
  return info;
}
