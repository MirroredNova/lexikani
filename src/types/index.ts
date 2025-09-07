// Database types
export type Language = {
  id: number;
  name: string;
  code: string;
};

export type VocabularyType = string;

// Grammatical attributes for different word types
export type NounAttributes = {
  gender?: 'masculine' | 'feminine' | 'neuter';
  plural?: string;
  article?: string;
};

export type VerbAttributes = {
  infinitive?: string;
  present?: string;
  past?: string;
  perfect?: string;
  tense?: string;
  person?: string;
  form?: string;
};

export type AdjectiveAttributes = {
  comparative?: string;
  superlative?: string;
  genderedForms?: {
    masculine: string;
    feminine: string;
    neuter?: string;
  };
};

export type AdverbAttributes = {
  derivedFromAdjective?: string;
};

export type PhraseAttributes = {
  baseWord?: string; // The root word this phrase is based on
  form?: string; // indefinite_article, definite, plural, etc.
  pattern?: string; // article_adj_noun, pronoun_verb, etc.
  gender?: 'masculine' | 'feminine' | 'neuter';
  tense?: string;
  grammarPoint?: string; // What grammar concept this teaches
};

export type NumberAttributes = {
  value?: number; // The numeric value
  note?: string; // Additional notes about usage
};

export type VocabularyAttributes =
  | NounAttributes
  | VerbAttributes
  | AdjectiveAttributes
  | AdverbAttributes
  | PhraseAttributes
  | NumberAttributes
  | Record<string, unknown>;

export type Vocabulary = {
  id: number;
  languageId: number;
  word: string;
  meaning: string;
  level: number;
  type: VocabularyType;
  attributes: VocabularyAttributes | null;
  createdAt: Date | null;
};

export type UserVocabulary = {
  userId: string;
  vocabularyId: number;
  srsStage: number;
  nextReviewAt: Date | null;
  unlockedAt: Date | null;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// API response types
export type VocabularyItem = {
  id: number;
  word: string;
  meaning: string;
  type: VocabularyType;
  attributes: VocabularyAttributes | null;
  acceptedAnswers?: string[] | null;
  level: number;
};

export type ReviewDirection = 'word-to-meaning' | 'meaning-to-word';

export type ReviewItem = VocabularyItem & {
  srsStage: number;
  nextReviewAt: Date | null;
  direction?: ReviewDirection; // Optional for client-side randomization
};

// Extended vocabulary types for UI components
export type VocabularyWithProgress = {
  id: number;
  word: string;
  meaning: string;
  type: string;
  level: number;
  attributes: VocabularyAttributes | null;
  acceptedAnswers?: string[] | null;
  srsStage: number | null;
  nextReviewAt: Date | null;
  unlockedAt: Date | null;
  updatedAt: Date | null;
  notes: string | null;
};

// Quiz and Review types
export type QuizQuestion = {
  word: VocabularyItem;
  question: string;
  correctAnswer: string;
  direction: ReviewDirection;
};

export type ReviewQuestion = {
  item: ReviewItem;
  question: string;
  correctAnswer: string;
  direction: ReviewDirection;
  pairId: string; // To group word pairs together
};

export type ReviewPair = {
  item: ReviewItem;
  wordToMeaning: boolean | null; // null = not answered, true/false = correct/incorrect
  meaningToWord: boolean | null;
  completed: boolean;
  srsProgression?: { from: number; to: number };
};

// Level Progress types
export type LevelProgress = {
  currentLevel: number;
  totalWords: number;
  masteredWords: number;
  progressPercentage: number;
};

// SRS Info type
export type SrsStageInfo = {
  name: string;
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
};
