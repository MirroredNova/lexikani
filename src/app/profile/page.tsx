import React from 'react';
import { getCurrentUser } from '@/lib/server/user.actions';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { users, userVocabulary } from '@/db/schema';
import { PageContainer } from '@/components/shared';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { User } from '@heroui/user';
import { Chip } from '@heroui/chip';
import { CalendarDaysIcon, UserCircleIcon } from '@heroicons/react/24/outline';
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
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
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
                <Chip color="warning" variant="flat">
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

        {/* Language Settings */}
        <LanguageSelector />

        {/* Learning Statistics */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Learning Progress</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <p className="text-2xl font-bold text-primary">{totalWords}</p>
                <p className="text-sm text-default-600">Total Words</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-success/10">
                <p className="text-2xl font-bold text-success">{masteredWords}</p>
                <p className="text-sm text-default-600">Mastered Words</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-warning/10">
                <p className="text-2xl font-bold text-warning">{learningWords}</p>
                <p className="text-sm text-default-600">Learning Words</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
