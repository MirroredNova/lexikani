import { getPaginatedVocabularyWithProgress } from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import VocabularyTable from '@/components/vocabulary/vocabulary-table';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vocabulary',
  description:
    'Browse and manage your vocabulary collection. Track learning progress and SRS levels for all words.',
};

interface VocabularyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VocabularyPage({ searchParams }: VocabularyPageProps) {
  const selectedLanguage = await getUserSelectedLanguage();

  if (!selectedLanguage) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold mb-8">Vocabulary</h1>
        <p>No language selected. Please select a language from the navigation bar.</p>
      </div>
    );
  }

  // Extract search params (await the searchParams promise)
  const params = await searchParams;
  const page = parseInt(params.page as string) || 1;
  const searchTerm = (params.search as string) || '';
  const typeFilter = (params.type as string) || 'all';
  const srsFilter = (params.srs as string) || 'all';
  const sortBy = (params.sort as string) || 'level';

  const result = await getPaginatedVocabularyWithProgress(
    selectedLanguage.id,
    page,
    50, // pageSize
    { searchTerm, typeFilter, srsFilter, sortBy },
  );

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
            <BookOpenIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Vocabulary Collection</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and manage your {selectedLanguage.name} vocabulary progress
          </p>
        </div>
      </div>

      <VocabularyTable
        vocabularyData={result.data}
        pagination={result.pagination}
        filters={{ searchTerm, typeFilter, srsFilter, sortBy }}
      />
    </div>
  );
}
