'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { VocabularyItem, Language, ReviewItem } from '@/types';
import { ProgressBar, QuestionCard, SessionHeader } from '@/components/shared';
import WordDetailsPanel from '@/components/shared/word-details-panel';
import { calculateProgress, fuzzyMatchText, generateAcceptableAnswers } from '@/lib/utils';
import { useReviewState } from '@/hooks/use-review-state';

interface QuizSectionProps {
  words: VocabularyItem[];
  onComplete: (results: {
    firstAttemptCorrect: number;
    totalQuestions: number;
    allQuestionsCompleted: boolean;
  }) => void;
  onBack: () => void;
  language: Language;
}

export default function QuizSection({ words, onComplete, onBack, language }: QuizSectionProps) {
  // Convert vocabulary items to review items format (lessons start at SRS stage 0)
  const reviewItems: ReviewItem[] = useMemo(
    () =>
      words.map(word => ({
        ...word, // Include all VocabularyItem properties
        srsStage: 0, // Lessons don't have SRS progression yet
        nextReviewAt: null,
      })),
    [words],
  );

  // Use review state management (same as reviews)
  const {
    // State
    userInput,
    showResult,
    correctAnswers,
    totalQuestions,
    reviewComplete,
    canUndo,
    showWordDetails,
    currentQuestion,
    questionsAnswered,
    completedPairs,
    showPairResult,
    // Actions
    actions,
  } = useReviewState(reviewItems);

  // Derived progress calculation
  const progress = useMemo(
    () => calculateProgress(questionsAnswered, totalQuestions),
    [questionsAnswered, totalQuestions],
  );

  // Handle lesson completion (when all pairs are completed)
  useEffect(() => {
    if (reviewComplete) {
      // Calculate firstAttemptCorrect for compatibility with lesson interface
      // This is a simplified calculation since we're now using pair-based logic
      const firstAttemptCorrect = Math.round(correctAnswers * 0.8); // Rough estimate

      onComplete({
        firstAttemptCorrect,
        totalQuestions,
        allQuestionsCompleted: true,
      });
    }
  }, [reviewComplete, correctAnswers, totalQuestions, onComplete]);

  const handleSubmitAnswer = useCallback(() => {
    if (!userInput.trim() || !currentQuestion) return;

    // Use the same submit logic as reviews
    actions.submitAnswer(currentQuestion, userInput);
  }, [userInput, currentQuestion, actions]);

  const handleNextQuestion = useCallback(() => {
    actions.nextQuestion();
  }, [actions]);

  // Check if answer is correct (for UI display)
  const checkAnswer = useCallback(
    (userInput: string, correctAnswer: string) => {
      if (currentQuestion?.direction === 'word-to-meaning') {
        const acceptableAnswers =
          currentQuestion.item.acceptedAnswers || generateAcceptableAnswers(correctAnswer);
        return fuzzyMatchText(userInput, correctAnswer, acceptableAnswers);
      }
      return fuzzyMatchText(userInput, correctAnswer);
    },
    [currentQuestion],
  );

  // Handle backspace key for undo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Backspace key
      const isBackspaceKey =
        event.key === 'Backspace' || event.code === 'Backspace' || event.keyCode === 8;

      if (isBackspaceKey && canUndo && showResult) {
        event.preventDefault();
        event.stopPropagation();
        actions.undoAnswer();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [canUndo, showResult, actions]);

  if (totalQuestions === 0) {
    return (
      <div className="text-center">
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center">
        <p>No question available...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SessionHeader
        title="Lesson Quiz"
        subtitle={`${words.length} words • ${totalQuestions} questions`}
        onBack={onBack}
        rightContent={
          <div className="text-right text-sm">
            <div>
              {correctAnswers}/{questionsAnswered} correct
            </div>
            <div className="text-xs opacity-75">
              {completedPairs}/{words.length} pairs done
            </div>
          </div>
        }
      />

      <ProgressBar progress={progress} color="primary" />

      <QuestionCard
        questionNumber={questionsAnswered}
        totalQuestions={totalQuestions}
        question={currentQuestion.question}
        direction={currentQuestion.direction}
        userInput={userInput}
        showResult={showResult}
        correctAnswer={currentQuestion.correctAnswer}
        onInputChange={actions.setUserInput}
        onSubmit={handleSubmitAnswer}
        onNext={handleNextQuestion}
        onUndo={actions.undoAnswer}
        canUndo={canUndo}
        isCorrect={showResult && checkAnswer(userInput, currentQuestion.correctAnswer)}
        wordData={{
          word: currentQuestion.item.word,
          meaning: currentQuestion.item.meaning,
          type: currentQuestion.item.type,
          level: currentQuestion.item.level,
          attributes: currentQuestion.item.attributes,
        }}
        onShowDetails={actions.toggleWordDetails}
        language={language}
        additionalFeedback={
          <>
            {showWordDetails && (
              <WordDetailsPanel
                id={currentQuestion.item.id}
                word={currentQuestion.item.word}
                meaning={currentQuestion.item.meaning}
                type={currentQuestion.item.type}
                level={currentQuestion.item.level}
                attributes={currentQuestion.item.attributes}
              />
            )}
            {showPairResult && (
              <div className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 border rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm mt-1 text-green-600 dark:text-green-300">
                    <span className="inline-flex items-center gap-2">
                      <span>Pair Complete!</span>
                      <ArrowRightIcon
                        className="w-4 h-4 text-green-600 dark:text-green-300"
                        aria-hidden="true"
                      />
                      <span>Added to vocabulary</span>
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        }
      />
    </div>
  );
}
