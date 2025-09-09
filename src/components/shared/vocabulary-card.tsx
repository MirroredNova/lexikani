import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import SrsChip from './srs-chip';
import GrammarInfo from './grammar-info';
import VocabularyNotes from './vocabulary-notes';
import type { VocabularyAttributes } from '@/types';

interface VocabularyCardProps {
  id: number;
  word: string;
  meaning: string;
  type: string;
  level: number;
  attributes: VocabularyAttributes | null;
  srsStage?: number | null;
  nextReviewAt?: Date | null;
  unlockedAt?: Date | null;
  updatedAt?: Date | null;
  notes?: string | null;
  formatNextReview?: (date: Date | null) => string;
  variant?: 'full' | 'simple';
}

const VocabularyCard = React.memo<VocabularyCardProps>(function VocabularyCard({
  id,
  word,
  meaning,
  type,
  level,
  attributes,
  srsStage,
  nextReviewAt,
  unlockedAt,
  updatedAt,
  notes,
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
      <CardBody className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Main Content - Word & Meaning */}
          <div className="flex-1 min-w-0 basis-full sm:basis-auto">
            <div className="flex items-baseline gap-2 mb-1">
              <h4 className="text-lg font-semibold text-primary truncate">{word}</h4>
              <Chip size="sm" color="primary" variant="flat" className="shrink-0">
                {type}
              </Chip>
              <span className="text-xs text-gray-500 shrink-0">L{level}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-1 line-clamp-2">{meaning}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <GrammarInfo type={type} attributes={attributes} variant="inline" size="sm" />
            </div>
          </div>

          {/* SRS & Status */}
          <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto sm:ml-auto mt-1 sm:mt-0">
            <SrsChip srsStage={srsStage ?? null} showStageNumber={false} size="sm" />

            {/* Next Review - compact */}
            {(nextReviewAt !== undefined || srsStage !== undefined) && formatNextReview && (
              <div className="text-xs text-gray-600 dark:text-gray-400 text-center min-w-0">
                <div className="font-medium">Next</div>
                <div className="truncate">{formatNextReview(nextReviewAt || null)}</div>
              </div>
            )}

            {/* Notes */}
            <VocabularyNotes
              vocabularyId={id}
              word={word}
              initialNote={notes}
              variant="icon"
              size="sm"
            />
          </div>
        </div>

        {/* Optional secondary info - only show if dates exist */}
        {(unlockedAt || updatedAt) && (
          <div className="flex gap-4 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {unlockedAt && (
              <span className="text-xs text-gray-500">
                Unlocked{' '}
                {new Date(unlockedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            {updatedAt && (
              <span className="text-xs text-gray-500">
                Reviewed{' '}
                {new Date(updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
});

export default VocabularyCard;
