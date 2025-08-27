import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  barClassName?: string;
  height?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export default function ProgressBar({
  progress,
  className = '',
  barClassName = '',
  height = 'md',
  color = 'primary',
}: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  return (
    <div
      className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heightClasses[height]} ${className}`}
    >
      <div
        className={`${heightClasses[height]} rounded-full transition-all duration-300 ${colorClasses[color]} ${barClassName}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
