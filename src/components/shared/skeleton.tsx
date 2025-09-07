import React from 'react';
import { Card, CardBody } from '@heroui/card';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardBody className="p-6">{children}</CardBody>
    </Card>
  );
}

export function SkeletonHeader() {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
    </div>
  );
}

export function SkeletonProgressCard() {
  return (
    <Card className="mb-8">
      <CardBody className="p-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-24 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto mb-4" />
        <Skeleton className="h-3 w-full max-w-md mx-auto rounded-full" />
      </CardBody>
    </Card>
  );
}

export function SkeletonStatCard() {
  return (
    <SkeletonCard>
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </SkeletonCard>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table rows */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-20 ml-auto" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLevelAccordion() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="hover:shadow-lg transition-all duration-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
