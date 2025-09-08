'use client';

import React from 'react';
import { VocabularyCard, VocabularyNotes } from '@/components/shared';
import type { VocabularyAttributes } from '@/types';

interface WordDetailsPanelProps {
  id: number;
  word: string;
  meaning: string;
  type: string;
  level: number;
  attributes: VocabularyAttributes | null;
  srsStage?: number;
}

export default function WordDetailsPanel({
  id,
  word,
  meaning,
  type,
  level,
  attributes,
  srsStage,
}: WordDetailsPanelProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-4">
      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Word Details</h4>
      <VocabularyCard
        id={id}
        word={word}
        meaning={meaning}
        type={type}
        level={level}
        attributes={attributes}
        srsStage={srsStage}
        variant="simple"
      />
      <div className="flex justify-center pt-2">
        <VocabularyNotes vocabularyId={id} word={word} variant="button" size="sm" />
      </div>
    </div>
  );
}
