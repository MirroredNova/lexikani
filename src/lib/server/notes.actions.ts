'use server';

import { db } from '@/db/db';
import { userVocabulary } from '@/db/schema';
import { getCurrentUser, ensureUserExists } from '@/lib/server/user.actions';
import { eq, and } from 'drizzle-orm';

export async function updateVocabularyNote(vocabularyId: number, note: string) {
  const user = await getCurrentUser();
  await ensureUserExists(user.id, user.email || '');

  try {
    // Check if user vocabulary entry exists
    const existingEntry = await db.query.userVocabulary.findFirst({
      where: and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)),
    });

    if (!existingEntry) {
      // If user hasn't started learning this word yet, create an entry
      await db.insert(userVocabulary).values({
        userId: user.id,
        vocabularyId: vocabularyId,
        srsStage: 0,
        notes: note.trim() || null,
        unlockedAt: new Date(),
      });
    } else {
      // Update existing entry
      await db
        .update(userVocabulary)
        .set({
          notes: note.trim() || null,
          updatedAt: new Date(),
        })
        .where(
          and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)),
        );
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating vocabulary note:', error);
    return { success: false, error: 'Failed to update note' };
  }
}

export async function getVocabularyNote(vocabularyId: number): Promise<string | null> {
  const user = await getCurrentUser();

  try {
    const entry = await db.query.userVocabulary.findFirst({
      where: and(eq(userVocabulary.userId, user.id), eq(userVocabulary.vocabularyId, vocabularyId)),
    });

    return entry?.notes || null;
  } catch (error) {
    console.error('Error getting vocabulary note:', error);
    return null;
  }
}
