'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

export async function ensureUserExists(userId: string, email: string, name?: string) {
  // Check if user exists in our database
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      selectedLanguage: true,
    },
  });

  if (!existingUser) {
    // Get the first available language to set as default
    const firstLanguage = await db.query.language.findFirst();

    // Create user in our database
    await db.insert(users).values({
      id: userId,
      email: email,
      name: name || null,
      selectedLanguageId: firstLanguage?.id || null,
    });
  } else if (!existingUser.selectedLanguageId) {
    // If user exists but has no selected language, set the first available language
    const firstLanguage = await db.query.language.findFirst();
    if (firstLanguage) {
      await db
        .update(users)
        .set({ selectedLanguageId: firstLanguage.id })
        .where(eq(users.id, userId));
    }
  }
}

export async function getUserSelectedLanguage() {
  const user = await getCurrentUser();

  const userWithLanguage = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    with: {
      selectedLanguage: true,
    },
  });

  return userWithLanguage?.selectedLanguage || null;
}

export async function updateUserSelectedLanguage(languageId: number) {
  const user = await getCurrentUser();

  await db.update(users).set({ selectedLanguageId: languageId }).where(eq(users.id, user.id));
}

export async function getLanguages() {
  return await db.query.language.findMany({
    orderBy: (language, { asc }) => [asc(language.name)],
  });
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    return dbUser?.isAdmin || false;
  } catch {
    return false;
  }
}
