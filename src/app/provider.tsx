'use client';

import { HeroUIProvider } from '@heroui/react';
import { UserProvider } from '@/contexts/user-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <UserProvider>{children}</UserProvider>
    </HeroUIProvider>
  );
}
