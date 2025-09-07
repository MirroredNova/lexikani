import {
  boolean,
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

export const vocabulary = pgTable('vocabulary', {
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
});

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
  table => {
    return {
      pk: primaryKey({ columns: [table.userId, table.vocabularyId] }),
    };
  },
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
