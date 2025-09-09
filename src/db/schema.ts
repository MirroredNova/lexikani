import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// TABLES
export const language = pgTable('language', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(), // e.g., 'en', 'es', 'jp'
});

export const users = pgTable('users', {
  id: text('id').primaryKey(), // From auth provider
  email: text('email').notNull().unique(),
  name: text('name'),
  isAdmin: boolean('is_admin').notNull().default(false),
  selectedLanguageId: integer('selected_language_id').references(() => language.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const vocabulary = pgTable(
  'vocabulary',
  {
    id: serial('id').primaryKey(),
    languageId: integer('language_id')
      .notNull()
      .references(() => language.id),
    word: text('word').notNull(),
    meaning: text('meaning').notNull(), // English translation
    level: integer('level').notNull(),
    type: text('type').notNull(),
    /**
     * Store type-specific attributes.
     * For a 'noun': { gender: 'masculine', plural: 'gatos' }
     * For a 'verb': { infinitive: 'hablar', tense: 'present', form: 'hablo' }
     */
    attributes: jsonb('attributes'),
    /**
     * Array of acceptable alternative answers for this word.
     * Example: For "du" with meaning "you (singular)", acceptedAnswers could be ["you", "thou"]
     * This allows more flexible quiz validation while keeping the primary meaning descriptive.
     */
    acceptedAnswers: jsonb('accepted_answers'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  table => ({
    // Critical indexes for performance
    languageLevelIdx: index('vocabulary_language_level_idx').on(table.languageId, table.level),
    languageTypeIdx: index('vocabulary_language_type_idx').on(table.languageId, table.type),
    wordSearchIdx: index('vocabulary_word_idx').on(table.word),
    meaningSearchIdx: index('vocabulary_meaning_idx').on(table.meaning),
  }),
);

export const userVocabulary = pgTable(
  'user_vocabulary',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    vocabularyId: integer('vocabulary_id')
      .notNull()
      .references(() => vocabulary.id),
    srsStage: integer('srs_stage').notNull().default(0),
    nextReviewAt: timestamp('next_review_at', { withTimezone: true }),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }).defaultNow(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  table => ({
    pk: primaryKey({ columns: [table.userId, table.vocabularyId] }),
    // Critical indexes for user queries
    userReviewsIdx: index('user_vocabulary_user_reviews_idx').on(table.userId, table.nextReviewAt),
    userSrsIdx: index('user_vocabulary_user_srs_idx').on(table.userId, table.srsStage),
    userUnlockedIdx: index('user_vocabulary_user_unlocked_idx').on(table.userId, table.unlockedAt),
    nextReviewIdx: index('user_vocabulary_next_review_idx').on(table.nextReviewAt),
  }),
);

// RELATIONS
export const languageRelations = relations(language, ({ many }) => ({
  vocabulary: many(vocabulary),
}));

export const vocabularyRelations = relations(vocabulary, ({ one, many }) => ({
  language: one(language, {
    fields: [vocabulary.languageId],
    references: [language.id],
  }),
  userVocabulary: many(userVocabulary),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  selectedLanguage: one(language, {
    fields: [users.selectedLanguageId],
    references: [language.id],
  }),
  userVocabulary: many(userVocabulary),
}));

export const userVocabularyRelations = relations(userVocabulary, ({ one }) => ({
  user: one(users, {
    fields: [userVocabulary.userId],
    references: [users.id],
  }),
  vocabulary: one(vocabulary, {
    fields: [userVocabulary.vocabularyId],
    references: [vocabulary.id],
  }),
}));
