'use client';

import { useEffect, useMemo, useCallback } from 'react';
// import { Button } from '@heroui/button';
import type { VocabularyItem, Language } from '@/types';
import { ProgressBar, QuestionCard, SessionHeader } from '@/components/shared';
import WordDetailsPanel from '@/components/shared/word-details-panel';
import { calculateProgress, fuzzyMatchText } from '@/lib/utils';
import { useQuizState } from '@/hooks/use-quiz-state';

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
  // Use custom hook for state management
  const {
    // State
    questions,
    userInput,
    showResult,
    totalQuestions,
    firstAttemptCorrect,
    isRetestPhase,
    canUndo,
    lastAnswer,
    showWordDetails,
    currentQuestion,
    questionsAnswered,
    quizComplete,
    // Actions
    actions,
  } = useQuizState(words);

  // Derived progress calculation
  const progress = useMemo(
    () => calculateProgress(questionsAnswered, totalQuestions),
    [questionsAnswered, totalQuestions],
  );

  // Handle quiz completion and navigation
  const handleNextQuestion = useCallback(() => {
    actions.nextQuestion();
  }, [actions]);

  const handleSubmitAnswer = useCallback(() => {
    if (!userInput.trim() || !currentQuestion) return;
    actions.submitAnswer(currentQuestion, userInput);
  }, [userInput, currentQuestion, actions]);

  // Handle quiz completion
  useEffect(() => {
    if (quizComplete) {
      onComplete({
        firstAttemptCorrect,
        totalQuestions,
        allQuestionsCompleted: true,
      });
    }
  }, [quizComplete, firstAttemptCorrect, totalQuestions, onComplete]);

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

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <p>Loading quiz...</p>
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
        title={isRetestPhase ? 'Retest Phase' : 'Quiz Time!'}
        subtitle={`${words.length} words • ${totalQuestions} questions${isRetestPhase ? ' (reviewing incorrect answers)' : ''}`}
        backButtonText="← Back to Lesson"
        onBack={onBack}
        rightContent={
          isRetestPhase ? (
            'Retesting...'
          ) : (
            <span>
              {firstAttemptCorrect}/{Math.min(questionsAnswered, totalQuestions)} correct
            </span>
          )
        }
      />

      <ProgressBar progress={progress} color="secondary" />

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
        isCorrect={showResult ? (lastAnswer?.wasCorrect ?? false) : false}
        correctAnswer={currentQuestion.correctAnswer}
        showRetestIndicator={isRetestPhase}
        wordData={{
          word: currentQuestion.word.word,
          meaning: currentQuestion.word.meaning,
          type: currentQuestion.word.type,
          level: currentQuestion.word.level,
          attributes: currentQuestion.word.attributes,
        }}
        onShowDetails={actions.toggleWordDetails}
        language={language}
        additionalFeedback={
          showResult && (
            <>
              {showWordDetails && (
                <WordDetailsPanel
                  id={currentQuestion.word.id}
                  word={currentQuestion.word.word}
                  meaning={currentQuestion.word.meaning}
                  type={currentQuestion.word.type}
                  level={currentQuestion.word.level}
                  attributes={currentQuestion.word.attributes}
                />
              )}
              {!fuzzyMatchText(userInput, currentQuestion.correctAnswer) && !isRetestPhase && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    This word will be tested again in this session.
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
