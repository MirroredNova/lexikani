import { getVocabularyForAdmin, getLanguagesForAdmin } from '@/lib/server/admin.actions';
import VocabularyManager from '@/components/admin/vocabulary-manager';
import NextLink from 'next/link';
import { Button } from '@heroui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vocabulary',
  description: 'Manage vocabulary in the Lexikani platform.',
};

export default async function VocabularyPage() {
  const [vocabulary, languages] = await Promise.all([
    getVocabularyForAdmin(),
    getLanguagesForAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          as={NextLink}
          href="/admin"
          variant="light"
          startContent={<ArrowLeftIcon className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Vocabulary Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add, edit, and manage vocabulary words across all languages
        </p>
      </div>

      <VocabularyManager initialVocabulary={vocabulary} languages={languages} />
    </div>
  );
}
