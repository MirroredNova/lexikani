'use client';

import React from 'react';

interface StickyActionBarProps {
  left?: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

export default function StickyActionBar({ left, right, className }: StickyActionBarProps) {
  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur ${className ?? ''}`}
    >
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {left ?? <div />}
        {right}
      </div>
    </div>
  );
}
