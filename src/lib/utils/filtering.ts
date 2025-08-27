import type { VocabularyWithProgress } from '@/types';

/**
 * Filtering and sorting utilities
 */

/**
 * Filter vocabulary data based on search term, type, and SRS status
 */
export function filterVocabulary(
  data: VocabularyWithProgress[],
  filters: {
    searchTerm?: string;
    typeFilter?: string;
    srsFilter?: string;
  },
): VocabularyWithProgress[] {
  const { searchTerm = '', typeFilter = 'all', srsFilter = 'all' } = filters;

  return data.filter(item => {
    // Search filter - matches word or meaning
    const matchesSearch =
      !searchTerm ||
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    // SRS filter
    const matchesSrs = checkSrsFilter(item.srsStage, srsFilter);

    return matchesSearch && matchesType && matchesSrs;
  });
}

/**
 * Check if an SRS stage matches the given filter
 */
function checkSrsFilter(srsStage: number | null, filter: string): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'learned':
      return srsStage !== null;
    case 'not-learned':
      return srsStage === null;
    case 'burned':
      return srsStage === 8;
    case 'apprentice':
      return srsStage !== null && srsStage <= 3;
    case 'guru':
      return srsStage !== null && srsStage >= 4 && srsStage <= 5;
    case 'master-enlightened':
      return srsStage !== null && srsStage >= 6 && srsStage <= 7;
    default:
      return true;
  }
}

/**
 * Sort vocabulary data by the specified criteria
 */
export function sortVocabulary(
  data: VocabularyWithProgress[],
  sortBy: string,
): VocabularyWithProgress[] {
  const sorted = [...data];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'word':
        return a.word.localeCompare(b.word);
      case 'meaning':
        return a.meaning.localeCompare(b.meaning);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'srs':
        if (a.srsStage === null && b.srsStage === null) return 0;
        if (a.srsStage === null) return 1;
        if (b.srsStage === null) return -1;
        return a.srsStage - b.srsStage;
      case 'level':
      default:
        if (a.level === b.level) {
          return a.id - b.id; // Same as lesson order
        }
        return a.level - b.level;
    }
  });

  return sorted;
}

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

/**
 * Calculate vocabulary statistics
 */
export function calculateVocabularyStats(data: VocabularyWithProgress[]) {
  const total = data.length;
  const learned = data.filter(item => item.srsStage !== null).length;
  const burned = data.filter(item => item.srsStage === 8).length;
  const readyForReview = data.filter(
    item => item.nextReviewAt && new Date(item.nextReviewAt) <= new Date(),
  ).length;

  return {
    total,
    learned,
    burned,
    readyForReview,
    unlearned: total - learned,
    learningPercentage: total > 0 ? Math.round((learned / total) * 100) : 0,
    burnedPercentage: total > 0 ? Math.round((burned / total) * 100) : 0,
  };
}
