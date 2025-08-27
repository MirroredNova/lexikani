import { Card, CardBody, CardHeader } from '@heroui/card';

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
      </div>

      {/* Current Level Summary Skeleton */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div>
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Levels List Skeleton */}
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="ml-6">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div>
                      <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(j => (
                      <div
                        key={j}
                        className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                      />
                    ))}
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
