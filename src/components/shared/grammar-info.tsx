import React from 'react';
import type { VocabularyAttributes, NounAttributes, VerbAttributes } from '@/types';

interface GrammarInfoProps {
  type: string;
  attributes: VocabularyAttributes | null;
  variant?: 'card' | 'inline';
  size?: 'sm' | 'md';
}

export default function GrammarInfo({
  type,
  attributes,
  variant = 'card',
  size = 'md',
}: GrammarInfoProps) {
  if (!attributes) return null;

  const textSizeClass = size === 'sm' ? 'text-xs' : 'text-sm';
  const titleClass = variant === 'card' ? 'font-medium mb-2' : 'font-medium';
  const containerClass = variant === 'card' ? 'bg-gray-50 dark:bg-gray-700 rounded-lg p-4' : '';

  const renderGrammarDetails = () => {
    switch (type) {
      case 'noun': {
        const nounAttrs = attributes as NounAttributes;
        return (
          <div className={`${textSizeClass} space-y-1 text-gray-600 dark:text-gray-400`}>
            {nounAttrs.gender && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Gender:</span> {nounAttrs.gender}
              </div>
            )}
            {nounAttrs.article && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Article:</span>{' '}
                {nounAttrs.article}
              </div>
            )}
            {nounAttrs.plural && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Plural:</span> {nounAttrs.plural}
              </div>
            )}
          </div>
        );
      }
      case 'verb': {
        const verbAttrs = attributes as VerbAttributes;
        return (
          <div className={`${textSizeClass} space-y-1 text-gray-600 dark:text-gray-400`}>
            {verbAttrs.infinitive && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Infinitive:</span>{' '}
                {verbAttrs.infinitive}
              </div>
            )}
            {verbAttrs.present && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Present:</span>{' '}
                {verbAttrs.present}
              </div>
            )}
            {verbAttrs.past && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Past:</span> {verbAttrs.past}
              </div>
            )}
            {verbAttrs.perfect && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Perfect:</span>{' '}
                {verbAttrs.perfect}
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const grammarContent = renderGrammarDetails();
  if (!grammarContent) return null;

  return (
    <div className={containerClass}>
      {variant === 'card' && (
        <h4 className={`${titleClass} text-gray-700 dark:text-gray-300`}>Grammar</h4>
      )}
      {grammarContent}
    </div>
  );
}
