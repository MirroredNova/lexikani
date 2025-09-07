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
  return (
    <Card className="mb-6 hover:shadow-md transition-all duration-200">
      <CardBody className="text-center p-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Chip size="lg" color="primary" variant="flat">
            Level {currentLevel}
          </Chip>
          <span className={`text-2xl font-bold ${isCompleted ? 'text-success' : 'text-warning'}`}>
            {progressPercentage}% Complete
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {masteredWords} of {totalWords} words mastered (Guru level or higher)
        </p>
        {totalWords > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-success' : 'bg-warning'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        {showUnlockMessage && (
          <p
            className={`font-medium mt-2 ${
              isCompleted
                ? 'text-green-600 dark:text-green-400'
                : 'text-blue-600 dark:text-blue-400'
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
