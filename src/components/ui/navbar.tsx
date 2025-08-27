'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import NextLink from 'next/link';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { useUser } from '@/contexts/user-context';
import { logout } from '@/lib/server/auth.actions';
import {
  updateUserSelectedLanguage,
  getUserSelectedLanguage,
  getLanguages,
} from '@/lib/server/user.actions';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import type { Language } from '@/types';

const NavigationBar = () => {
  const { user, loading, refreshUser } = useUser();
  const { isAdmin } = useAdmin();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLanguagesLoading(false);
        return;
      }

      try {
        const [langs, selectedLang] = await Promise.all([
          getLanguages(),
          getUserSelectedLanguage().catch(() => null),
        ]);

        setLanguages(langs);
        setSelectedLanguage(selectedLang);
      } catch (error) {
        console.error('Error loading language data:', error);
      } finally {
        setLanguagesLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLanguageChange = (languageId: string) => {
    if (!user) return;

    const language = languages.find(lang => lang.id.toString() === languageId);
    if (!language) return;

    // Optimistically update UI
    setSelectedLanguage(language);

    // Use startTransition with server action
    startTransition(async () => {
      try {
        await updateUserSelectedLanguage(language.id);
        router.refresh();
      } catch (error) {
        console.error('Error updating language:', error);
        // Revert optimistic update on error
        setSelectedLanguage(selectedLanguage);
      }
    });
  };

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result?.error) {
        console.error('Logout error:', result.error);
        return;
      }

      // Logout was successful, refresh user state and redirect
      await refreshUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar>
      <NavbarBrand>
        <NextLink href="/" className="font-bold text-inherit">
          Lexikani
        </NextLink>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <NextLink href="/levels" className="text-foreground">
            Levels
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/vocabulary" className="text-foreground">
            Vocabulary
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="w-40">
          <Select
            aria-label="Language"
            placeholder={
              languagesLoading ? 'Loading...' : isPending ? 'Updating...' : 'Select language'
            }
            selectedKeys={selectedLanguage ? [selectedLanguage.id.toString()] : []}
            onSelectionChange={keys => {
              const selectedKey = Array.from(keys)[0] as string;
              if (selectedKey) {
                handleLanguageChange(selectedKey);
              }
            }}
            isDisabled={languagesLoading || languages.length === 0 || isPending}
          >
            {languages.map(language => (
              <SelectItem key={language.id.toString()}>{language.name}</SelectItem>
            ))}
          </Select>
        </NavbarItem>

        {loading ? (
          <NavbarItem>
            <Button disabled>Loading...</Button>
          </NavbarItem>
        ) : user ? (
          <>
            {isAdmin && (
              <NavbarItem>
                <Button
                  as={NextLink}
                  href="/admin"
                  variant="light"
                  startContent={<Cog6ToothIcon className="w-4 h-4" />}
                  size="sm"
                >
                  Admin
                </Button>
              </NavbarItem>
            )}
            <NavbarItem>
              <Button onPress={handleLogout} variant="flat">
                Logout
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <NextLink href="/login">Login</NextLink>
            </NavbarItem>
            <NavbarItem>
              <Button as={NextLink} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavigationBar;
