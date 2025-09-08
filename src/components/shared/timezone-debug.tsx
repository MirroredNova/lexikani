'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { getTimezoneDebugInfo, debugTimezone } from '@/lib/utils/timezone';

interface TimezoneDebugProps {
  className?: string;
}

export default function TimezoneDebug({ className = '' }: TimezoneDebugProps) {
  const [debugInfo, setDebugInfo] = useState<ReturnType<typeof getTimezoneDebugInfo> | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    setDebugInfo(getTimezoneDebugInfo());

    // Update every 30 seconds to show current time
    const interval = setInterval(() => {
      setDebugInfo(getTimezoneDebugInfo());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogToConsole = () => {
    debugTimezone('Manual Debug Check');
  };

  if (!debugInfo || !showDebug) {
    return (
      <Button size="sm" variant="ghost" onPress={() => setShowDebug(true)} className={className}>
        🌍 Debug Timezone
      </Button>
    );
  }

  return (
    <Card
      className={`border-dashed border-2 border-orange-300 bg-orange-50 dark:bg-orange-950/20 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
            🌍 Timezone Debug Info
          </h4>
          <Button size="sm" variant="light" onPress={() => setShowDebug(false)}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardBody className="pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <strong>Timezone:</strong>
            <Chip size="sm" variant="flat" className="ml-1">
              {debugInfo.timezone}
            </Chip>
          </div>
          <div>
            <strong>Offset:</strong>
            <Chip size="sm" variant="flat" color="primary" className="ml-1">
              {debugInfo.offsetString}
            </Chip>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <div>
            <strong>Local:</strong> {debugInfo.localTime}
          </div>
          <div>
            <strong>UTC:</strong> {debugInfo.utcTime}
          </div>
          <div>
            <strong>Hours:</strong> Local {debugInfo.localHour}h vs UTC {debugInfo.utcHour}h
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="flat" onPress={handleLogToConsole}>
            Log to Console
          </Button>
          <Button size="sm" variant="flat" onPress={() => setDebugInfo(getTimezoneDebugInfo())}>
            Refresh
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
