import { requireAdmin } from '@/lib/server/admin.actions';
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
      <main className="container mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
