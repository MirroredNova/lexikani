'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@heroui/button';
import type { VocabularyItem, QuizQuestion } from '@/types';
import { ProgressBar, QuestionCard } from '@/components/shared';
import { fuzzyMatchText, generateQuizQuestions, calculateProgress } from '@/lib/utils';

interface QuizSectionProps {
  words: VocabularyItem[];
  onComplete: (results: {
    firstAttemptCorrect: number;
    totalQuestions: number;
    allQuestionsCompleted: boolean;
  }) => void;
  onBack: () => void;
}

export default function QuizSection({ words, onComplete, onBack }: QuizSectionProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<QuizQuestion[]>([]);
  const [retestWrongAnswers, setRetestWrongAnswers] = useState<QuizQuestion[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(0);
  const [isRetestPhase, setIsRetestPhase] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{
    wasCorrect: boolean;
    userInput: string;
    firstAttemptCorrect: number;
    wrongAnswers: QuizQuestion[];
    retestWrongAnswers: QuizQuestion[];
  } | null>(null);

  useEffect(() => {
    const shuffledQuestions = generateQuizQuestions(words);
    setQuestions(shuffledQuestions);
    setTotalQuestions(shuffledQuestions.length);
  }, [words]);

  const currentQuestion = questions[currentQuestionIndex];
  // Calculate progress based on original questions only, not including retests
  const questionsAnswered = isRetestPhase
    ? totalQuestions
    : Math.min(currentQuestionIndex + 1, totalQuestions);
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
    } else if (wrongAnswers.length > 0 && !isRetestPhase) {
      // Start retest phase - add wrong answers back to the queue
      setQuestions(prev => [...prev, ...wrongAnswers]);
      setWrongAnswers([]);
      setIsRetestPhase(true);
      setCurrentQuestionIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
    } else if (isRetestPhase && retestWrongAnswers.length > 0) {
      // Continue retest phase - add remaining wrong retest answers back to the queue
      setQuestions(prev => [...prev, ...retestWrongAnswers]);
      setRetestWrongAnswers([]);
      setCurrentQuestionIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
    } else {
      // Quiz complete - all questions answered correctly
      onComplete({
        firstAttemptCorrect: firstAttemptCorrect,
        totalQuestions: totalQuestions,
        allQuestionsCompleted: true,
      });
    }
  }, [
    currentQuestionIndex,
    questions.length,
    wrongAnswers,
    retestWrongAnswers,
    isRetestPhase,
    firstAttemptCorrect,
    totalQuestions,
    onComplete,
  ]);

  const handleUndo = useCallback(() => {
    if (!canUndo || !lastAnswer) return;

    // Restore previous state
    setFirstAttemptCorrect(lastAnswer.firstAttemptCorrect);
    setWrongAnswers(lastAnswer.wrongAnswers);
    setRetestWrongAnswers(lastAnswer.retestWrongAnswers);
    setUserInput(lastAnswer.userInput);
    setShowResult(false);
    setCanUndo(false);
    setLastAnswer(null);
  }, [canUndo, lastAnswer]);

  const handleSubmitAnswer = () => {
    if (!userInput.trim()) return;

    // Store current state before making changes (for potential undo)
    const currentState = {
      wasCorrect: false, // Will be updated below
      userInput: userInput,
      firstAttemptCorrect: firstAttemptCorrect,
      wrongAnswers: [...wrongAnswers],
      retestWrongAnswers: [...retestWrongAnswers],
    };

    const isCorrect = fuzzyMatchText(userInput, currentQuestion.correctAnswer);
    currentState.wasCorrect = isCorrect;

    if (isCorrect) {
      // Only count towards first attempt if not in retest phase
      if (!isRetestPhase) {
        setFirstAttemptCorrect(prev => prev + 1);
      }
      setCanUndo(false); // No undo for correct answers
    } else {
      // Track wrong answers appropriately based on phase
      if (!isRetestPhase) {
        // Initial phase - add to wrong answers for retest
        setWrongAnswers(prev => [...prev, currentQuestion]);
      } else {
        // Retest phase - add to retest wrong answers for another round
        setRetestWrongAnswers(prev => [...prev, currentQuestion]);
      }

      // Enable undo for wrong answers
      setCanUndo(true);
      setLastAnswer(currentState);
    }

    setShowResult(true);
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
        <p>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onPress={onBack}>
          ← Back to Lesson
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{isRetestPhase ? 'Retest Phase' : 'Quiz Time!'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {words.length} words • {totalQuestions} questions
            {isRetestPhase && ' (reviewing incorrect answers)'}
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isRetestPhase ? (
            <span>Retesting...</span>
          ) : (
            <span>
              {firstAttemptCorrect}/{Math.min(questionsAnswered, totalQuestions)} correct
            </span>
          )}
        </div>
      </div>

      <ProgressBar progress={progress} color="secondary" />

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
        showRetestIndicator={isRetestPhase}
        additionalFeedback={
          showResult && (
            <>
              {!fuzzyMatchText(userInput, currentQuestion.correctAnswer) && !isRetestPhase && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    This word will be tested again in this session.
                  </p>
                </div>
              )}
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
            </>
          )
        }
      />
    </div>
  );
}
