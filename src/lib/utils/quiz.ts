import type { VocabularyItem, ReviewItem, QuizQuestion, ReviewQuestion } from '@/types';

/**
 * Quiz generation utilities
 */

/**
 * Generate quiz questions from vocabulary items (both directions)
 */
export function generateQuizQuestions(words: VocabularyItem[]): QuizQuestion[] {
  const quizQuestions: QuizQuestion[] = [];

  // Create 2 questions per word (both directions)
  words.forEach(word => {
    // Word to meaning question
    quizQuestions.push({
      word,
      question: word.word,
      correctAnswer: word.meaning,
      direction: 'word-to-meaning',
    });

    // Meaning to word question
    quizQuestions.push({
      word,
      question: word.meaning,
      correctAnswer: word.word,
      direction: 'meaning-to-word',
    });
  });

  return shuffleArray(quizQuestions);
}

/**
 * Generate review questions from review items (both directions with pair tracking)
 */
export function generateReviewQuestions(items: ReviewItem[]): {
  questions: ReviewQuestion[];
  pairs: Map<
    string,
    {
      item: ReviewItem;
      wordToMeaning: boolean | null;
      meaningToWord: boolean | null;
      completed: boolean;
    }
  >;
} {
  const reviewQuestions: ReviewQuestion[] = [];
  const pairs = new Map();

  // Create 2 questions per word (both directions) and track pairs
  items.forEach(item => {
    const pairId = `pair_${item.id}`;

    // Initialize the pair tracking
    pairs.set(pairId, {
      item,
      wordToMeaning: null,
      meaningToWord: null,
      completed: false,
    });

    // Word to meaning question
    reviewQuestions.push({
      item,
      question: item.word,
      correctAnswer: item.meaning,
      direction: 'word-to-meaning',
      pairId,
    });

    // Meaning to word question
    reviewQuestions.push({
      item,
      question: item.meaning,
      correctAnswer: item.word,
      direction: 'meaning-to-word',
      pairId,
    });
  });

  return {
    questions: shuffleArray(reviewQuestions),
    pairs,
  };
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate progress percentage with optional rounding
 */
export function calculateProgress(current: number, total: number, round = true): number {
  if (total === 0) return 0;
  const progress = (current / total) * 100;
  return round ? Math.round(progress) : progress;
}
