import React from 'react';
import { Card, CardBody } from '@heroui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  iconColor,
  className = '',
}: FeatureCardProps) {
  return (
    <Card
      className={`text-center hover:shadow-lg transition-all duration-200 bg-gradient-to-br ${gradientFrom} ${gradientTo} border-2 ${className}`}
    >
      <CardBody className="p-6">
        <div className={`w-12 h-12 ${iconColor} mx-auto mb-3`}>{icon}</div>
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </CardBody>
    </Card>
  );
}
