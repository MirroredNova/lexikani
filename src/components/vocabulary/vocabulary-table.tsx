'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { VocabularyCard, Pagination } from '@/components/shared';
import { formatNextReview, getUniqueValues, createFilterOptions } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import type { VocabularyWithProgress } from '@/types';

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface VocabularyFilters {
  searchTerm: string;
  typeFilter: string;
  srsFilter: string;
  sortBy: string;
}

interface VocabularyTableProps {
  vocabularyData: VocabularyWithProgress[];
  pagination: PaginationInfo;
  filters: VocabularyFilters;
}

// Add window type declaration for search timeout
declare global {
  interface Window {
    searchTimeout: NodeJS.Timeout;
  }
}

export default function VocabularyTable({
  vocabularyData,
  pagination,
  filters,
}: VocabularyTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Local state for form inputs (will update URL on change)
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm);
  const [typeFilter, setTypeFilter] = useState(filters.typeFilter);
  const [srsFilter, setSrsFilter] = useState(filters.srsFilter);
  const [sortBy, setSortBy] = useState(filters.sortBy);

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<VocabularyFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove parameters
    if (newFilters.searchTerm !== undefined) {
      if (newFilters.searchTerm) {
        params.set('search', newFilters.searchTerm);
      } else {
        params.delete('search');
      }
    }
    if (newFilters.typeFilter && newFilters.typeFilter !== 'all') {
      params.set('type', newFilters.typeFilter);
    } else {
      params.delete('type');
    }
    if (newFilters.srsFilter && newFilters.srsFilter !== 'all') {
      params.set('srs', newFilters.srsFilter);
    } else {
      params.delete('srs');
    }
    if (newFilters.sortBy && newFilters.sortBy !== 'level') {
      params.set('sort', newFilters.sortBy);
    } else {
      params.delete('sort');
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/vocabulary?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    router.push(`/vocabulary?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setSrsFilter('all');
    setSortBy('level');
    router.push('/vocabulary');
  };

  // Get unique types from current page data for filter options
  const uniqueTypes = getUniqueValues(vocabularyData, 'type');
  const typeOptions = [{ value: 'all', label: 'All Types' }, ...createFilterOptions(uniqueTypes)];

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {vocabularyData.length} of {pagination.totalCount} words (Page {pagination.page}{' '}
          of {pagination.totalPages})
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Filters & Search</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              label="Search"
              placeholder="Search words or meanings..."
              value={searchTerm}
              onValueChange={value => {
                setSearchTerm(value);
                // Debounced update
                if (typeof window !== 'undefined') {
                  clearTimeout(window.searchTimeout);
                  window.searchTimeout = setTimeout(() => {
                    updateFilters({ searchTerm: value });
                  }, 500);
                }
              }}
              isClearable
              onClear={() => {
                setSearchTerm('');
                updateFilters({ searchTerm: '' });
              }}
            />

            <Select
              label="Type"
              selectedKeys={[typeFilter]}
              onSelectionChange={keys => {
                const value = Array.from(keys)[0] as string;
                setTypeFilter(value);
                updateFilters({ typeFilter: value });
              }}
            >
              {typeOptions.map(option => (
                <SelectItem key={'value' in option ? option.value : option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="SRS Level"
              selectedKeys={[srsFilter]}
              onSelectionChange={keys => {
                const value = Array.from(keys)[0] as string;
                setSrsFilter(value);
                updateFilters({ srsFilter: value });
              }}
            >
              <SelectItem key="all">All Levels</SelectItem>
              <SelectItem key="unlearned">Unlearned</SelectItem>
              <SelectItem key="apprentice">Apprentice</SelectItem>
              <SelectItem key="guru">Guru</SelectItem>
              <SelectItem key="master">Master</SelectItem>
              <SelectItem key="enlightened">Enlightened</SelectItem>
              <SelectItem key="burned">Burned</SelectItem>
            </Select>

            <Select
              label="Sort By"
              selectedKeys={[sortBy]}
              onSelectionChange={keys => {
                const value = Array.from(keys)[0] as string;
                setSortBy(value);
                updateFilters({ sortBy: value });
              }}
            >
              <SelectItem key="level">Level</SelectItem>
              <SelectItem key="word">Word</SelectItem>
              <SelectItem key="meaning">Meaning</SelectItem>
              <SelectItem key="type">Type</SelectItem>
              <SelectItem key="srs">SRS Stage</SelectItem>
            </Select>

            <Button onPress={clearAllFilters}>Clear Filters</Button>
          </div>
        </CardBody>
      </Card>

      {/* Vocabulary Grid */}
      <div className="grid gap-4">
        {vocabularyData.map(word => (
          <VocabularyCard
            key={word.id}
            id={word.id}
            word={word.word}
            meaning={word.meaning}
            type={word.type}
            level={word.level}
            attributes={word.attributes}
            srsStage={word.srsStage}
            nextReviewAt={word.nextReviewAt}
            unlockedAt={word.unlockedAt}
            updatedAt={word.updatedAt}
            notes={word.notes}
            formatNextReview={isClient ? formatNextReview : undefined}
            variant="full"
          />
        ))}
      </div>

      {vocabularyData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No words found matching your filters.</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
