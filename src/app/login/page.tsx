import LoginForm from '@/components/forms/login-form';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Lexikani account to continue your language learning journey.',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Button
              as={Link}
              href="/signup"
              variant="light"
              size="sm"
              className="text-primary-600 dark:text-primary-400 font-medium p-0 h-auto"
            >
              Sign up here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
