import SignupForm from '@/components/forms/signup-form';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Lexikani account to start your language learning journey.',
};

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center p-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="w-full max-w-md">
        <SignupForm />
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Button
              as={Link}
              href="/login"
              variant="light"
              size="sm"
              className="text-primary-600 dark:text-primary-400 font-medium p-0 h-auto"
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
