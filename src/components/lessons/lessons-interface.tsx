'use client';

import { useState, useEffect, useCallback } from 'react';
import type { VocabularyItem, Language } from '@/types';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { SparklesIcon, CheckCircleIcon, BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Flashcard from '@/components/lessons/flashcard';
import QuizSection from '@/components/lessons/quiz-section';
import { completeLesson, getAvailableLessons } from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import { ProgressBar } from '@/components/shared';

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
        language={language}
      />
    );
  }

  if (currentPhase === 'complete') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Lesson Complete!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Great job learning new Norwegian vocabulary!
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Words Added Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Words Added to Reviews
                  </h3>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                    {currentLessons.length}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Ready for spaced repetition review
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quiz Results Card */}
          {quizResults && (
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 border-pink-200 dark:border-pink-800">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-pink-500 rounded-lg">
                    <BookOpenIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-1">
                      Quiz Results
                    </h3>
                    <p className="text-2xl font-bold text-pink-700 dark:text-pink-300 mb-1">
                      {Math.round((quizResults.firstAttemptCorrect / quizResults.totalQuestions) * 100)}%
                    </p>
                    <p className="text-sm text-pink-600 dark:text-pink-400 mb-2">
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

        {/* Additional Info */}
        <Card>
          <CardBody className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <SparklesIcon className="w-4 h-4 inline mr-1" />
              Tested both {language.name}→English and English→{language.name} for each word
            </p>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            color="primary"
            size="lg"
            onPress={handleStartNewLesson}
            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
            isLoading={isLoadingNewLessons}
            endContent={<ArrowRightIcon className="w-4 h-4" />}
          >
            {isLoadingNewLessons ? 'Loading...' : 'Continue Learning'}
          </Button>
          <Button
            variant="bordered"
            size="lg"
            onPress={() => window.history.back()}
            className="sm:w-40"
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
