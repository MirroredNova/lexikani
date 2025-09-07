import { getPaginatedVocabularyForAdmin, getLanguagesForAdmin } from '@/lib/server/admin.actions';
import VocabularyManager from '@/components/admin/vocabulary-manager';
import NextLink from 'next/link';
import { Button } from '@heroui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vocabulary',
  description: 'Manage vocabulary in the Lexikani platform.',
};

interface AdminVocabularyPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    language?: string;
    level?: string;
    type?: string;
    sort?: string;
  }>;
}

export default async function VocabularyPage({ searchParams }: AdminVocabularyPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = 50;

  const filters = {
    searchTerm: params.search,
    languageFilter: params.language,
    levelFilter: params.level,
    typeFilter: params.type,
    sortBy: params.sort,
  };

  const [vocabularyData, languages] = await Promise.all([
    getPaginatedVocabularyForAdmin(page, pageSize, filters),
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

      <VocabularyManager vocabularyData={vocabularyData} languages={languages} filters={filters} />
    </div>
  );
}
