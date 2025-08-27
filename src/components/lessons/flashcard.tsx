import React from 'react';
import { VocabularyItem } from '@/types';
import { VocabularyCard } from '@/components/shared';

type Props = {
  word: VocabularyItem;
};

const Flashcard = ({ word }: Props) => {
  return (
    <div className="max-w-lg mx-auto">
      <VocabularyCard
        word={word.word}
        meaning={word.meaning}
        type={word.type}
        level={word.level}
        attributes={word.attributes}
        variant="simple"
      />
    </div>
  );
};

export default Flashcard;
