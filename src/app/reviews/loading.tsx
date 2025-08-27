import { Card, CardBody, CardHeader } from '@heroui/card';

export default function ReviewsLoading() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header controls skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
            <div className="text-center space-y-1">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
          </div>

          {/* Progress bar skeleton */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

          {/* Question card skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
                </div>
              </div>
            </CardHeader>

            <CardBody className="space-y-6">
              <div className="text-center animate-pulse">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56 mx-auto" />
              </div>

              <div className="max-w-md mx-auto">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>

              <div className="flex justify-between items-center pt-4">
                <div></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
