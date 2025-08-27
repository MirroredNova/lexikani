import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import NextLink from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-2xl p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardBody className="text-center p-8 space-y-4">
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-500 mx-auto" />
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button as={NextLink} href="/" color="primary">
              Go Home
            </Button>
            <Button as={NextLink} href="/lessons" variant="bordered">
              Start Learning
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
