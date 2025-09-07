import { requireAdmin } from '@/lib/server/admin.actions';
import { Card, CardBody } from '@heroui/card';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import NextLink from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin - Lexikani',
    default: 'Admin Dashboard - Lexikani',
  },
  description: 'Admin panel for managing Lexikani language learning platform.',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // This will redirect if user is not admin
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-6xl p-6">
        {/* Breadcrumb */}
        <Card className="mb-8 bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-200 dark:border-gray-700">
          <CardBody className="p-4">
            <nav className="flex items-center space-x-4 text-sm">
              <NextLink
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Home
              </NextLink>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">Admin Panel</span>
            </nav>
          </CardBody>
        </Card>

        {children}
      </main>
    </div>
  );
}
