import { Card, CardBody } from '@heroui/card';

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-6">
        {/* Skeleton for header */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

        {/* Skeleton for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i} className="shadow-lg">
              <CardBody className="p-6">
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Skeleton for additional content */}
        <Card className="shadow-lg">
          <CardBody className="p-6">
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
