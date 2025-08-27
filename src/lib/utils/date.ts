/**
 * Date and time formatting utilities
 */

/**
 * Format hour for compact display in schedule views
 * Returns formatted time with day indicators (+1, +2, etc.)
 */
export function formatCompactHour(date: Date, referenceTime?: Date): string {
  const now = referenceTime || new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow =
    date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

  const timeString = date
    .toLocaleTimeString([], {
      hour: 'numeric',
      hour12: true,
    })
    .replace(' AM', 'A')
    .replace(' PM', 'P');

  if (isToday) {
    return timeString;
  } else if (isTomorrow) {
    return `${timeString} +1`;
  } else {
    const daysFromNow = Math.ceil((date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return `${timeString} +${daysFromNow}`;
  }
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

/**
 * Get the number of days between two dates
 */
export function getDaysBetween(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
}

/**
 * Add hours to a date
 */
export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Format a date as a readable string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with time (e.g., "Jan 15, 2024 at 3:30 PM")
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
