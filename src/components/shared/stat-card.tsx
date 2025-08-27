import React from 'react';
import { Card, CardBody } from '@heroui/card';

interface StatCardProps {
  value: number;
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  className?: string;
}

export default function StatCard({
  value,
  label,
  color = 'primary',
  className = '',
}: StatCardProps) {
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    default: 'text-default',
  };

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${className}`}>
      <CardBody className="p-6 text-center">
        <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
      </CardBody>
    </Card>
  );
}
