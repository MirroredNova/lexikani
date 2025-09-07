import React from 'react';
import { getCurrentUser } from '@/lib/server/user.actions';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { users, userVocabulary } from '@/db/schema';
import { PageContainer, ThemeToggle } from '@/components/shared';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { User } from '@heroui/user';
import { Chip } from '@heroui/chip';
import {
  CalendarDaysIcon,
  UserCircleIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import LanguageSelector from '@/components/profile/language-selector';

export default async function ProfilePage() {
  // Get the current user from auth
  const authUser = await getCurrentUser();

  // Get additional user data from our database
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
    with: {
      selectedLanguage: true,
    },
  });

  // Get user's learning statistics
  const userStats = await db.query.userVocabulary.findMany({
    where: eq(userVocabulary.userId, authUser.id),
  });

  // Calculate stats
  const totalWords = userStats.length;
  const masteredWords = userStats.filter(stat => stat.srsStage >= 4).length;
  const learningWords = userStats.filter(stat => stat.srsStage > 0 && stat.srsStage < 4).length;

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and learning preferences
            </p>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-800/30 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <User
                name={dbUser?.name || 'User'}
                description={authUser.email}
                avatarProps={{
                  src: authUser.user_metadata?.avatar_url,
                  fallback: <UserCircleIcon className="w-8 h-8" />,
                  size: 'lg',
                }}
              />
              {dbUser?.isAdmin && (
                <Chip color="warning" variant="flat" className="font-medium">
                  Admin
                </Chip>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Account Information</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCircleIcon className="w-5 h-5 text-default-500" />
              <div>
                <p className="text-sm text-default-500">Display Name</p>
                <p className="font-medium">{dbUser?.name || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="w-5 h-5 text-default-500" />
              <div>
                <p className="text-sm text-default-500">Member Since</p>
                <p className="font-medium">
                  {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Settings */}
          <LanguageSelector />

          {/* Theme Settings */}
          <Card>
            <CardBody className="space-y-4">
              <h3 className="text-xl font-semibold">Theme Preference</h3>
              <p className="text-sm text-default-500">
                Choose your preferred color scheme. System will automatically switch based on your
                device settings.
              </p>
              <div className="flex items-center gap-4">
                <ThemeToggle variant="dropdown" showLabel />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Learning Statistics */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Learning Progress</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
              <CardBody className="p-6 text-center">
                <div className="p-2 bg-blue-500 rounded-lg w-fit mx-auto mb-3">
                  <BookOpenIcon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                  {totalWords}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Words</p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-800">
              <CardBody className="p-6 text-center">
                <div className="p-2 bg-green-500 rounded-lg w-fit mx-auto mb-3">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                  {masteredWords}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Mastered Words</p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
              <CardBody className="p-6 text-center">
                <div className="p-2 bg-orange-500 rounded-lg w-fit mx-auto mb-3">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-1">
                  {learningWords}
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400">Learning Words</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
