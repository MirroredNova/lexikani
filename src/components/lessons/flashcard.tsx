import React from 'react';
import { VocabularyItem } from '@/types';
import { VocabularyCard, VocabularyNotes } from '@/components/shared';

type Props = {
  word: VocabularyItem;
};

const Flashcard = ({ word }: Props) => {
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <VocabularyCard
        id={word.id}
        word={word.word}
        meaning={word.meaning}
        type={word.type}
        level={word.level}
        attributes={word.attributes}
        variant="simple"
      />

      <div className="flex justify-center">
        <VocabularyNotes vocabularyId={word.id} word={word.word} variant="button" size="sm" />
      </div>
    </div>
  );
};

export default Flashcard;
