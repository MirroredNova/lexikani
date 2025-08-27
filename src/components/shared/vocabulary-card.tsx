import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import SrsChip from './srs-chip';
import GrammarInfo from './grammar-info';
import type { VocabularyAttributes } from '@/types';

interface VocabularyCardProps {
  word: string;
  meaning: string;
  type: string;
  level: number;
  attributes: VocabularyAttributes | null;
  srsStage?: number | null;
  nextReviewAt?: Date | null;
  unlockedAt?: Date | null;
  updatedAt?: Date | null;
  formatNextReview?: (date: Date | null) => string;
  variant?: 'full' | 'simple';
}

export default function VocabularyCard({
  word,
  meaning,
  type,
  level,
  attributes,
  srsStage,
  nextReviewAt,
  unlockedAt,
  updatedAt,
  formatNextReview,
  variant = 'full',
}: VocabularyCardProps) {
  if (variant === 'simple') {
    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardBody className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Chip size="sm" color="primary" variant="flat">
                {type}
              </Chip>
              <Chip size="sm" variant="bordered">
                Level {level}
              </Chip>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">{word}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">{meaning}</p>
            </div>
            <GrammarInfo type={type} attributes={attributes} variant="card" />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
          {/* Word & Meaning */}
          <div className="md:col-span-2 space-y-2">
            <div>
              <h4 className="text-lg font-semibold text-primary">{word}</h4>
              <p className="text-gray-700 dark:text-gray-300">{meaning}</p>
            </div>
            <GrammarInfo type={type} attributes={attributes} variant="inline" size="sm" />
          </div>

          {/* Type & Level */}
          <div className="space-y-2">
            <Chip size="sm" color="primary" variant="flat">
              {type}
            </Chip>
            <div className="text-sm text-gray-600 dark:text-gray-400">Level {level}</div>
          </div>

          {/* SRS Status */}
          <div className="space-y-2">
            <SrsChip srsStage={srsStage ?? null} showStageNumber={true} />
          </div>

          {/* Next Review */}
          {(nextReviewAt !== undefined || srsStage !== undefined) && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Next Review</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatNextReview ? formatNextReview(nextReviewAt || null) : 'N/A'}
              </div>
            </div>
          )}

          {/* Dates */}
          {(unlockedAt || updatedAt) && (
            <div className="space-y-2">
              {unlockedAt && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <div>Unlocked:</div>
                  <div>{new Date(unlockedAt).toLocaleDateString()}</div>
                </div>
              )}
              {updatedAt && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <div>Last Review:</div>
                  <div>{new Date(updatedAt).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
