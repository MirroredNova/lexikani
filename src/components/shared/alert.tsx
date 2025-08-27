import React from 'react';
import {
  SparklesIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const alertConfig = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    icon: <SparklesIcon className="w-5 h-5" />,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    icon: <XCircleIcon className="w-5 h-5" />,
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: <ExclamationTriangleIcon className="w-5 h-5" />,
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    icon: <InformationCircleIcon className="w-5 h-5" />,
  },
};

export default function Alert({ variant, title, children, icon, className = '' }: AlertProps) {
  const config = alertConfig[variant];
  const displayIcon = icon ?? config.icon;

  return (
    <div className={`rounded-lg p-4 ${config.bg} ${config.border} ${className}`}>
      <div className={config.text}>
        {title && (
          <div className="flex items-center gap-2 mb-2">
            {displayIcon}
            <p className="font-medium">{title}</p>
          </div>
        )}
        <div className={!title && displayIcon ? 'flex items-start gap-2' : ''}>
          {!title && displayIcon}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
