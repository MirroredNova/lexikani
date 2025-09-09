'use server';

import { SRS_INTERVALS } from '@/constants/vocabulary.constants';
import { db } from '@/db/db';
import { vocabulary, userVocabulary } from '@/db/schema';
import { getCurrentUser, ensureUserExists } from '@/lib/server/user.actions';
import type { VocabularyItem, ReviewItem, VocabularyAttributes } from '@/types';
import { eq, and, lte, isNull, ne, count, gte, isNotNull, like, or, SQL, sql } from 'drizzle-orm';

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

  // Use UTC for consistent server-side calculations
  const now = new Date();

  // Get all reviews for the next 7 days
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const allReviews = await db
    .select({
      nextReviewAt: userVocabulary.nextReviewAt,
    })
    .from(userVocabulary)
    .innerJoin(vocabulary, eq(vocabulary.id, userVocabulary.vocabularyId))
    .where(
      and(
        eq(userVocabulary.userId, user.id),
        eq(vocabulary.languageId, languageId),
        ne(userVocabulary.srsStage, 8), // Don't include burned items
        isNotNull(userVocabulary.nextReviewAt),
        lte(userVocabulary.nextReviewAt, in7Days), // Only next 7 days
      ),
    );

  // Create hourly schedule for next 48 hours (2 days)
  // Return schedule with UTC timestamps - client will handle timezone conversion
  const schedule: Array<{ hour: Date; count: number }> = [];
  for (let i = 0; i < 48; i++) {
    const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
    // Round down to the start of the hour in UTC
    hour.setUTCMinutes(0, 0, 0);

    schedule.push({
      hour,
      count: 0,
    });
  }

  // Count reviews per hour
  allReviews.forEach(review => {
    if (!review.nextReviewAt) return;

    const reviewTime = new Date(review.nextReviewAt);
    const hoursSinceNow = Math.floor((reviewTime.getTime() - now.getTime()) / (60 * 60 * 1000));

    // Only count reviews in the next 48 hours
    if (hoursSinceNow >= 0 && hoursSinceNow < 48) {
      schedule[hoursSinceNow].count++;
    }
  });

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
      acceptedAnswers: vocabulary.acceptedAnswers,
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
    .orderBy(sql`RANDOM()`);

  const mappedVocab = availableVocab.map(item => ({
    ...item,
    attributes: item.attributes as VocabularyAttributes | null,
    acceptedAnswers: item.acceptedAnswers as string[] | null,
  }));

  // If we need to limit results, just return the first N items
  if (limit && mappedVocab.length > limit) {
    return mappedVocab.slice(0, limit);
  }

  return mappedVocab;
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
      acceptedAnswers: vocabulary.acceptedAnswers,
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
    )
    .orderBy(sql`RANDOM()`);

  return reviewsReady.map(item => ({
    ...item,
    attributes: item.attributes as VocabularyAttributes | null,
    acceptedAnswers: item.acceptedAnswers as string[] | null,
  }));
}

export async function startLearningWord(vocabularyId: number) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const now = new Date();
  const nextReview = new Date(now.getTime() + SRS_INTERVALS[1] * 60 * 60 * 1000); // 4 hours (SRS 1 interval)

  // Insert userVocabulary record (only if it doesn't exist)
  const existingUserWord = await db.query.userVocabulary.findFirst({
    where: and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)),
  });

  if (!existingUserWord) {
    await db.insert(userVocabulary).values({
      userId: user.id,
      vocabularyId: vocabularyId,
      srsStage: 1, // Start at SRS 1 (Apprentice I) after demonstrating knowledge
      nextReviewAt: nextReview,
      unlockedAt: now,
    });
  }

  return { success: true };
}

export async function reviewWord(vocabularyId: number, correct: boolean) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const now = new Date();

  // Get current user vocabulary record
  const userWord = await db.query.userVocabulary.findFirst({
    where: and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)),
  });

  if (!userWord) {
    throw new Error('Word not found in user vocabulary');
  }

  let newSrsStage = userWord.srsStage;
  let nextReviewAt: Date | null = null;

  if (correct) {
    // Move to next SRS stage (max 9)
    if (newSrsStage < 9) {
      newSrsStage++;
    }
  } else {
    // Reset to Apprentice 1 (stage 1) on incorrect answer
    newSrsStage = 1;
  }

  // Calculate next review time
  const intervalHours = SRS_INTERVALS[newSrsStage as keyof typeof SRS_INTERVALS];
  if (intervalHours !== null) {
    nextReviewAt = new Date(now.getTime() + intervalHours * 60 * 60 * 1000);
  }
  // If intervalHours is null (burned), nextReviewAt stays null

  // Update user vocabulary
  await db
    .update(userVocabulary)
    .set({
      srsStage: newSrsStage,
      nextReviewAt,
      updatedAt: now,
    })
    .where(and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)));

  return {
    success: true,
    newSrsStage,
    nextReviewAt,
  };
}

