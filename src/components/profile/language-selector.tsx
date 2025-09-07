'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Select, SelectItem } from '@heroui/select';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import {
  updateUserSelectedLanguage,
  getUserSelectedLanguage,
  getLanguages,
} from '@/lib/server/user.actions';
import { useUser } from '@/contexts/user-context';
import type { Language } from '@/types';

export default function LanguageSelector() {
  const { user } = useUser();
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
    const previousLanguage = selectedLanguage;
    setSelectedLanguage(language);

    // Use startTransition with server action
    startTransition(async () => {
      try {
        await updateUserSelectedLanguage(language.id);
        router.refresh();
      } catch (error) {
        console.error('Error updating language:', error);
        // Revert optimistic update on error
        setSelectedLanguage(previousLanguage);
      }
    });
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Learning Language</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <p className="text-sm text-default-600">
            Choose the language you want to learn. This affects which vocabulary and lessons
            you&apos;ll see.
          </p>

          <div className="flex items-center gap-4">
            <Select
              aria-label="Learning Language"
              placeholder={
                languagesLoading
                  ? 'Loading languages...'
                  : isPending
                    ? 'Updating...'
                    : 'Select a language'
              }
              selectedKeys={selectedLanguage ? [selectedLanguage.id.toString()] : []}
              onSelectionChange={keys => {
                const selectedKey = Array.from(keys)[0] as string;
                if (selectedKey) {
                  handleLanguageChange(selectedKey);
                }
              }}
              isDisabled={languagesLoading || languages.length === 0 || isPending}
              className="flex-1"
            >
              {languages.map(language => (
                <SelectItem key={language.id.toString()}>{language.name}</SelectItem>
              ))}
            </Select>

            {isPending && (
              <Button isLoading size="sm" disabled>
                Saving...
              </Button>
            )}
          </div>

          {selectedLanguage && (
            <div className="p-3 bg-success/10 rounded-lg">
              <p className="text-sm text-success-700">
                Currently learning: <strong>{selectedLanguage.name}</strong>
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
