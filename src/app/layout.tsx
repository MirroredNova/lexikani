import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/app/provider';
import NavigationBar from '@/components/ui/navbar';

export const metadata: Metadata = {
  title: {
    template: '%s | Lexikani',
    default: 'Lexikani - Language Learning Platform',
  },
  description:
    'Master languages with spaced repetition. Learn Norwegian and other languages efficiently with our advanced SRS system.',
  keywords: [
    'language learning',
    'SRS',
    'spaced repetition',
    'Norwegian',
    'vocabulary',
    'flashcards',
  ],
  authors: [{ name: 'Lexikani Team' }],
  creator: 'Lexikani',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lexikani.com',
    title: 'Lexikani - Language Learning Platform',
    description:
      'Master languages with spaced repetition. Learn Norwegian and other languages efficiently.',
    siteName: 'Lexikani',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lexikani - Language Learning Platform',
    description:
      'Master languages with spaced repetition. Learn Norwegian and other languages efficiently.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="text-foreground bg-background" suppressHydrationWarning>
      <body>
        <Providers>
          <NavigationBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
