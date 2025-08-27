import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { LanguageIcon, BookOpenIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import {
  getLanguagesForAdmin,
  getVocabularyForAdmin,
  getUsersForAdmin,
} from '@/lib/server/admin.actions';
import { StatCard } from '@/components/shared';
import NextLink from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Overview of the Lexikani platform administration.',
};

export default async function AdminDashboard() {
  const [languages, vocabulary, users] = await Promise.all([
    getLanguagesForAdmin(),
    getVocabularyForAdmin(),
    getUsersForAdmin(),
  ]);

  const stats = {
    totalLanguages: languages.length,
    totalVocabulary: vocabulary.length,
    totalUsers: users.length,
    adminUsers: users.filter(user => user.isAdmin).length,
  };

  // Group vocabulary by language for breakdown
  const vocabularyByLanguage = vocabulary.reduce(
    (acc, word) => {
      const langName = word.language.name;
      acc[langName] = (acc[langName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your language learning platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NextLink href="/admin/languages">
          <StatCard value={stats.totalLanguages} label="Languages" color="primary" />
        </NextLink>
        <NextLink href="/admin/vocabulary">
          <StatCard value={stats.totalVocabulary} label="Vocabulary Words" color="secondary" />
        </NextLink>
        <NextLink href="/admin/users">
          <StatCard value={stats.totalUsers} label="Total Users" color="success" />
        </NextLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Languages Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <LanguageIcon className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Languages</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {languages.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No languages added yet
                </p>
              ) : (
                languages.map(lang => (
                  <div
                    key={lang.id}
                    className="flex items-center justify-between p-4 bg-default-100 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{lang.name}</h3>
                      <p className="text-sm text-default-500">Code: {lang.code}</p>
                    </div>
                    <Chip size="sm" color="primary">
                      {vocabularyByLanguage[lang.name] || 0} words
                    </Chip>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ChartBarIcon className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <NextLink href="/admin/languages">
                <Card
                  isPressable
                  className="w-full h-full hover:shadow-md transition-shadow bg-primary-50 dark:bg-primary-900/20"
                >
                  <CardBody className="text-center p-6">
                    <LanguageIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="font-medium">Manage Languages</p>
                  </CardBody>
                </Card>
              </NextLink>

              <NextLink href="/admin/vocabulary">
                <Card
                  isPressable
                  className="w-full h-full hover:shadow-md transition-shadow bg-secondary-50 dark:bg-secondary-900/20"
                >
                  <CardBody className="text-center p-6">
                    <BookOpenIcon className="w-8 h-8 text-secondary mx-auto mb-3" />
                    <p className="font-medium">Manage Vocabulary</p>
                  </CardBody>
                </Card>
              </NextLink>

              <NextLink href="/admin/users">
                <Card
                  isPressable
                  className="w-full h-full hover:shadow-md transition-shadow bg-success-50 dark:bg-success-900/20"
                >
                  <CardBody className="text-center p-6">
                    <UsersIcon className="w-8 h-8 text-success mx-auto mb-3" />
                    <p className="font-medium">Manage Users</p>
                  </CardBody>
                </Card>
              </NextLink>

              <NextLink href="/">
                <Card
                  isPressable
                  className="w-full h-full hover:shadow-md transition-shadow bg-default-100"
                >
                  <CardBody className="text-center p-6">
                    <ChartBarIcon className="w-8 h-8 text-default-600 mx-auto mb-3" />
                    <p className="font-medium">Back to App</p>
                  </CardBody>
                </Card>
              </NextLink>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
