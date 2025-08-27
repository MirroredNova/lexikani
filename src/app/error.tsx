'use client';

import { useEffect } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-2xl p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardBody className="text-center p-8 space-y-4">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Something went wrong!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm">
              <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
              <pre className="whitespace-pre-wrap text-xs overflow-auto">
                {error.message}
                {error.stack && `\n${error.stack}`}
              </pre>
            </details>
          )}
          <div className="flex gap-4 justify-center">
            <Button color="primary" onPress={reset}>
              Try Again
            </Button>
            <Button variant="bordered" onPress={() => (window.location.href = '/')}>
              Go Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
