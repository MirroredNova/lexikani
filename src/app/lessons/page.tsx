import { getAvailableLessons } from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import LessonsInterface from '@/components/lessons/lessons-interface';
import { Button } from '@heroui/button';
import { InformationCircleIcon, TrophyIcon } from '@heroicons/react/24/outline';
import NextLink from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lessons',
  description:
    'Learn new vocabulary with interactive lessons and flashcards. Master words through spaced repetition.',
};

export default async function LessonsPage() {
  const selectedLanguage = await getUserSelectedLanguage();

  if (!selectedLanguage) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-8">Lessons</h1>
        <p>No language selected. Please select a language from the navigation bar.</p>
      </div>
    );
  }

  const availableLessons = await getAvailableLessons(selectedLanguage.id, 5);

  if (availableLessons.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Lessons - {selectedLanguage.name}</h1>
          <Button
            as={NextLink}
            href="/levels"
            variant="ghost"
            size="sm"
            startContent={<InformationCircleIcon className="w-4 h-4" />}
          >
            View Level Info
          </Button>
        </div>

        <div className="text-center space-y-4">
          <TrophyIcon className="w-24 h-24 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-semibold">Level Complete!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You&apos;ve learned all available words for your current level. Complete your reviews to
            master words and unlock the next level!
          </p>
          <Button as={NextLink} href="/levels" color="primary" variant="flat" className="mt-4">
            View Level Progression
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Lessons - {selectedLanguage.name}</h1>
        <Button
          as={NextLink}
          href="/levels"
          variant="ghost"
          size="sm"
          startContent={<InformationCircleIcon className="w-4 h-4" />}
        >
          View Level Info
        </Button>
      </div>

      <LessonsInterface initialLessons={availableLessons} />
    </div>
  );
}
