import { getAllVocabularyWithProgress } from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import VocabularyTable from '@/components/vocabulary/vocabulary-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vocabulary',
  description:
    'Browse and manage your vocabulary collection. Track learning progress and SRS levels for all words.',
};

export default async function VocabularyPage() {
  const selectedLanguage = await getUserSelectedLanguage();

  if (!selectedLanguage) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold mb-8">Vocabulary</h1>
        <p>No language selected. Please select a language from the navigation bar.</p>
      </div>
    );
  }

  const vocabularyWithProgress = await getAllVocabularyWithProgress(selectedLanguage.id);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-8">Vocabulary - {selectedLanguage.name}</h1>
      <VocabularyTable vocabularyData={vocabularyWithProgress} />
    </div>
  );
}
