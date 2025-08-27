import { getUsersForAdmin } from '@/lib/server/admin.actions';
import UserManager from '@/components/admin/user-manager';
import NextLink from 'next/link';
import { Button } from '@heroui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage users in the Lexikani platform.',
};

export default async function UsersPage() {
  const users = await getUsersForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          as={NextLink}
          href="/admin"
          variant="light"
          startContent={<ArrowLeftIcon className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage user accounts and admin privileges
        </p>
      </div>

      <UserManager initialUsers={users} />
    </div>
  );
}
