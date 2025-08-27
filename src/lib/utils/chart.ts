/**
 * Chart and visualization utilities
 */

/**
 * Calculate bar height for charts based on value and max value
 */
export function calculateBarHeight(
  value: number,
  maxValue: number,
  maxHeight: number = 40,
  minHeight: number = 2,
): number {
  if (maxValue === 0) return minHeight;
  return Math.max(minHeight, (value / maxValue) * maxHeight);
}

/**
 * Get color class based on value ranges
 */
export function getValueBasedColor(
  value: number,
  ranges: { min: number; max: number; color: string }[],
): string {
  const defaultColor = 'bg-gray-200 dark:bg-gray-700';

  if (value === 0) return defaultColor;

  for (const range of ranges) {
    if (value >= range.min && value <= range.max) {
      return range.color;
    }
  }

  // Return the last range's color if value exceeds all ranges
  return ranges[ranges.length - 1]?.color || defaultColor;
}

/**
 * Predefined color ranges for review count bars
 */
export const REVIEW_COUNT_COLORS = [
  { min: 1, max: 5, color: 'bg-blue-400' },
  { min: 6, max: 15, color: 'bg-yellow-400' },
  { min: 16, max: 30, color: 'bg-orange-400' },
  { min: 31, max: Infinity, color: 'bg-red-400' },
];

/**
 * Get bar color for review count
 */
export function getReviewCountBarColor(count: number): string {
  return getValueBasedColor(count, REVIEW_COUNT_COLORS);
}


