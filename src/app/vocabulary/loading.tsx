import { SkeletonHeader, SkeletonTable } from '@/components/shared';

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="space-y-8">
        {/* Header */}
        <SkeletonHeader />

        {/* Vocabulary Table */}
        <SkeletonTable />
      </div>
    </div>
  );
}
