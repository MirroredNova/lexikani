'use client';

import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { formatCompactHour, calculateBarHeight, getReviewCountBarColor } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import { convertUTCToLocal, getLocalNow, debugTimezone } from '@/lib/utils/timezone';

interface ReviewScheduleItem {
  hour: Date;
  count: number;
}

interface ReviewScheduleProps {
  schedule: ReviewScheduleItem[];
}

export default function ReviewSchedule({ schedule }: ReviewScheduleProps) {
  // Responsive hours display
  const [hoursToShow, setHoursToShow] = useState(24);

  useEffect(() => {
    const updateHoursToShow = () => {
      if (window.innerWidth < 640) {
        // sm breakpoint
        setHoursToShow(8);
      } else if (window.innerWidth < 1024) {
        // lg breakpoint
        setHoursToShow(16);
      } else {
        setHoursToShow(24);
      }
    };

    updateHoursToShow();
    window.addEventListener('resize', updateHoursToShow);
    return () => window.removeEventListener('resize', updateHoursToShow);
  }, []);

  // Convert server UTC dates to local timezone for accurate display
  const localizedSchedule = useMemo(() => {
    const now = getLocalNow();

    // Debug timezone info (remove in production)
    if (process.env.NODE_ENV === 'development' && schedule.length > 0) {
      debugTimezone('Review Schedule Conversion');
      console.log('📊 Schedule Debug:');
      console.log(
        'Server schedule (first 3 hours):',
        schedule.slice(0, 3).map(s => ({
          hour: s.hour.toISOString(),
          count: s.count,
        })),
      );
      console.log('Local now:', now.toISOString());
    }

    return schedule
      .map(item => ({
        ...item,
        hour: convertUTCToLocal(item.hour),
      }))
      .filter(item => {
        // Only show future hours in local time
        return item.hour >= now;
      });
  }, [schedule]);

  const totalReviews = localizedSchedule.reduce((sum, item) => sum + item.count, 0);
  const hoursToDisplay = localizedSchedule.slice(0, hoursToShow);

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold">Review Schedule</h3>
          <Chip size="sm" color="secondary" variant="flat">
            {totalReviews} reviews in {hoursToShow}h
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="p-6 pt-3">
        {totalReviews === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>No reviews scheduled for the next {hoursToShow} hours</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <SparklesIcon className="w-4 h-4" />
              <p className="text-sm">Great job staying on top of your reviews!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Responsive Hours Display */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-8">
                Next {hoursToShow} Hours
              </h4>
              <div className="flex items-end justify-between gap-0.5 h-12">
                {hoursToDisplay.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 group">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 min-h-[16px]">
                      {item.count > 0 && (
                        <span className="group-hover:font-bold transition-all">{item.count}</span>
                      )}
                    </div>
                    <div
                      className={`w-full ${getReviewCountBarColor(item.count)} rounded-t transition-all group-hover:opacity-80`}
                      style={{
                        height: `${calculateBarHeight(item.count, hoursToDisplay.length > 0 ? Math.max(...hoursToDisplay.map(h => h.count)) : 0)}px`,
                      }}
                      title={`${item.count} reviews at ${formatCompactHour(item.hour)}`}
                    />
                    <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 text-center whitespace-nowrap">
                      {formatCompactHour(item.hour)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <div className="w-3 h-2 bg-blue-400 rounded"></div>
                <span>1-5</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-2 bg-yellow-400 rounded"></div>
                <span>6-15</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-2 bg-orange-400 rounded"></div>
                <span>16-30</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-2 bg-red-400 rounded"></div>
                <span>30+</span>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
