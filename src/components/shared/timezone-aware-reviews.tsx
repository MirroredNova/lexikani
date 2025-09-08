'use client';

import { useState, useEffect } from 'react';
import { isReadyForReview } from '@/lib/utils/timezone';

interface VocabularyWithTimezone {
  id: number;
  word: string;
  meaning: string;
  type: string;
  level: number;
  srsStage: number;
  nextReviewAt: Date | null;
  // ... other fields
}

interface TimezoneAwareReviewsProps {
  initialReviews: VocabularyWithTimezone[];
  children: (readyReviews: VocabularyWithTimezone[]) => React.ReactNode;
}

export default function TimezoneAwareReviews({
  initialReviews,
  children,
}: TimezoneAwareReviewsProps) {
  const [readyReviews, setReadyReviews] = useState<VocabularyWithTimezone[]>([]);

  useEffect(() => {
    // Filter reviews that are actually ready in user's local timezone
    const actuallyReady = initialReviews.filter(review => isReadyForReview(review.nextReviewAt));

    setReadyReviews(actuallyReady);

    // Update every minute to catch newly ready reviews
    const interval = setInterval(() => {
      const nowReady = initialReviews.filter(review => isReadyForReview(review.nextReviewAt));
      setReadyReviews(nowReady);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [initialReviews]);

  return <>{children(readyReviews)}</>;
}
