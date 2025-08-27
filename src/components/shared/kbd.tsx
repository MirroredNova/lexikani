import React from 'react';

interface KbdProps {
  children: React.ReactNode;
  variant?: 'default' | 'large' | 'contrast';
  className?: string;
}

const kbdVariants = {
  default: 'bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs',
  large: 'bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono',
  contrast: 'bg-white/20 px-1 rounded text-xs',
};

export default function Kbd({ children, variant = 'default', className = '' }: KbdProps) {
  return <kbd className={`${kbdVariants[variant]} ${className}`}>{children}</kbd>;
}