export async function completeLesson(vocabularyIds: number[]) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const now = new Date();
  const nextReview = new Date(now.getTime() + SRS_INTERVALS[1] * 60 * 60 * 1000); // 4 hours (SRS 1 interval)
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
        srsStage: 1, // Start at SRS 1 (Apprentice I) since they proved knowledge in lesson
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
      acceptedAnswers: vocabulary.acceptedAnswers,
      // User progress fields (will be null if not unlocked)
      srsStage: userVocabulary.srsStage,
      nextReviewAt: userVocabulary.nextReviewAt,
      unlockedAt: userVocabulary.unlockedAt,
      updatedAt: userVocabulary.updatedAt,
      notes: userVocabulary.notes,
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
    notes: string | null;
  }>;
}

type VocabularyFilters = {
  searchTerm?: string;
  typeFilter?: string;
  srsFilter?: string;
  sortBy?: string;
};

export async function getPaginatedVocabularyWithProgress(
  languageId: number,
  page: number = 1,
  pageSize: number = 50,
  filters: VocabularyFilters = {},
) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  const offset = (page - 1) * pageSize;

  // Build where conditions
  const whereConditions: SQL<unknown>[] = [eq(vocabulary.languageId, languageId)];

  // Add search filter
  if (filters.searchTerm?.trim()) {
    const searchTerm = `%${filters.searchTerm.trim()}%`;
    const searchCondition = or(
      like(vocabulary.word, searchTerm),
      like(vocabulary.meaning, searchTerm),
    );
    if (searchCondition) {
      whereConditions.push(searchCondition);
    }
  }

  // Add type filter
  if (filters.typeFilter && filters.typeFilter !== 'all') {
    whereConditions.push(eq(vocabulary.type, filters.typeFilter));
  }

  // SRS filter conditions
  const srsConditions: SQL<unknown>[] = [];
  if (filters.srsFilter && filters.srsFilter !== 'all') {
    if (filters.srsFilter === 'unlearned') {
      const condition = isNull(userVocabulary.srsStage);
      if (condition) srsConditions.push(condition);
    } else if (filters.srsFilter === 'apprentice') {
      const condition = and(gte(userVocabulary.srsStage, 0), lte(userVocabulary.srsStage, 3));
      if (condition) srsConditions.push(condition);
    } else if (filters.srsFilter === 'guru') {
      const condition = and(gte(userVocabulary.srsStage, 4), lte(userVocabulary.srsStage, 5));
      if (condition) srsConditions.push(condition);
    } else if (filters.srsFilter === 'master') {
      srsConditions.push(eq(userVocabulary.srsStage, 6));
    } else if (filters.srsFilter === 'enlightened') {
      srsConditions.push(eq(userVocabulary.srsStage, 7));
    } else if (filters.srsFilter === 'burned') {
      srsConditions.push(eq(userVocabulary.srsStage, 8));
    }
  }

  const allConditions =
    srsConditions.length > 0 ? and(...whereConditions, ...srsConditions) : and(...whereConditions);

  // Determine sort order
  let orderByClause;
  if (filters.sortBy === 'word') {
    orderByClause = [vocabulary.word];
  } else if (filters.sortBy === 'meaning') {
    orderByClause = [vocabulary.meaning];
  } else if (filters.sortBy === 'type') {
    orderByClause = [vocabulary.type, vocabulary.word];
  } else if (filters.sortBy === 'srs') {
    orderByClause = [userVocabulary.srsStage, vocabulary.word];
  } else {
    // Default: level
    orderByClause = [vocabulary.level, vocabulary.word];
  }

  // Single optimized query that gets both data and count using window function
  const results = await db
    .select({
      // Data fields
      id: vocabulary.id,
      word: vocabulary.word,
      meaning: vocabulary.meaning,
      type: vocabulary.type,
      level: vocabulary.level,
      attributes: vocabulary.attributes,
      acceptedAnswers: vocabulary.acceptedAnswers,
      srsStage: userVocabulary.srsStage,
      nextReviewAt: userVocabulary.nextReviewAt,
      unlockedAt: userVocabulary.unlockedAt,
      updatedAt: userVocabulary.updatedAt,
      notes: userVocabulary.notes,
      // Total count using window function (same for all rows)
      totalCount: sql<number>`COUNT(*) OVER()`.as('total_count'),
    })
    .from(vocabulary)
    .leftJoin(
      userVocabulary,
      and(eq(userVocabulary.vocabularyId, vocabulary.id), eq(userVocabulary.userId, user.id)),
    )
    .where(allConditions)
    .orderBy(...orderByClause)
    .limit(pageSize)
    .offset(offset);

  // Extract data and total count from results
  const vocabularyData = results.map(({ ...data }) => data);
  const totalCount = results[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: vocabularyData as Array<{
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
      notes: string | null;
    }>,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
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
      acceptedAnswers: vocabulary.acceptedAnswers,
      // User progress fields (will be null if not unlocked)
      srsStage: userVocabulary.srsStage,
      nextReviewAt: userVocabulary.nextReviewAt,
      unlockedAt: userVocabulary.unlockedAt,
      updatedAt: userVocabulary.updatedAt,
      notes: userVocabulary.notes,
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
    acceptedAnswers: item.acceptedAnswers as string[] | null,
  }));
}
