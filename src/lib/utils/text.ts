/**
 * Text processing utilities for language learning
 */

/**
 * Normalize Norwegian text for comparison by replacing special characters
 * with their ASCII equivalents. This allows users to type 'a' instead of 'å',
 * 'o' instead of 'ø', etc.
 */
export function normalizeNorwegianText(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Norwegian special character alternatives
      .replace(/å/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      // Also handle uppercase versions
      .replace(/Å/g, 'a')
      .replace(/Æ/g, 'ae')
      .replace(/Ø/g, 'o')
  );
}

/**
 * Calculate Levenshtein distance between two strings
 * Returns the minimum number of single-character edits needed to transform one string into another
 */
export function calculateLevenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Enhanced text comparison that allows for typos and minor variations
 * Returns true if the user input is "close enough" to the correct answer
 */
export function fuzzyMatchText(userInput: string, correctAnswer: string): boolean {
  // First try exact match after normalization (current behavior)
  const normalizedUser = normalizeNorwegianText(userInput);
  const normalizedCorrect = normalizeNorwegianText(correctAnswer);

  if (normalizedUser === normalizedCorrect) {
    return true;
  }

  // Additional normalization for fuzzy matching
  const cleanUser = normalizedUser.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
  const cleanCorrect = normalizedCorrect.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');

  if (cleanUser === cleanCorrect) {
    return true;
  }

  // Calculate edit distance
  const distance = calculateLevenshteinDistance(cleanUser, cleanCorrect);
  const maxLength = Math.max(cleanUser.length, cleanCorrect.length);

  // Reject if length difference is too significant (indicates different words)
  const lengthDifference = Math.abs(cleanUser.length - cleanCorrect.length);
  const lengthChangeRatio = lengthDifference / cleanCorrect.length;

  // Be very strict about length changes for short words
  if (cleanCorrect.length <= 5 && lengthChangeRatio > 0.2) {
    return false; // More than 20% length change in short words = likely different word
  }

  // Smart threshold based on answer length and type
  let threshold: number;

  if (maxLength <= 3) {
    // Very short words: no typos allowed (too easy to change meaning)
    threshold = 0;
  } else if (maxLength <= 6) {
    // Short words: allow 1 typo only if length is preserved or minor change
    threshold = lengthChangeRatio <= 0.15 ? 1 : 0;
  } else if (maxLength <= 10) {
    // Medium words: allow 1-2 typos with length consideration
    threshold = Math.min(Math.max(Math.floor(maxLength * 0.12), 1), 2); // ~12% error rate, min 1, max 2
  } else {
    // Long words/phrases: allow more typos but cap at reasonable limit
    threshold = Math.min(Math.max(Math.floor(maxLength * 0.1), 1), 3); // ~10% error rate, min 1, max 3 typos
  }

  return distance <= threshold;
}

/**
 * Get feedback about why an answer was close but not quite right
 * Useful for showing helpful hints to users
 */
export function getAnswerFeedback(
  userInput: string,
  correctAnswer: string,
): {
  isExact: boolean;
  isFuzzyMatch: boolean;
  suggestion?: string;
} {
  const normalizedUser = normalizeNorwegianText(userInput);
  const normalizedCorrect = normalizeNorwegianText(correctAnswer);

  const isExact = normalizedUser === normalizedCorrect;
  const isFuzzyMatch = fuzzyMatchText(userInput, correctAnswer);

  let suggestion: string | undefined;

  if (!isExact && isFuzzyMatch) {
    suggestion = 'Close! Check your spelling.';
  } else if (!isFuzzyMatch) {
    // Check if it's just a Norwegian character issue
    const hasNorwegianChars = /[æøå]/i.test(correctAnswer);
    const userHasPlainChars = /[aeo]/i.test(userInput) && !/[æøå]/i.test(userInput);

    if (hasNorwegianChars && userHasPlainChars) {
      suggestion = "Remember: you can type 'ae' for 'æ', 'o' for 'ø', 'a' for 'å'";
    }
  }

  return { isExact, isFuzzyMatch, suggestion };
}

/**
 * Format a future date relative to now for display in UI
 * Returns human-readable strings like "2h 30m", "3d 5h", "Available Now"
 */
export function formatNextReview(nextReviewAt: Date | null): string {
  if (!nextReviewAt) return 'Never';

  const now = new Date();
  const diffMs = nextReviewAt.getTime() - now.getTime();

  if (diffMs <= 0) return 'Available Now';

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
  if (diffHours > 0) return `${diffHours}h ${diffMinutes}m`;
  return `${diffMinutes}m`;
}
