import { SkeletonProgressCard, SkeletonStatCard } from '@/components/shared';

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-8">
        {/* Level Progress Card Skeleton */}
        <SkeletonProgressCard />

        {/* Action Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        {/* Review Schedule Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
