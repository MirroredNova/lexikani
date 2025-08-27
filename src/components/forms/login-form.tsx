'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { login } from '@/lib/server/auth.actions';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Login was successful, refresh user state and redirect
      await refreshUser();
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-0">
        <div className="w-full text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to continue your language learning journey
          </p>
        </div>
      </CardHeader>

      <CardBody className="pt-6">
        <Form className="space-y-6" action={handleSubmit}>
          <div className="space-y-4 w-full">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              startContent={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
              isRequired
              variant="bordered"
              classNames={{
                input: 'text-sm',
                inputWrapper:
                  'border-gray-200 dark:border-gray-700 hover:border-primary-300 focus-within:border-primary-500',
              }}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              startContent={<LockClosedIcon className="w-4 h-4 text-gray-400" />}
              isRequired
              variant="bordered"
              classNames={{
                input: 'text-sm',
                inputWrapper:
                  'border-gray-200 dark:border-gray-700 hover:border-primary-300 focus-within:border-primary-500',
              }}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold"
            isLoading={isLoading}
            endContent={!isLoading && <ArrowRightIcon className="w-4 h-4" />}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}
