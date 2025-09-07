import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface LevelProgressCardProps {
  currentLevel: number;
  progressPercentage: number;
  masteredWords: number;
  totalWords: number;
  showUnlockMessage?: boolean;
  isCompleted?: boolean;
}

export default function LevelProgressCard({
  currentLevel,
  progressPercentage,
  masteredWords,
  totalWords,
  showUnlockMessage = false,
  isCompleted = false,
}: LevelProgressCardProps) {
  const gradientClass = isCompleted
    ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/30 border-green-200 dark:border-green-800'
    : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/30 border-blue-200 dark:border-blue-800';

  return (
    <Card className={`mb-6 hover:shadow-md transition-all duration-200 ${gradientClass}`}>
      <CardBody className="text-center p-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}>
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <Chip
              size="lg"
              color={isCompleted ? 'success' : 'primary'}
              variant="flat"
              className="font-bold"
            >
              Level {currentLevel}
            </Chip>
          </div>
        </div>

        <p
          className={`text-2xl font-bold mb-2 ${
            isCompleted ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'
          }`}
        >
          {progressPercentage}% Complete
        </p>

        <p
          className={`text-sm mb-4 ${
            isCompleted ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
          }`}
        >
          {masteredWords} of {totalWords} words mastered (Guru level or higher)
        </p>

        {totalWords > 0 && (
          <div
            className={`w-full rounded-full h-3 max-w-md mx-auto ${
              isCompleted ? 'bg-green-200 dark:bg-green-800' : 'bg-blue-200 dark:bg-blue-800'
            }`}
          >
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {showUnlockMessage && (
          <p
            className={`font-medium mt-4 ${
              isCompleted
                ? 'text-green-700 dark:text-green-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}
          >
            {isCompleted ? (
              <span className="flex items-center justify-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                Level {currentLevel} completed! Level {currentLevel + 1} unlocked!
              </span>
            ) : (
              `Master this level to unlock Level ${currentLevel + 1}`
            )}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
