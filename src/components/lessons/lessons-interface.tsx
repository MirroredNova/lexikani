'use client';

import { useState, useEffect, useCallback } from 'react';
import type { VocabularyItem, Language } from '@/types';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import {
  SparklesIcon,
  CheckCircleIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Flashcard from '@/components/lessons/flashcard';
import QuizSection from '@/components/lessons/quiz-section';
import { completeLesson, getAvailableLessons } from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import { ProgressBar, SessionHeader } from '@/components/shared';

type LessonPhase = 'learning' | 'quiz' | 'complete';

interface LessonsInterfaceProps {
  initialLessons: VocabularyItem[];
  language: Language;
}

export default function LessonsInterface({ initialLessons, language }: LessonsInterfaceProps) {
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('learning');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentLessons, setCurrentLessons] = useState<VocabularyItem[]>(initialLessons);
  const [isLoadingNewLessons, setIsLoadingNewLessons] = useState(false);

  const [quizResults, setQuizResults] = useState<{
    firstAttemptCorrect: number;
    totalQuestions: number;
    allQuestionsCompleted: boolean;
  } | null>(null);

  const progress = ((currentCardIndex + 1) / currentLessons.length) * 100;

  const handleStartNewLesson = async () => {
    setIsLoadingNewLessons(true);
    try {
      // Get the user's selected language
      const selectedLanguage = await getUserSelectedLanguage();
      if (!selectedLanguage) {
        console.error('No language selected');
        return;
      }

      // Fetch new available lessons (limit to 5 like in the page)
      const newLessons = await getAvailableLessons(selectedLanguage.id, 5);

      if (newLessons.length === 0) {
        // No more lessons available - redirect to home or show message
        window.location.href = '/';
        return;
      }

      // Update state with new lessons
      setCurrentLessons(newLessons);
      setCurrentPhase('learning');
      setCurrentCardIndex(0);
      setQuizResults(null);
    } catch (error) {
      console.error('Error fetching new lessons:', error);
      // On error, just restart with current lessons
      setCurrentPhase('learning');
      setCurrentCardIndex(0);
      setQuizResults(null);
    } finally {
      setIsLoadingNewLessons(false);
    }
  };

  const handleNextCard = useCallback(() => {
    if (currentCardIndex < currentLessons.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Last card reached, start quiz
      setCurrentPhase('quiz');
    }
  }, [currentCardIndex, currentLessons.length]);

  const handlePrevCard = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  }, [currentCardIndex]);

  // Keyboard navigation for learning phase
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (currentPhase !== 'learning') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    },
    [currentPhase, handleNextCard, handlePrevCard],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleQuizComplete = useCallback(
    async (results: {
      firstAttemptCorrect: number;
      totalQuestions: number;
      allQuestionsCompleted: boolean;
    }) => {
      setQuizResults(results);

      // Sync completed lesson with backend - add all words to user's vocabulary for review
      try {
        const vocabularyIds = currentLessons.map(word => word.id);
        await completeLesson(vocabularyIds);
      } catch (error) {
        console.error('Error completing lesson:', error);
        // Continue anyway - don't block UI for sync errors
      }

      setCurrentPhase('complete');
    },
    [currentLessons],
  );

  const handleBackToLesson = () => {
    setCurrentPhase('learning');
  };

  if (currentPhase === 'quiz') {
    return (
      <QuizSection
        words={currentLessons}
        onComplete={handleQuizComplete}
        onBack={handleBackToLesson}
        language={language}
      />
    );
  }

  if (currentPhase === 'complete') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Lesson Complete!</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Great job learning new {language.name} vocabulary!
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Words Added Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-sm sm:text-base">
                    Words Added to Reviews
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                    {currentLessons.length}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                    Ready for spaced repetition review
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quiz Results Card */}
          {quizResults && (
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 border-pink-200 dark:border-pink-800">
              <CardBody className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 bg-pink-500 rounded-lg flex-shrink-0">
                    <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-1 text-sm sm:text-base">
                      Quiz Results
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-pink-700 dark:text-pink-300 mb-1">
                      {Math.round(
                        (quizResults.firstAttemptCorrect / quizResults.totalQuestions) * 100,
                      )}
                      %
                    </p>
                    <p className="text-xs sm:text-sm text-pink-600 dark:text-pink-400 mb-2">
                      {quizResults.firstAttemptCorrect} out of {quizResults.totalQuestions} correct
                    </p>
                    {quizResults.firstAttemptCorrect < quizResults.totalQuestions && (
                      <p className="text-xs text-pink-500 dark:text-pink-500">
                        ✓ All questions mastered through retesting
                      </p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            color="primary"
            size="lg"
            onPress={handleStartNewLesson}
            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 min-h-[48px]"
            isLoading={isLoadingNewLessons}
            endContent={<ArrowRightIcon className="w-4 h-4" />}
          >
            {isLoadingNewLessons ? 'Loading...' : 'Continue Learning'}
          </Button>
          <Button
            variant="bordered"
            size="lg"
            onPress={() => window.history.back()}
            className="sm:w-40 min-h-[48px]"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Learning phase
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SessionHeader
        title="Lesson"
        subtitle={`Card ${currentCardIndex + 1} of ${currentLessons.length}`}
        showBackButton={false}
      />

      <ProgressBar progress={progress} color="primary" />

      <Flashcard word={currentLessons[currentCardIndex]} />

      <div className="space-y-4">
        {/* Desktop/tablet controls */}
        <div className="hidden sm:flex gap-4 justify-center">
          <Button variant="bordered" onPress={handlePrevCard} isDisabled={currentCardIndex === 0}>
            Previous
          </Button>
          <Button color="primary" onPress={handleNextCard}>
            {currentCardIndex === currentLessons.length - 1 ? 'Start Quiz' : 'Next'}
          </Button>
        </div>

        <div className="hidden sm:block text-center text-xs text-gray-500 dark:text-gray-400">
          Use <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">Left</kbd>{' '}
          <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">Right</kbd> arrow keys
          or <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">Space</kbd> to
          navigate
        </div>
      </div>

      {/* Mobile sticky controls */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Button
            variant="bordered"
            onPress={handlePrevCard}
            isDisabled={currentCardIndex === 0}
            className="min-w-[110px]"
          >
            Previous
          </Button>
          <Button color="primary" onPress={handleNextCard} className="min-w-[140px]">
            {currentCardIndex === currentLessons.length - 1 ? 'Start Quiz' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
