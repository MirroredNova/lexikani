'use server';

import { SRS_INTERVALS } from '@/constants/vocabulary.constants';
import { db } from '@/db/db';
import { vocabulary, userVocabulary } from '@/db/schema';
import { getCurrentUser, ensureUserExists } from '@/lib/server/user.actions';
import type { VocabularyItem, ReviewItem, VocabularyAttributes } from '@/types';
import { eq, and, lte, isNull, ne, count, gte, isNotNull } from 'drizzle-orm';


export async function getUnlockedLevel(languageId: number): Promise<number> {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  // Get all level statistics in a single optimized query
  const levelStats = await db
    .select({
      level: vocabulary.level,
      totalWords: count(vocabulary.id),
      masteredWords: count(userVocabulary.vocabularyId),
    })
    .from(vocabulary)
    .leftJoin(
      userVocabulary,
      and(
        eq(userVocabulary.vocabularyId, vocabulary.id),
        eq(userVocabulary.userId, user.id),
        gte(userVocabulary.srsStage, 4), // Only count mastered words (Guru+)
      ),
    )
    .where(eq(vocabulary.languageId, languageId))
    .groupBy(vocabulary.level)
    .orderBy(vocabulary.level);

  if (levelStats.length === 0) return 1;

  // Find highest unlocked level
  let unlockedLevel = 1;

  for (const levelStat of levelStats) {
    if (levelStat.level === unlockedLevel) {
      // If level is fully mastered, can unlock next level
      if (levelStat.totalWords > 0 && levelStat.masteredWords >= levelStat.totalWords) {
        unlockedLevel++;
      } else {
        break; // Stop at first non-mastered level
      }
    }
  }

  return unlockedLevel;
}

export async function getLevelProgress(languageId: number) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const unlockedLevel = await getUnlockedLevel(languageId);

  // Get progress for current level in a single query
  const levelProgressResult = await db
    .select({
      totalWords: count(vocabulary.id),
      masteredWords: count(userVocabulary.vocabularyId),
    })
    .from(vocabulary)
    .leftJoin(
      userVocabulary,
      and(
        eq(userVocabulary.vocabularyId, vocabulary.id),
        eq(userVocabulary.userId, user.id),
        gte(userVocabulary.srsStage, 4), // Only count mastered words (Guru+)
      ),
    )
    .where(and(eq(vocabulary.languageId, languageId), eq(vocabulary.level, unlockedLevel)));

  const { totalWords, masteredWords } = levelProgressResult[0] || {
    totalWords: 0,
    masteredWords: 0,
  };

  return {
    currentLevel: unlockedLevel,
    totalWords,
    masteredWords,
    progressPercentage: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0,
  };
}

export async function getReviewSchedule(languageId: number) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Get all reviews for the next 24 hours
  const upcomingReviews = await db
    .select({
      nextReviewAt: userVocabulary.nextReviewAt,
    })
    .from(userVocabulary)
    .innerJoin(vocabulary, eq(vocabulary.id, userVocabulary.vocabularyId))
    .where(
      and(
        eq(userVocabulary.userId, user.id),
        eq(vocabulary.languageId, languageId),
        isNotNull(userVocabulary.nextReviewAt),
        gte(userVocabulary.nextReviewAt, now),
        lte(userVocabulary.nextReviewAt, next24Hours),
        ne(userVocabulary.srsStage, 8), // Exclude burned items
      ),
    );

  // Group reviews by hour
  const scheduleMap = new Map<string, number>();

  // Initialize all hours for the next 24 hours with 0 reviews
  for (let i = 0; i < 24; i++) {
    const hourTime = new Date(now.getTime() + i * 60 * 60 * 1000);
    hourTime.setMinutes(0, 0, 0); // Round to hour
    const hourKey = hourTime.toISOString();
    scheduleMap.set(hourKey, 0);
  }

  // Count reviews for each hour
  upcomingReviews.forEach(review => {
    if (review.nextReviewAt) {
      const reviewHour = new Date(review.nextReviewAt);
      reviewHour.setMinutes(0, 0, 0); // Round to hour
      const hourKey = reviewHour.toISOString();

      const currentCount = scheduleMap.get(hourKey) || 0;
      scheduleMap.set(hourKey, currentCount + 1);
    }
  });

  // Convert to array and sort by time
  const schedule = Array.from(scheduleMap.entries())
    .map(([hourString, count]) => ({
      hour: new Date(hourString),
      count,
    }))
    .sort((a, b) => a.hour.getTime() - b.hour.getTime());

  return schedule;
}

