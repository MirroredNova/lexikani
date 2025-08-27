'use server';

import { db } from '@/db/db';
import { language, vocabulary, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/server/user.actions';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { VocabularyAttributes } from '@/types';

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
    await db.update(language)
      .set({ name, code: code.toLowerCase() })
      .where(eq(language.id, id));

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

  if (!languageId || !word || !meaning || !level || !type) {
    return { error: 'All fields are required' };
  }

  let attributes: VocabularyAttributes | null = null;
  if (attributesJson) {
    try {
      attributes = JSON.parse(attributesJson);
    } catch {
      return { error: 'Invalid attributes JSON' };
    }
  }

  try {
    await db.insert(vocabulary).values({
      languageId,
      word,
      meaning,
      level,
      type: type as any,
      attributes,
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

  if (!word || !meaning || !level || !type) {
    return { error: 'All fields are required' };
  }

  let attributes: VocabularyAttributes | null = null;
  if (attributesJson) {
    try {
      attributes = JSON.parse(attributesJson);
    } catch {
      return { error: 'Invalid attributes JSON' };
    }
  }

  try {
    await db.update(vocabulary)
      .set({
        word,
        meaning,
        level,
        type: type as any,
        attributes,
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
  }));
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

    await db.update(users)
      .set({ isAdmin: !user.isAdmin })
      .where(eq(users.id, userId));

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
