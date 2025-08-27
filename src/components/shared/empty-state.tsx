import React from 'react';
import { Button } from '@heroui/button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className="flex justify-center">{icon}</div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      {action && (
        <Button
          color="primary"
          variant="flat"
          className="mt-4"
          onPress={action.onClick}
          as={action.href ? 'a' : undefined}
          href={action.href}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