export async function getAvailableLessons(
  languageId: number,
  limit?: number,
): Promise<VocabularyItem[]> {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  // Get the current unlocked level
  const unlockedLevel = await getUnlockedLevel(languageId);
  // Get vocabulary that user hasn't started yet from current level
  const availableVocab = await db
    .select({
      id: vocabulary.id,
      word: vocabulary.word,
      meaning: vocabulary.meaning,
      type: vocabulary.type,
      attributes: vocabulary.attributes,
      level: vocabulary.level,
    })
    .from(vocabulary)
    .leftJoin(
      userVocabulary,
      and(eq(userVocabulary.vocabularyId, vocabulary.id), eq(userVocabulary.userId, user.id)),
    )
    .where(
      and(
        eq(vocabulary.languageId, languageId),
        eq(vocabulary.level, unlockedLevel), // Only current unlocked level
        isNull(userVocabulary.vocabularyId), // Not yet started by user
      ),
    )
    .orderBy(vocabulary.level, vocabulary.id);

  const mappedVocab = availableVocab.map(item => ({
    ...item,
    attributes: item.attributes as VocabularyAttributes | null,
  }));

  // If we need to limit results, just return the first N items
  if (limit && mappedVocab.length > limit) {
    return mappedVocab.slice(0, limit);
  }

  return mappedVocab;
}

/**
 * Get level progression information for UI display
 */
export async function getLevelProgressionInfo(languageId: number) {
  const unlockedLevel = await getUnlockedLevel(languageId);
  return await getProgressionSummary(languageId, unlockedLevel);
}

export async function getReviewsReady(languageId: number): Promise<ReviewItem[]> {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const now = new Date();

  const reviewsReady = await db
    .select({
      id: vocabulary.id,
      word: vocabulary.word,
      meaning: vocabulary.meaning,
      type: vocabulary.type,
      attributes: vocabulary.attributes,
      level: vocabulary.level,
      srsStage: userVocabulary.srsStage,
      nextReviewAt: userVocabulary.nextReviewAt,
    })
    .from(userVocabulary)
    .innerJoin(vocabulary, eq(vocabulary.id, userVocabulary.vocabularyId))
    .where(
      and(
        eq(userVocabulary.userId, user.id),
        eq(vocabulary.languageId, languageId), // Only reviews for selected language
        lte(userVocabulary.nextReviewAt, now),
        ne(userVocabulary.srsStage, 8), // Don't include burned items
      ),
    );

  return reviewsReady.map(item => ({
    ...item,
    attributes: item.attributes as VocabularyAttributes | null,
  }));
}

export async function startLearningWord(vocabularyId: number) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const now = new Date();
  const nextReview = new Date(now.getTime() + SRS_INTERVALS[0] * 60 * 60 * 1000); // 4 hours

  // Insert userVocabulary record (only if it doesn't exist)
  const existingUserWord = await db.query.userVocabulary.findFirst({
    where: and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)),
  });

  if (!existingUserWord) {
    await db.insert(userVocabulary).values({
      userId: user.id,
      vocabularyId: vocabularyId,
      srsStage: 0,
      nextReviewAt: nextReview,
      unlockedAt: now,
    });
  }
}

