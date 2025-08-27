import React from 'react';
import { Chip } from '@heroui/chip';
import { getSrsStageInfo } from '@/lib/utils';

interface SrsChipProps {
  srsStage: number | null;
  showStageNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow';
}

export default function SrsChip({
  srsStage,
  showStageNumber = false,
  size = 'sm',
  variant = 'flat',
}: SrsChipProps) {
  const srsInfo = getSrsStageInfo(srsStage);

  return (
    <div className="space-y-1">
      <Chip size={size} color={srsInfo.color} variant={variant}>
        {srsInfo.name}
      </Chip>
      {showStageNumber && srsStage !== null && (
        <div className="text-xs text-gray-500 dark:text-gray-500">Stage {srsStage}</div>
      )}
    </div>
  );
}
