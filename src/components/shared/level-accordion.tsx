'use client';

import React, { useState } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getSrsStageInfo } from '@/lib/utils/srs';
import type { VocabularyWithProgress } from '@/types';

interface LevelAccordionProps {
  level: number;
  isCompleted: boolean;
  isCurrentLevel: boolean;
  vocabulary: VocabularyWithProgress[];
}

export default function LevelAccordion({
  level,
  isCompleted,
  isCurrentLevel,
  vocabulary,
}: LevelAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(isCurrentLevel); // Start current level expanded

  const getCardClasses = () => {
    if (isCurrentLevel) {
      return 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-300 dark:border-purple-700 ring-2 ring-purple-200 dark:ring-purple-800';
    }
    if (isCompleted) {
      return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
    }
    return 'border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50';
  };

  const getChipColor = () => {
    if (isCurrentLevel) return 'secondary';
    if (isCompleted) return 'success';
    return 'default';
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${getCardClasses()}`}>
      <CardBody className="p-0">
        {/* Accordion Header */}
        <div
          className="flex items-center justify-between w-full p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <Chip size="lg" color={getChipColor()} variant="flat" className="font-bold">
              {level}
            </Chip>
            <div>
              <h3 className="text-xl font-bold text-left">Level {level}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-left">
                {vocabulary.length} words
              </p>
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
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {/* Accordion Content */}
        {isExpanded && (
          <div className="px-6 pb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {/* Vocabulary List */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Vocabulary ({vocabulary.length} words)
                </h4>

                {vocabulary.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No vocabulary found for this level.
                  </p>
                )}

                {vocabulary.length > 0 && (
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {vocabulary.map(word => {
                      const srsInfo = getSrsStageInfo(word.srsStage);

                      return (
                        <div
                          key={word.id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {word.word}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">→</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {word.meaning}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Chip size="sm" variant="flat" color="default">
                                {word.type}
                              </Chip>
                              {word.srsStage !== null && (
                                <Chip size="sm" variant="flat" color={srsInfo.color}>
                                  {srsInfo.name}
                                </Chip>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
