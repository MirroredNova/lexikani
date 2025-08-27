import { Card, CardBody } from '@heroui/card';

export default function LessonsLoading() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />

        {/* Level progress card skeleton */}
        <Card className="mb-6">
          <CardBody className="text-center p-6">
            <div className="space-y-4 animate-pulse">
              <div className="flex items-center justify-center gap-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </CardBody>
        </Card>

        {/* Lesson content skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
          </div>

          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

          <Card className="max-w-lg mx-auto min-h-[300px] shadow-lg">
            <CardBody className="space-y-6 p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex gap-2 justify-center">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20" />
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="flex gap-4 justify-center">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
