import { SkeletonHeader, SkeletonProgressCard, SkeletonLevelAccordion } from '@/components/shared';

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl p-6 mb-12">
      <div className="space-y-8">
        {/* Header */}
        <SkeletonHeader />

        {/* Current Level Progress */}
        <SkeletonProgressCard />

        {/* Learning Progression Section */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64" />
          <SkeletonLevelAccordion />
        </div>
      </div>
    </div>
  );
}
