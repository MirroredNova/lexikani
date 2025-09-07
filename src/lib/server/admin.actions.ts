'use server';

import { db } from '@/db/db';
import { language, vocabulary, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/server/user.actions';
import { eq, and, like, or, count, SQL } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { VocabularyAttributes, VocabularyType } from '@/types';
import { generateAcceptableAnswers } from '@/lib/utils/text';

// Check if current user is admin
export async function requireAdmin() {
  const user = await getCurrentUser();

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (!dbUser?.isAdmin) {
    redirect('/');
  }

  return dbUser;
}

// Language Management
export async function createLanguage(formData: FormData) {
  await requireAdmin();

  const name = formData.get('name') as string;
  const code = formData.get('code') as string;

  if (!name || !code) {
    return { error: 'Name and code are required' };
  }

  try {
    await db.insert(language).values({
      name,
      code: code.toLowerCase(),
    });

    revalidatePath('/admin/languages');
    return { success: true };
  } catch (error) {
    console.error('Error creating language:', error);
    return { error: 'Failed to create language' };
  }
}

export async function updateLanguage(id: number, formData: FormData) {
  await requireAdmin();

  const name = formData.get('name') as string;
  const code = formData.get('code') as string;

  if (!name || !code) {
    return { error: 'Name and code are required' };
  }

  try {
    await db.update(language).set({ name, code: code.toLowerCase() }).where(eq(language.id, id));

    revalidatePath('/admin/languages');
    return { success: true };
  } catch (error) {
    console.error('Error updating language:', error);
    return { error: 'Failed to update language' };
  }
}

export async function deleteLanguage(id: number) {
  await requireAdmin();

  try {
    await db.delete(language).where(eq(language.id, id));

    revalidatePath('/admin/languages');
    return { success: true };
  } catch (error) {
    console.error('Error deleting language:', error);
    return { error: 'Failed to delete language' };
  }
}

// Vocabulary Management
export async function createVocabulary(formData: FormData) {
  await requireAdmin();

  const languageId = parseInt(formData.get('languageId') as string);
  const word = formData.get('word') as string;
  const meaning = formData.get('meaning') as string;
  const level = parseInt(formData.get('level') as string);
  const type = formData.get('type') as string;
  const attributesJson = formData.get('attributes') as string;
  const acceptedAnswersJson = formData.get('acceptedAnswers') as string;

  if (!languageId || !word || !meaning || !level || !type) {
    return { error: 'All fields are required' };
  }

  let attributes: VocabularyAttributes | null = null;
  if (attributesJson && attributesJson.trim()) {
    try {
      attributes = JSON.parse(attributesJson.trim());
    } catch {
      return { error: 'Invalid attributes JSON' };
    }
  }

  let acceptedAnswers: string[] | null = null;
  if (acceptedAnswersJson && acceptedAnswersJson.trim()) {
    try {
      const parsed = JSON.parse(acceptedAnswersJson.trim());
      if (Array.isArray(parsed)) {
        // Ensure all items are strings
        acceptedAnswers = parsed.filter(item => typeof item === 'string' && item.trim());
      } else {
        return { error: 'Accepted answers must be a JSON array' };
      }
    } catch (error) {
      console.error('JSON parse error for accepted answers:', error);
      return { error: 'Invalid accepted answers JSON format' };
    }
  }

  try {
    await db.insert(vocabulary).values({
      languageId,
      word,
      meaning,
      level,
      type: type as VocabularyType,
      attributes,
      acceptedAnswers,
    });

    revalidatePath('/admin/vocabulary');
    return { success: true };
  } catch (error) {
    console.error('Error creating vocabulary:', error);
    return { error: 'Failed to create vocabulary' };
  }
}

export async function updateVocabulary(id: number, formData: FormData) {
  await requireAdmin();

  const word = formData.get('word') as string;
  const meaning = formData.get('meaning') as string;
  const level = parseInt(formData.get('level') as string);
  const type = formData.get('type') as string;
  const attributesJson = formData.get('attributes') as string;
  const acceptedAnswersJson = formData.get('acceptedAnswers') as string;

  if (!word || !meaning || !level || !type) {
    return { error: 'All fields are required' };
  }

  let attributes: VocabularyAttributes | null = null;
  if (attributesJson && attributesJson.trim()) {
    try {
      attributes = JSON.parse(attributesJson.trim());
    } catch {
      return { error: 'Invalid attributes JSON' };
    }
  }

  let acceptedAnswers: string[] | null = null;
  if (acceptedAnswersJson && acceptedAnswersJson.trim()) {
    try {
      const parsed = JSON.parse(acceptedAnswersJson.trim());
      if (Array.isArray(parsed)) {
        // Ensure all items are strings
        acceptedAnswers = parsed.filter(item => typeof item === 'string' && item.trim());
      } else {
        return { error: 'Accepted answers must be a JSON array' };
      }
    } catch (error) {
      console.error('JSON parse error for accepted answers:', error);
      return { error: 'Invalid accepted answers JSON format' };
    }
  }

  try {
    await db
      .update(vocabulary)
      .set({
        word,
        meaning,
        level,
        type: type as VocabularyType,
        attributes,
        acceptedAnswers,
      })
      .where(eq(vocabulary.id, id));

    revalidatePath('/admin/vocabulary');
    return { success: true };
  } catch (error) {
    console.error('Error updating vocabulary:', error);
    return { error: 'Failed to update vocabulary' };
  }
}

export async function deleteVocabulary(id: number) {
  await requireAdmin();

  try {
    await db.delete(vocabulary).where(eq(vocabulary.id, id));

    revalidatePath('/admin/vocabulary');
    return { success: true };
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    return { error: 'Failed to delete vocabulary' };
  }
}

// Get data for admin pages
export async function getLanguagesForAdmin() {
  await requireAdmin();

  return await db.query.language.findMany({
    orderBy: (language, { asc }) => [asc(language.name)],
  });
}

export async function getVocabularyForAdmin(languageId?: number) {
  await requireAdmin();

  const vocabularyResult = await db.query.vocabulary.findMany({
    with: {
      language: true,
    },
    orderBy: (vocabulary, { asc }) => [asc(vocabulary.level), asc(vocabulary.word)],
    ...(languageId && { where: eq(vocabulary.languageId, languageId) }),
  });

  return vocabularyResult.map(item => ({
    ...item,
    attributes: item.attributes as Record<string, unknown> | null,
    acceptedAnswers: item.acceptedAnswers as string[] | null,
  }));
}

type AdminVocabularyFilters = {
  searchTerm?: string;
  languageFilter?: string;
  levelFilter?: string;
  typeFilter?: string;
  sortBy?: string;
};

export async function getPaginatedVocabularyForAdmin(
  page: number = 1,
  pageSize: number = 50,
  filters: AdminVocabularyFilters = {},
) {
  await requireAdmin();

  const offset = (page - 1) * pageSize;

  // Build where conditions
  const whereConditions: SQL<unknown>[] = [];

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

  // Add language filter
  if (filters.languageFilter && filters.languageFilter !== 'all') {
    whereConditions.push(eq(vocabulary.languageId, parseInt(filters.languageFilter)));
  }

  // Add level filter
  if (filters.levelFilter && filters.levelFilter !== 'all') {
    whereConditions.push(eq(vocabulary.level, parseInt(filters.levelFilter)));
  }

  // Add type filter
  if (filters.typeFilter && filters.typeFilter !== 'all') {
    whereConditions.push(eq(vocabulary.type, filters.typeFilter));
  }

  const allConditions = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  // Get total count for pagination
  const totalCountResult = await db
    .select({ count: count() })
    .from(vocabulary)
    .where(allConditions);

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Get paginated data with sorting
  let orderByClause;
  if (filters.sortBy === 'word') {
    orderByClause = [vocabulary.word];
  } else if (filters.sortBy === 'meaning') {
    orderByClause = [vocabulary.meaning];
  } else if (filters.sortBy === 'type') {
    orderByClause = [vocabulary.type, vocabulary.word];
  } else {
    // Default: level, then word
    orderByClause = [vocabulary.level, vocabulary.word];
  }

  const vocabularyResult = await db
    .select({
      id: vocabulary.id,
      word: vocabulary.word,
      meaning: vocabulary.meaning,
      level: vocabulary.level,
      type: vocabulary.type,
      attributes: vocabulary.attributes,
      acceptedAnswers: vocabulary.acceptedAnswers,
      languageId: vocabulary.languageId,
    })
    .from(vocabulary)
    .where(allConditions)
    .orderBy(...orderByClause)
    .limit(pageSize)
    .offset(offset);

  // Get language info for each vocabulary item
  const languageIds = [...new Set(vocabularyResult.map(item => item.languageId))];
  const languageData = await db.query.language.findMany({
    where: or(...languageIds.map(id => eq(language.id, id))),
  });

  const languageMap = new Map(languageData.map(lang => [lang.id, lang]));

  const vocabularyWithLanguages = vocabularyResult.map(item => ({
    ...item,
    language: languageMap.get(item.languageId) || {
      id: item.languageId,
      name: 'Unknown',
      code: 'unknown',
    },
  }));

  return {
    data: vocabularyWithLanguages.map(item => ({
      ...item,
      attributes: item.attributes as Record<string, unknown> | null,
      acceptedAnswers: item.acceptedAnswers as string[] | null,
    })),
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

// User Management
export async function toggleUserAdmin(userId: string) {
  await requireAdmin();

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { error: 'User not found' };
    }

    await db.update(users).set({ isAdmin: !user.isAdmin }).where(eq(users.id, userId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error toggling user admin:', error);
    return { error: 'Failed to update user' };
  }
}

export async function getUsersForAdmin() {
  await requireAdmin();

  return await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });
}

// Accepted Answers Management
export async function regenerateAcceptedAnswersForWord(vocabularyId: number) {
  await requireAdmin();

  try {
    // Get the vocabulary item
    const vocabItem = await db.query.vocabulary.findFirst({
      where: eq(vocabulary.id, vocabularyId),
    });

    if (!vocabItem) {
      return { error: 'Vocabulary item not found' };
    }

    // Generate new accepted answers
    const newAcceptedAnswers = generateAcceptableAnswers(vocabItem.meaning);

    // Update the vocabulary item
    await db
      .update(vocabulary)
      .set({
        acceptedAnswers: newAcceptedAnswers,
      })
      .where(eq(vocabulary.id, vocabularyId));

    revalidatePath('/admin/vocabulary');
    return {
      success: true,
      acceptedAnswers: newAcceptedAnswers,
      message: `Generated ${newAcceptedAnswers.length} accepted answers for "${vocabItem.word}"`,
    };
  } catch (error) {
    console.error('Error regenerating accepted answers:', error);
    return { error: 'Failed to regenerate accepted answers' };
  }
}

export async function regenerateAllAcceptedAnswers(languageId?: number) {
  await requireAdmin();

  try {
    // Get vocabulary items to update
    const vocabularyItems = await db.query.vocabulary.findMany({
      where: languageId ? eq(vocabulary.languageId, languageId) : undefined,
      orderBy: (vocabulary, { asc }) => [asc(vocabulary.level), asc(vocabulary.word)],
    });

    let updatedCount = 0;
    const results: Array<{ word: string; meaning: string; acceptedAnswers: string[] }> = [];

    for (const item of vocabularyItems) {
      const newAcceptedAnswers = generateAcceptableAnswers(item.meaning);

      await db
        .update(vocabulary)
        .set({
          acceptedAnswers: newAcceptedAnswers,
        })
        .where(eq(vocabulary.id, item.id));

      updatedCount++;

      // Store examples of first 5 updates
      if (results.length < 5) {
        results.push({
          word: item.word,
          meaning: item.meaning,
          acceptedAnswers: newAcceptedAnswers,
        });
      }
    }

    revalidatePath('/admin/vocabulary');
    return {
      success: true,
      updatedCount,
      totalCount: vocabularyItems.length,
      examples: results,
      message: `Regenerated accepted answers for ${updatedCount} vocabulary entries`,
    };
  } catch (error) {
    console.error('Error regenerating all accepted answers:', error);
    return { error: 'Failed to regenerate accepted answers' };
  }
}
