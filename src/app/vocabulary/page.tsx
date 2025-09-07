import { getPaginatedVocabularyWithProgress } from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import VocabularyTable from '@/components/vocabulary/vocabulary-table';
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
      <h1 className="text-3xl font-bold mb-8">Vocabulary - {selectedLanguage.name}</h1>
      <VocabularyTable
        vocabularyData={result.data}
        pagination={result.pagination}
        filters={{ searchTerm, typeFilter, srsFilter, sortBy }}
      />
    </div>
  );
}
