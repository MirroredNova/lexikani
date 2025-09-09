/**
 * Date and time formatting utilities
 */

/**
 * Format hour for compact display in schedule views
 * Returns formatted time (e.g., "9A", "2P")
 */
export function formatCompactHour(date: Date): string {
  const timeString = date
    .toLocaleTimeString([], {
      hour: 'numeric',
      hour12: true,
    })
    .replace(' AM', 'A')
    .replace(' PM', 'P');

  return timeString;
}
