'use client';

import { HeroUIProvider } from '@heroui/react';
import { UserProvider } from '@/contexts/user-context';
import { ThemeProvider } from '@/contexts/theme-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <UserProvider>{children}</UserProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
