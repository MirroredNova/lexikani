import React from 'react';
import { Spinner } from '@heroui/spinner';

interface InlineLoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function InlineLoading({ text = 'Loading...', size = 'sm' }: InlineLoadingProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Spinner size={size} />
      <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ isVisible, text = 'Saving...', children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isVisible && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
            <Spinner size="sm" />
            <span className="text-sm font-medium">{text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface OptimisticBadgeProps {
  isOptimistic: boolean;
  children: React.ReactNode;
}

export function OptimisticBadge({ isOptimistic, children }: OptimisticBadgeProps) {
  return (
    <div
      className={`transition-opacity duration-200 ${isOptimistic ? 'opacity-70' : 'opacity-100'}`}
    >
      {children}
      {isOptimistic && (
        <div className="absolute -top-1 -right-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}
