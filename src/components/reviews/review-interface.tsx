'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@heroui/button';
import type { ReviewItem, ReviewQuestion, ReviewPair } from '@/types';
import { reviewWord } from '@/lib/server/vocabulary.actions';
import { ProgressBar, QuestionCard } from '@/components/shared';
import { fuzzyMatchText, generateReviewQuestions, calculateProgress } from '@/lib/utils';

interface ReviewInterfaceProps {
  initialReviews: ReviewItem[];
}

export default function ReviewInterface({ initialReviews }: ReviewInterfaceProps) {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [reviewPairs, setReviewPairs] = useState<Map<string, ReviewPair>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showPairResult, setShowPairResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{
    wasCorrect: boolean;
    userInput: string;
    correctAnswers: number;
    reviewPairs: Map<string, ReviewPair>;
    showPairResult: boolean;
  } | null>(null);

  useEffect(() => {
    const { questions: shuffledQuestions, pairs } = generateReviewQuestions(initialReviews);
    setQuestions(shuffledQuestions);
    setReviewPairs(pairs);
    setTotalQuestions(shuffledQuestions.length);
  }, [initialReviews]);

  const currentQuestion = questions[currentQuestionIndex];
  const questionsAnswered = Math.min(currentQuestionIndex + 1, totalQuestions);
  const progress = calculateProgress(questionsAnswered, totalQuestions);

  const handleNextQuestion = useCallback(() => {
    // Disable undo when moving to next question
    setCanUndo(false);
    setLastAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
      setShowPairResult(false);
    } else {
      // Review session complete
      setReviewComplete(true);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleUndo = useCallback(() => {
    if (!canUndo || !lastAnswer) return;

    // Restore previous state
    setCorrectAnswers(lastAnswer.correctAnswers);
    setReviewPairs(lastAnswer.reviewPairs);
    setUserInput(lastAnswer.userInput);
    setShowResult(false);
    setShowPairResult(lastAnswer.showPairResult);
    setCanUndo(false);
    setLastAnswer(null);
  }, [canUndo, lastAnswer]);

  const handleSubmitAnswer = async () => {
    if (!userInput.trim() || isProcessing) return;

    setIsProcessing(true);

    // Store current state before making changes (for potential undo)
    const currentState = {
      wasCorrect: false, // Will be updated below
      userInput: userInput,
      correctAnswers: correctAnswers,
      reviewPairs: new Map(reviewPairs),
      showPairResult: showPairResult,
    };

    const isCorrect = fuzzyMatchText(userInput, currentQuestion.correctAnswer);
    currentState.wasCorrect = isCorrect;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setCanUndo(false); // No undo for correct answers
    } else {
      // Enable undo for wrong answers
      setCanUndo(true);
      setLastAnswer(currentState);
    }

    // Update the pair tracking
    const pairId = currentQuestion.pairId;
    const updatedPairs = new Map(reviewPairs);
    const pair = updatedPairs.get(pairId);
    if (!pair) {
      setIsProcessing(false);
      return;
    }

    // Record the answer for this direction
    if (currentQuestion.direction === 'word-to-meaning') {
      pair.wordToMeaning = isCorrect;
    } else {
      pair.meaningToWord = isCorrect;
    }

    // Check if both directions have been answered
    const bothAnswered = pair.wordToMeaning !== null && pair.meaningToWord !== null;
    const bothCorrect = pair.wordToMeaning === true && pair.meaningToWord === true;

    if (bothAnswered && !pair.completed) {
      // Complete the pair and update SRS
      pair.completed = true;

      try {
        const originalSrsStage = currentQuestion.item.srsStage;
        await reviewWord(currentQuestion.item.id, bothCorrect);

        // Calculate the new SRS stage for display
        let newSrsStage: number;
        if (bothCorrect) {
          newSrsStage = Math.min(originalSrsStage + 1, 8);
        } else {
          newSrsStage = 0; // Reset to apprentice 1
        }

        pair.srsProgression = { from: originalSrsStage, to: newSrsStage };
      } catch (error) {
        console.error('Error updating review:', error);
      }
    }

    setReviewPairs(updatedPairs);
    setShowResult(true);

    // Show pair completion result if both directions are now answered
    if (bothAnswered && !showPairResult) {
      setShowPairResult(true);
    }

    setIsProcessing(false);
  };

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
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-green-600">Review Session Complete!</h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            Reviewed {initialReviews.length} words with SRS progression updated!
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
            Your learning schedule has been automatically adjusted based on performance.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Session Results</h3>
          <p className="text-lg">
            You got <span className="font-bold text-green-600">{correctAnswers}</span> out of{' '}
            <span className="font-bold">{totalQuestions}</span> correct!
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Accuracy: {Math.round((correctAnswers / totalQuestions) * 100)}%
          </p>
        </div>

        <div className="space-y-4">
          <Button
            color="primary"
            size="lg"
            onPress={() => (window.location.href = '/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onPress={() => window.history.back()}>
          ← Back to Home
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-semibold">Review Session</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {initialReviews.length} words • {totalQuestions} questions
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {correctAnswers}/{questionsAnswered} correct
        </div>
      </div>

      <ProgressBar progress={progress} color="primary" />

      <QuestionCard
        questionNumber={questionsAnswered}
        totalQuestions={totalQuestions}
        question={currentQuestion.question}
        direction={currentQuestion.direction}
        userInput={userInput}
        onInputChange={setUserInput}
        onSubmit={handleSubmitAnswer}
        onNext={handleNextQuestion}
        showResult={showResult}
        isCorrect={fuzzyMatchText(userInput, currentQuestion.correctAnswer)}
        correctAnswer={currentQuestion.correctAnswer}
        isProcessing={isProcessing}
        additionalFeedback={
          showResult && (
            <>
              {canUndo && !fuzzyMatchText(userInput, currentQuestion.correctAnswer) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    Made a typo? Press{' '}
                    <kbd className="bg-blue-200 dark:bg-blue-700 px-2 py-1 rounded text-xs font-mono">
                      Backspace
                    </kbd>{' '}
                    to undo and try again
                  </p>
                </div>
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
                            ? `SRS: ${from} to ${to}${to === 8 ? ' (Burned!)' : ''}`
                            : `SRS: ${from} to ${to} (Reset to Apprentice)`}
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
