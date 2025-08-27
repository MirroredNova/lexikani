import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Link } from '@heroui/link';

interface ActionCardProps {
  title: string;
  count: number;
  description: string;
  href: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  isDisabled?: boolean;
}

export default function ActionCard({
  title,
  count,
  description,
  href,
  icon,
  gradientFrom,
  gradientTo,
  iconColor,
  isDisabled = false,
}: ActionCardProps) {
  return (
    <Card
      className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden`}
    >
      <CardBody className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              <Chip size="lg" className="bg-black/20 text-white font-bold">
                {count}
              </Chip>
            </div>
            <p className={`mb-6 ${iconColor.replace('text-', 'text-').replace('-200', '-100')}`}>
              {description}
            </p>
          </div>
          <div className={`w-16 h-16 ${iconColor} absolute top-4 right-4`}>{icon}</div>
        </div>

        <div className="mt-auto">
          <Button
            as={Link}
            href={href}
            className="bg-black/30 hover:bg-black/40 text-white font-semibold w-full"
            size="lg"
            endContent={<span>&gt;</span>}
            isDisabled={isDisabled}
          >
            {isDisabled ? `No ${title} Available` : `Start ${title}`}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
