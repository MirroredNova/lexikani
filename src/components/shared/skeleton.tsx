import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

const variantClasses = {
  text: 'h-4',
  rectangular: 'h-8',
  circular: 'rounded-full aspect-square',
};

export default function Skeleton({
  width = 'w-full',
  height,
  className = '',
  variant = 'rectangular',
}: SkeletonProps) {
  const heightClass = height || variantClasses[variant];
  const roundedClass = variant === 'circular' ? 'rounded-full' : 'rounded';

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${heightClass} ${width} ${roundedClass} ${className}`}
    />
  );
}

// Compound components for common patterns
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

function SkeletonText({ lines = 1, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? 'w-3/4' : 'w-full'} />
      ))}
    </div>
  );
}

interface SkeletonHeaderProps {
  className?: string;
}

function SkeletonHeader({ className = '' }: SkeletonHeaderProps) {
  return <Skeleton height="h-8" width="w-1/3" className={className} />;
}

interface SkeletonCardProps {
  className?: string;
}

function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`space-y-4 animate-pulse ${className}`}>
      <Skeleton height="h-6" width="w-3/4" />
      <Skeleton height="h-4" width="w-1/2" />
      <Skeleton height="h-10" />
    </div>
  );
}

// Attach compound components
Skeleton.Text = SkeletonText;
Skeleton.Header = SkeletonHeader;
Skeleton.Card = SkeletonCard;
