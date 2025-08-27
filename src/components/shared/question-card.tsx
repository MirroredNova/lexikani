'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Input } from '@heroui/input';
import { SparklesIcon, XCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  direction: 'word-to-meaning' | 'meaning-to-word';
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  showResult: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  isProcessing?: boolean;
  allowEnterSubmit?: boolean;
  allowEnterNext?: boolean;
  additionalFeedback?: React.ReactNode;
  showRetestIndicator?: boolean;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  direction,
  userInput,
  onInputChange,
  onSubmit,
  onNext,
  showResult,
  isCorrect = false,
  correctAnswer,
  isProcessing = false,
  allowEnterSubmit = true,
  allowEnterNext = true,
  additionalFeedback,
  showRetestIndicator = false,
}: QuestionCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!showResult && userInput.trim() && allowEnterSubmit) {
          onSubmit();
        } else if (showResult && allowEnterNext) {
          onNext();
        }
      }
    },
    [showResult, userInput, allowEnterSubmit, allowEnterNext, onSubmit, onNext],
  );

  // Focus input and setup keyboard listeners
  useEffect(() => {
    if (!showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showResult]);

  // Global keyboard listener for Enter key
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Backup keyboard handler for Input component
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!showResult && userInput.trim() && allowEnterSubmit) {
        onSubmit();
      } else if (showResult && allowEnterNext) {
        onNext();
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-medium">
            Question {questionNumber} of {totalQuestions}
            {showRetestIndicator && ' (retest)'}
          </span>
          <Chip size="sm" color="secondary" variant="flat">
            {direction === 'word-to-meaning' ? 'Word → Meaning' : 'Meaning → Word'}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-2 text-primary">{question}</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Type the correct {direction === 'word-to-meaning' ? 'meaning' : 'word'}:
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Input
            ref={inputRef}
            value={userInput}
            onValueChange={onInputChange}
            placeholder="Type your answer..."
            size="lg"
            isDisabled={showResult || isProcessing}
            color={showResult ? (isCorrect ? 'success' : 'danger') : 'default'}
            onKeyDown={handleInputKeyDown}
          />
          {!showResult && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Press <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">Enter</kbd>{' '}
              to submit
            </p>
          )}
        </div>

        {showResult && (
          <div
            className={`text-center p-4 rounded-lg ${
              isCorrect
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {isCorrect ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <SparklesIcon className="w-5 h-5" />
                  <p className="font-medium">Correct!</p>
                </div>
                <p className="text-xs mt-2 opacity-75">
                  Press{' '}
                  <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">Enter</kbd> to
                  continue
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircleIcon className="w-5 h-5" />
                  <p className="font-medium">Incorrect</p>
                </div>
                {userInput && (
                  <p className="text-sm mt-1">
                    You wrote: <strong>{userInput}</strong>
                  </p>
                )}
                {correctAnswer && (
                  <p className="text-sm mt-1">
                    The correct answer was: <strong>{correctAnswer}</strong>
                  </p>
                )}
                {correctAnswer && /[æøå]/i.test(correctAnswer) && (
                  <p className="text-xs mt-1 opacity-75 flex items-center justify-center gap-1">
                    <LightBulbIcon className="w-4 h-4" />
                    Tip: You can type &quot;ae&quot; for &quot;æ&quot;, &quot;o&quot; for
                    &quot;ø&quot;, &quot;a&quot; for &quot;å&quot;
                  </p>
                )}
                <p className="text-xs mt-2 opacity-75">
                  Press{' '}
                  <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">Enter</kbd> to
                  continue
                </p>
              </div>
            )}
          </div>
        )}

        {additionalFeedback && showResult && additionalFeedback}

        <div className="flex justify-between items-center">
          <div></div>
          {!showResult ? (
            <Button
              color="primary"
              onPress={onSubmit}
              isDisabled={!userInput.trim() || isProcessing}
              isLoading={isProcessing}
            >
              Submit Answer <kbd className="ml-1 bg-white/20 px-1 rounded text-xs">Enter</kbd>
            </Button>
          ) : (
            <Button color="primary" onPress={onNext}>
              Next Question
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
