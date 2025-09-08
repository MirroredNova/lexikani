import { getReviewsReady } from '@/lib/server/vocabulary.actions';
import { getUserSelectedLanguage } from '@/lib/server/user.actions';
import ReviewInterface from '@/components/reviews/review-interface';
import { SparklesIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'Review and reinforce learned vocabulary with spaced repetition. Level up your language skills.',
};

export default async function ReviewsPage() {
  const selectedLanguage = await getUserSelectedLanguage();

  if (!selectedLanguage) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-8">Reviews</h1>
        <p>No language selected. Please select a language from the navigation bar.</p>
      </div>
    );
  }

  const reviewsReady = await getReviewsReady(selectedLanguage.id);

  if (reviewsReady.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <SparklesIcon className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold">No reviews available!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Come back later when your learned words are ready for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <ReviewInterface initialReviews={reviewsReady} language={selectedLanguage} />
    </div>
  );
}
