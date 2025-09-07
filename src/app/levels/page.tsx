import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import { getLevelProgress, getVocabularyByLevel } from '@/lib/server/vocabulary.actions';

import { LevelAccordion } from '@/components/shared';
import { Card, CardBody } from '@heroui/card';
import { SparklesIcon } from '@heroicons/react/24/outline';
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
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Levels</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progression through {selectedLanguage.name} vocabulary levels
          </p>
        </div>
      </div>

      {/* Current Level Progress Overview */}
      <Card className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/30 border-purple-200 dark:border-purple-800">
        <CardBody className="p-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
                Level {levelProgress.currentLevel} Progress
              </h2>
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
            {levelProgress.progressPercentage}% Complete
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            {levelProgress.masteredWords} / {levelProgress.totalWords} words mastered (Guru+)
          </p>
          {levelProgress.totalWords > 0 && (
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3 mt-4 mx-auto max-w-md">
              <div
                className="h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress.progressPercentage}%` }}
              />
            </div>
          )}
        </CardBody>
      </Card>

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
