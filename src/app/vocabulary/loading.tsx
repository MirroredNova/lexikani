import { Card, CardBody, CardHeader } from '@heroui/card';

export default function VocabularyLoading() {
  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardBody className="text-center">
                <div className="animate-pulse space-y-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Filters skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Results count skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />

        {/* Vocabulary grid skeleton */}
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                  <div className="md:col-span-2 space-y-2 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </div>
                  </div>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                  </div>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                  </div>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                  </div>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
