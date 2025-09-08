import React from 'react';
import { getCurrentUser } from '@/lib/server/user.actions';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { users, userVocabulary } from '@/db/schema';
import { PageContainer, ThemeToggle } from '@/components/shared';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { User } from '@heroui/user';
import { Chip } from '@heroui/chip';
import { Tooltip } from '@heroui/tooltip';
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

  // Get user's learning statistics with vocabulary details
  const userStats = await db.query.userVocabulary.findMany({
    where: eq(userVocabulary.userId, authUser.id),
    with: {
      vocabulary: true,
    },
  });

  // Calculate SRS distribution
  const totalWords = userStats.length;
  const srsDistribution = Array.from({ length: 9 }, (_, index) => {
    const stage = index + 1; // Start from SRS 1
    return {
      stage,
      count: userStats.filter(stat => stat.srsStage === stage).length,
      words: userStats.filter(stat => stat.srsStage === stage),
    };
  });

  // SRS Stage names and descriptions
  const srsStageInfo: Record<number, { name: string; description: string; color: string }> = {
    1: {
      name: 'Apprentice I',
      description: 'Just completed lesson or failed review (4 hours)',
      color: 'bg-pink-500',
    },
    2: { name: 'Apprentice II', description: '8 hours later', color: 'bg-pink-600' },
    3: { name: 'Apprentice III', description: '1 day later', color: 'bg-pink-700' },
    4: { name: 'Guru I', description: '3 days later', color: 'bg-purple-500' },
    5: { name: 'Guru II', description: '1 week later', color: 'bg-purple-600' },
    6: { name: 'Master I', description: '2 weeks later', color: 'bg-blue-500' },
    7: { name: 'Master II', description: '1 month later', color: 'bg-blue-600' },
    8: { name: 'Enlightened', description: '3 months later', color: 'bg-yellow-500' },
    9: { name: 'Burned', description: 'Permanently learned', color: 'bg-orange-500' },
  };

  // Debug output
  console.log('=== DEBUG: SRS Distribution ===');
  console.log(`Total words: ${totalWords}`);
  srsDistribution.forEach(({ stage, count, words }) => {
    console.log(`\nSRS ${stage} (${srsStageInfo[stage].name}): ${count} words`);
    if (count > 0) {
      words.forEach(stat => {
        console.log(
          `  - ${stat.vocabulary.word} (${stat.vocabulary.meaning}) - Level: ${stat.vocabulary.level}`,
        );
      });
    }
  });

  const totalCheck = srsDistribution.reduce((sum, { count }) => sum + count, 0);
  console.log(`\nTotal check: ${totalCheck} (should equal ${totalWords})`);
  console.log('==============================');

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

        {/* SRS Distribution Chart */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">SRS Level Distribution</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your vocabulary progress across all Spaced Repetition System levels
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Total words: <span className="font-semibold">{totalWords}</span>
            </p>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 <strong>Note:</strong> Words you haven&apos;t encountered yet don&apos;t appear
                here. Completed lessons start at SRS 1. Failed reviews also reset to SRS 1.
              </p>
            </div>
          </div>

          <Card>
            <CardBody className="p-6">
              <div className="space-y-4">
                {srsDistribution.map(({ stage, count }) => {
                  const percentage = totalWords > 0 ? (count / totalWords) * 100 : 0;
                  const maxCount = Math.max(...srsDistribution.map(d => d.count));
                  const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  const stageInfo = srsStageInfo[stage];

                  return (
                    <div key={stage} className="flex items-center gap-4">
                      {/* SRS Level Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${stageInfo.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium truncate">
                                  SRS {stage}: {stageInfo.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {stageInfo.description}
                                </p>
                              </div>
                              <div className="text-right ml-2">
                                <Tooltip content={`${count} words (${percentage.toFixed(1)}%)`}>
                                  <div className="cursor-help">
                                    <p className="text-sm font-semibold">{count}</p>
                                    <p className="text-xs text-gray-500">
                                      {percentage.toFixed(1)}%
                                    </p>
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${stageInfo.color}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
