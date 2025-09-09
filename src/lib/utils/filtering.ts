import type { VocabularyWithProgress } from '@/types';

/**
 * Filtering and sorting utilities
 */

/**
 * Get unique values for a field from vocabulary data
 */
export function getUniqueValues<K extends keyof VocabularyWithProgress>(
  data: VocabularyWithProgress[],
  field: K,
): Array<VocabularyWithProgress[K]> {
  return Array.from(new Set(data.map(item => item[field])));
}

/**
 * Create filter options for select components
 */
export function createFilterOptions<T>(
  values: T[],
  labelFormatter?: (value: T) => string,
): Array<{ key: string; label: string }> {
  return values.map(value => ({
    key: String(value),
    label: labelFormatter ? labelFormatter(value) : String(value),
  }));
}
