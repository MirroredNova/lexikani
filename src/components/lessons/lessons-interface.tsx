'use client';

import { useState, useEffect, useCallback } from 'react';
import type { VocabularyItem } from '@/types';
import { Button } from '@heroui/button';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Flashcard from '@/components/lessons/flashcard';
import QuizSection from '@/components/lessons/quiz-section';
import { completeLesson, getAvailableLessons } from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import { ProgressBar } from '@/components/shared';

type LessonPhase = 'learning' | 'quiz' | 'complete';

interface LessonsInterfaceProps {
  initialLessons: VocabularyItem[];
}

export default function LessonsInterface({ initialLessons }: LessonsInterfaceProps) {
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

  const handleQuizComplete = async (results: {
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
  };

  const handleBackToLesson = () => {
    setCurrentPhase('learning');
  };

  if (currentPhase === 'quiz') {
    return (
      <QuizSection
        words={currentLessons}
        onComplete={handleQuizComplete}
        onBack={handleBackToLesson}
      />
    );
  }

  if (currentPhase === 'complete') {
    return (
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <SparklesIcon className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-green-600">Lesson Complete!</h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 font-medium flex items-center justify-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            {currentLessons.length} words added to your review queue!
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
            You&apos;ll see these words again for review based on spaced repetition.
          </p>
        </div>

        {quizResults && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Quiz Results</h3>
            <div className="space-y-3">
              <div>
                <p className="text-lg">
                  First attempt:{' '}
                  <span className="font-bold text-blue-600">{quizResults.firstAttemptCorrect}</span>{' '}
                  out of <span className="font-bold">{quizResults.totalQuestions}</span> correct
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Initial accuracy:{' '}
                  {Math.round((quizResults.firstAttemptCorrect / quizResults.totalQuestions) * 100)}
                  %
                </p>
              </div>

              {quizResults.firstAttemptCorrect < quizResults.totalQuestions && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-green-800 dark:text-green-200 font-medium text-sm">
                    All questions completed through retesting!
                  </p>
                  <p className="text-green-600 dark:text-green-300 text-xs mt-1">
                    Incorrect answers were reviewed until mastered
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Tested both Norwegian→English and English→Norwegian for each word
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button
            color="primary"
            size="lg"
            onPress={handleStartNewLesson}
            className="w-full"
            isLoading={isLoadingNewLessons}
          >
            {isLoadingNewLessons ? 'Loading New Lessons...' : 'Continue Learning'}
          </Button>
          <Button
            variant="bordered"
            size="lg"
            onPress={() => window.history.back()}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Learning phase
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Card {currentCardIndex + 1} of {currentLessons.length}
        </h2>
      </div>

      <ProgressBar progress={progress} color="primary" />

      <Flashcard word={currentLessons[currentCardIndex]} />

      <div className="space-y-4">
        <div className="flex gap-4 justify-center">
          <Button variant="bordered" onPress={handlePrevCard} isDisabled={currentCardIndex === 0}>
            Previous
          </Button>
          <Button color="primary" onPress={handleNextCard}>
            {currentCardIndex === currentLessons.length - 1 ? 'Start Quiz' : 'Next'}
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Use <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">Left</kbd>{' '}
          <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">Right</kbd> arrow keys
          or <kbd className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">Space</kbd> to
          navigate
        </div>
      </div>
    </div>
  );
}
