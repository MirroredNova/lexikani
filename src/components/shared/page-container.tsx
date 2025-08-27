import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
};

export default function PageContainer({
  children,
  maxWidth = '4xl',
  className = '',
}: PageContainerProps) {
  return (
    <div className={`container mx-auto ${maxWidthClasses[maxWidth]} p-6 ${className}`}>
      {children}
    </div>
  );
}
