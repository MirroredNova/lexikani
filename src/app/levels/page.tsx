import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import { getLevelProgress, getVocabularyByLevel } from '@/lib/server/vocabulary.actions';

import { LevelAccordion } from '@/components/shared';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Levels',
  description:
    "Track your learning progression across different vocabulary levels. See what you've mastered and what's coming next.",
};

export default async function LevelsPage() {
  const selectedLanguage = await getUserSelectedLanguage();

  if (!selectedLanguage) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold mb-8">Levels</h1>
        <p>No language selected. Please select a language from the navigation bar.</p>
      </div>
    );
  }

  const levelProgress = await getLevelProgress(selectedLanguage.id);

  // Get vocabulary for all levels (we'll determine available levels from this)
  const maxLevel = 20; // You can adjust this based on your data
  const vocabularyByLevel = await Promise.all(
    Array.from({ length: maxLevel }, (_, i) => getVocabularyByLevel(selectedLanguage.id, i + 1)),
  );

  return (
    <div className="container mx-auto max-w-6xl p-6 mb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Levels - {selectedLanguage.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progression through {selectedLanguage.name} vocabulary levels.
        </p>
      </div>

      {/* Current Level Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Level {levelProgress.currentLevel} Progress
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              {levelProgress.masteredWords} / {levelProgress.totalWords} words mastered
            </span>
            <span>•</span>
            <span>{levelProgress.progressPercentage}% complete</span>
          </div>
        </div>
      </div>

      {/* All Levels Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Learning Progression</h2>

        <div className="space-y-4">
          {vocabularyByLevel.map((vocabulary, index) => {
            const level = index + 1;
            const isCurrentLevel = level === levelProgress.currentLevel;
            const isCompleted = level < levelProgress.currentLevel;

            // Only show levels that have vocabulary
            if (vocabulary.length === 0) return null;

            return (
              <LevelAccordion
                key={level}
                level={level}
                isCompleted={isCompleted}
                isCurrentLevel={isCurrentLevel}
                vocabulary={vocabulary}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
