import { SkeletonHeader, SkeletonCard, SkeletonStatCard, Skeleton } from '@/components/shared';

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-8">
        {/* Header */}
        <SkeletonHeader />

        {/* Profile Header Card */}
        <SkeletonCard>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </SkeletonCard>

        {/* Account Information */}
        <SkeletonCard>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>
          </div>
        </SkeletonCard>

        {/* Language Settings */}
        <SkeletonCard>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </SkeletonCard>

        {/* Learning Progress */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-40 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
        </div>
      </div>
    </div>
  );
}
