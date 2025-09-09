import React from 'react';
import { Button } from '@heroui/button';

interface SessionHeaderProps {
  title: string;
  subtitle?: string;
  backButtonText?: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  showBackButton?: boolean;
}

export default function SessionHeader({
  title,
  subtitle,
  backButtonText = '← Back to Home',
  onBack,
  rightContent,
  showBackButton = true,
}: SessionHeaderProps) {
  return (
    <>
      {/* Mobile layout: two rows to avoid crunching */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <Button variant="ghost" size="sm" className="px-2" onPress={onBack}>
              {backButtonText}
            </Button>
          ) : (
            <div />
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">{rightContent}</div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>

      {/* Desktop/tablet layout: single row */}
      <div className="hidden sm:flex items-center justify-between">
        {showBackButton ? (
          <Button variant="ghost" size="sm" className="px-2" onPress={onBack}>
            {backButtonText}
          </Button>
        ) : (
          <div />
        )}

        <div className="text-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">{rightContent}</div>
      </div>
    </>
  );
}
