'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import type { ReviewItem, Language } from '@/types';
import { reviewWord } from '@/lib/server/vocabulary.actions';
import { ProgressBar, QuestionCard, SessionHeader } from '@/components/shared';
import WordDetailsPanel from '@/components/shared/word-details-panel';
import { CheckCircleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';
import { calculateProgress } from '@/lib/utils';
import { useReviewState } from '@/hooks/use-review-state';

interface ReviewInterfaceProps {
  initialReviews: ReviewItem[];
  language: Language;
}

export default function ReviewInterface({ initialReviews, language }: ReviewInterfaceProps) {
  // Use custom hook for state management
  const {
    // State
    questions,
    reviewPairs,
    userInput,
    showResult,
    correctAnswers,
    totalQuestions,
    isProcessing,
    reviewComplete,
    canUndo,
    lastAnswer,
    showWordDetails,
    pendingUpdate,
    currentQuestion,
    questionsAnswered,
    showPairResult,
    // Actions
    actions,
  } = useReviewState(initialReviews);

  // Derived progress calculation
  const progress = useMemo(
    () => calculateProgress(questionsAnswered, totalQuestions),
    [questionsAnswered, totalQuestions],
  );

  const handleNextQuestion = useCallback(() => {
    actions.nextQuestion();

    // Commit any pending SRS update in the background (optimistic - already updated UI)
    const update = pendingUpdate;
    if (update) {
      // Don't await - fire and forget for optimal UX
      (async () => {
        try {
          const pair = reviewPairs.get(update.pairId);
          if (pair) {
            const bothCorrect = pair.wordToMeaning === true && pair.meaningToWord === true;
            const vocabId = pair.item.id;
            await reviewWord(vocabId, bothCorrect);
            // Note: We don't update the UI here since it's already optimistically updated
            // The server response confirms our optimistic state is correct
          }
        } catch (error) {
          // Server update failed - but user has already seen the feedback
          // In a more complex app, you could show a toast notification or revert state
          console.error('Background SRS update failed:', error);

          // Optional: Show a subtle error indicator without disrupting the flow
          // For now, we keep the optimistic state since the user has already progressed
        } finally {
          actions.clearPendingUpdate();
        }
      })();
    }
  }, [actions, pendingUpdate, reviewPairs]);

  const handleShowDetails = useCallback(() => {
    actions.toggleWordDetails();
  }, [actions]);

  const handleUndo = useCallback(() => {
    actions.undoAnswer();
  }, [actions]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!userInput.trim() || isProcessing || !currentQuestion) return;
    await actions.submitAnswer(currentQuestion, userInput);
  }, [userInput, isProcessing, currentQuestion, actions]);

  // Handle backspace key for undo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Backspace key
      const isBackspaceKey =
        event.key === 'Backspace' || event.code === 'Backspace' || event.keyCode === 8;

      if (isBackspaceKey && canUndo && showResult) {
        event.preventDefault();
        event.stopPropagation();
        handleUndo();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [canUndo, showResult, handleUndo]);

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (reviewComplete) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
              <ArrowPathIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Review Session Complete!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Excellent work reinforcing your {language.name} vocabulary!
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Words Reviewed Card */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-800">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Words Reviewed
                  </h3>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                    {initialReviews.length}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    SRS progression updated automatically
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Accuracy Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <ArrowPathIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Session Accuracy
                  </h3>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    {correctAnswers} out of {totalQuestions} correct
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Additional Info */}
        <Card>
          <CardBody className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <ArrowPathIcon className="w-4 h-4 inline mr-1" />
              Your spaced repetition schedule has been adjusted based on your performance
            </p>
          </CardBody>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            color="primary"
            size="lg"
            onPress={() => (window.location.href = '/')}
            className="w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            endContent={<HomeIcon className="w-4 h-4" />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center">
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SessionHeader
        title="Review Session"
        subtitle={`${initialReviews.length} words • ${totalQuestions} questions`}
        onBack={() => window.history.back()}
        rightContent={
          <span>
            {correctAnswers}/{questionsAnswered} correct
          </span>
        }
      />

      <ProgressBar progress={progress} color="primary" />

      <QuestionCard
        questionNumber={questionsAnswered}
        totalQuestions={totalQuestions}
        question={currentQuestion.question}
        direction={currentQuestion.direction}
        userInput={userInput}
        onInputChange={actions.setUserInput}
        onSubmit={handleSubmitAnswer}
        onNext={handleNextQuestion}
        showResult={showResult}
        isCorrect={lastAnswer?.wasCorrect ?? false}
        correctAnswer={currentQuestion.correctAnswer}
        isProcessing={isProcessing}
        canUndo={canUndo}
        onUndo={handleUndo}
        wordData={{
          word: currentQuestion.item.word,
          meaning: currentQuestion.item.meaning,
          type: currentQuestion.item.type,
          level: currentQuestion.item.level,
          attributes: currentQuestion.item.attributes,
        }}
        onShowDetails={handleShowDetails}
        language={language}
        additionalFeedback={
          showResult && (
            <>
              {showWordDetails && (
                <WordDetailsPanel
                  id={currentQuestion.item.id}
                  word={currentQuestion.item.word}
                  meaning={currentQuestion.item.meaning}
                  type={currentQuestion.item.type}
                  level={currentQuestion.item.level}
                  attributes={currentQuestion.item.attributes}
                  srsStage={currentQuestion.item.srsStage}
                />
              )}
              {showPairResult && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  {(() => {
                    const pair = reviewPairs.get(currentQuestion.pairId);
                    if (!pair || !pair.srsProgression) return null;

                    const bothCorrect = pair.wordToMeaning === true && pair.meaningToWord === true;
                    const { from, to } = pair.srsProgression;

                    return (
                      <div className="text-center">
                        <p className="font-medium text-green-800 dark:text-green-200">
                          {bothCorrect ? 'Pair Complete!' : 'Pair Failed'}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                          {bothCorrect
                            ? `SRS: ${from} to ${to}${to === 9 ? ' (Burned!)' : ''}`
                            : from <= 1
                              ? 'SRS: remains at 1 (Apprentice I)'
                              : `SRS: ${from} to 1 (Reset to Apprentice I)`}
                        </p>
                        <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                          Both directions must be correct to progress
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )
        }
      />
    </div>
  );
}
