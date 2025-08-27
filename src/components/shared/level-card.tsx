import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface LevelCardProps {
  level: number;
  wordCount: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrentLevel: boolean;
  startHref?: string;
}

export default function LevelCard({
  level,
  wordCount,
  isCompleted,
  isUnlocked,
  isCurrentLevel,
  startHref = '/lessons',
}: LevelCardProps) {
  // Note: We show all levels now, including current level

  const getCardClasses = () => {
    if (isCurrentLevel) {
      return 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-300 dark:border-purple-700 ring-2 ring-purple-200 dark:ring-purple-800';
    }
    if (isCompleted) {
      return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
    }
    if (!isUnlocked) {
      return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
    return 'border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
  };

  const getChipColor = () => {
    if (isCurrentLevel) return 'secondary';
    if (isCompleted) return 'success';
    if (!isUnlocked) return 'default';
    return 'primary';
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${getCardClasses()}`}>
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Chip size="lg" color={getChipColor()} variant="flat" className="font-bold">
              Level {level}
            </Chip>
            <div>
              <h3 className="text-xl font-bold">Level {level}</h3>
              <p className="text-gray-600 dark:text-gray-400">{wordCount} words</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isCurrentLevel && (
              <div className="flex items-center gap-2 text-purple-600 font-medium">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                Current Level
              </div>
            )}
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircleIcon className="w-5 h-5" />
                Complete
              </div>
            )}
            {!isUnlocked && !isCurrentLevel && (
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <LockClosedIcon className="w-5 h-5" />
                Complete previous levels to unlock
              </div>
            )}
            {isUnlocked && !isCompleted && !isCurrentLevel && (
              <Button as={Link} href={startHref} size="sm" color="primary" variant="flat">
                Start Level
              </Button>
            )}
            {isCurrentLevel && (
              <Button as={Link} href={startHref} size="sm" color="secondary" variant="solid">
                Continue Learning
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
