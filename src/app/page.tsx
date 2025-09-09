import { BookOpenIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  getAvailableLessons,
  getReviewsReady,
  getLevelProgress,
  getReviewSchedule,
} from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import ReviewSchedule from '@/components/home/review-schedule';
import { LevelProgressCard, ActionCard } from '@/components/shared';

export default async function Page() {
  const selectedLanguage = await getUserSelectedLanguage();

  if (!selectedLanguage) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-8">Lexikani</h1>
        <p>No language selected. Please select a language from the navigation bar.</p>
      </div>
    );
  }

  const [availableLessons, reviewsReady, levelProgress, reviewSchedule] = await Promise.all([
    getAvailableLessons(selectedLanguage.id),
    getReviewsReady(selectedLanguage.id),
    getLevelProgress(selectedLanguage.id),
    getReviewSchedule(selectedLanguage.id),
  ]);

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Level Progress Header */}
      <LevelProgressCard
        currentLevel={levelProgress.currentLevel}
        progressPercentage={levelProgress.progressPercentage}
        masteredWords={levelProgress.masteredWords}
        totalWords={levelProgress.totalWords}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          title="Lessons"
          count={availableLessons.length}
          description="Learn new words and phrases!"
          href="/lessons"
          icon={<BookOpenIcon className="w-16 h-16" />}
          gradientFrom="from-pink-500"
          gradientTo="to-pink-600"
          iconColor="text-pink-200"
          isDisabled={availableLessons.length === 0}
        />

        <ActionCard
          title="Reviews"
          count={reviewsReady.length}
          description="Review these items to level them up!"
          href="/reviews"
          icon={<ArrowPathIcon className="w-16 h-16" />}
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
          iconColor="text-blue-200"
          isDisabled={reviewsReady.length === 0}
        />
      </div>

      {/* Review Schedule */}
      <div className="mt-6 space-y-4">
        <ReviewSchedule schedule={reviewSchedule} />
      </div>
    </div>
  );
}
