'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name, // Store name in Supabase user metadata
      },
    },
  });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  // If user was created successfully, create database record
  if (authData.user) {
    try {
      const { ensureUserExists } = await import('./user.actions');
      await ensureUserExists(authData.user.id, email, name);
    } catch (dbError) {
      console.error('Error creating user in database:', dbError);
      // Don't return error here as Supabase user was created successfully
      // The ensureUserExists will be called later when user accesses protected routes
    }
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