export async function reviewWord(vocabularyId: number, correct: boolean) {
  const user = await getCurrentUser();

  const userWord = await db.query.userVocabulary.findFirst({
    where: and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)),
  });

  if (!userWord) {
    throw new Error('Word not found in user vocabulary');
  }

  const now = new Date();
  let newStage: number;
  let nextReviewAt: Date | null;

  if (correct) {
    // Move up one stage
    newStage = Math.min(userWord.srsStage + 1, 8);
  } else {
    // Move back to apprentice 1 (stage 0)
    newStage = 0;
  }

  // Calculate next review time
  if (newStage === 8) {
    // Burned - no more reviews
    nextReviewAt = null;
  } else {
    const intervalHours = SRS_INTERVALS[newStage as keyof typeof SRS_INTERVALS] as number;
    nextReviewAt = new Date(now.getTime() + intervalHours * 60 * 60 * 1000);
  }

  // Update the record
  await db
    .update(userVocabulary)
    .set({
      srsStage: newStage,
      nextReviewAt: nextReviewAt,
      updatedAt: now,
    })
    .where(and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)));
}

export async function completeLesson(vocabularyIds: number[]) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const now = new Date();
  const nextReview = new Date(now.getTime() + SRS_INTERVALS[0] * 60 * 60 * 1000); // 4 hours
  let wordsUnlocked = 0;

  // Unlock all words from the completed lesson
  for (const vocabularyId of vocabularyIds) {
    // Check if word is already unlocked to avoid duplicates
    const existing = await db.query.userVocabulary.findFirst({
      where: and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)),
    });

    if (!existing) {
      await db.insert(userVocabulary).values({
        userId: user.id,
        vocabularyId: vocabularyId,
        srsStage: 0,
        nextReviewAt: nextReview,
        unlockedAt: now,
      });
      wordsUnlocked++;
    }
  }

  return { success: true, wordsUnlocked };
}

export async function getAllVocabularyWithProgress(languageId: number) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  // Get all vocabulary for the language with user progress
  const vocabularyWithProgress = await db
    .select({
      id: vocabulary.id,
      word: vocabulary.word,
      meaning: vocabulary.meaning,
      type: vocabulary.type,
      level: vocabulary.level,
      attributes: vocabulary.attributes,
      // User progress fields (will be null if not unlocked)
      srsStage: userVocabulary.srsStage,
      nextReviewAt: userVocabulary.nextReviewAt,
      unlockedAt: userVocabulary.unlockedAt,
      updatedAt: userVocabulary.updatedAt,
    })
    .from(vocabulary)
    .leftJoin(
      userVocabulary,
      and(eq(userVocabulary.vocabularyId, vocabulary.id), eq(userVocabulary.userId, user.id)),
    )
    .where(eq(vocabulary.languageId, languageId))
    .orderBy(vocabulary.level, vocabulary.word);

  return vocabularyWithProgress as Array<{
    id: number;
    word: string;
    meaning: string;
    type: string;
    level: number;
    attributes: VocabularyAttributes | null;
    srsStage: number | null;
    nextReviewAt: Date | null;
    unlockedAt: Date | null;
    updatedAt: Date | null;
  }>;
}

/**
 * Get all vocabulary for a specific level with user progress
 */
export async function getVocabularyByLevel(languageId: number, level: number) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const vocabularyForLevel = await db
    .select({
      id: vocabulary.id,
      word: vocabulary.word,
      meaning: vocabulary.meaning,
      type: vocabulary.type,
      level: vocabulary.level,
      attributes: vocabulary.attributes,
      // User progress fields (will be null if not unlocked)
      srsStage: userVocabulary.srsStage,
      nextReviewAt: userVocabulary.nextReviewAt,
      unlockedAt: userVocabulary.unlockedAt,
      updatedAt: userVocabulary.updatedAt,
    })
    .from(vocabulary)
    .leftJoin(
      userVocabulary,
      and(eq(userVocabulary.vocabularyId, vocabulary.id), eq(userVocabulary.userId, user.id)),
    )
    .where(and(eq(vocabulary.languageId, languageId), eq(vocabulary.level, level)))
    .orderBy(vocabulary.word);

  return vocabularyForLevel.map(item => ({
    ...item,
    attributes: item.attributes as VocabularyAttributes | null,
  }));
}
