'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { StatCard, VocabularyCard } from '@/components/shared';
import {
  formatNextReview,
  filterVocabulary,
  sortVocabulary,
  getUniqueValues,
  createFilterOptions,
  calculateVocabularyStats,
} from '@/lib/utils';
import type { VocabularyWithProgress } from '@/types';

interface VocabularyTableProps {
  vocabularyData: VocabularyWithProgress[];
}

export default function VocabularyTable({ vocabularyData }: VocabularyTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [srsFilter, setSrsFilter] = useState('all');
  const [sortBy, setSortBy] = useState('level');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredAndSortedData = useMemo(() => {
    const filtered = filterVocabulary(vocabularyData, {
      searchTerm,
      typeFilter,
      srsFilter,
    });
    return sortVocabulary(filtered, sortBy);
  }, [vocabularyData, searchTerm, typeFilter, srsFilter, sortBy]);

  const stats = useMemo(() => {
    const baseStats = calculateVocabularyStats(vocabularyData);
    // Override readyForReview with client-side calculation to avoid hydration issues
    const readyForReview = isClient ? baseStats.readyForReview : 0;
    return { ...baseStats, readyForReview };
  }, [vocabularyData, isClient]);

  const uniqueTypes = getUniqueValues(vocabularyData, 'type');
  const typeOptions = [{ key: 'all', label: 'All Types' }, ...createFilterOptions(uniqueTypes)];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value={stats.total} label="Total Words" color="primary" />
        <StatCard value={stats.learned} label="Learned" color="warning" />
        <StatCard value={stats.burned} label="Burned" color="success" />
        <StatCard value={stats.readyForReview} label="Ready for Review" color="secondary" />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Filters & Search</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Search words..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              isClearable
            />

            <Select
              label="Type"
              selectedKeys={[typeFilter]}
              onSelectionChange={keys => setTypeFilter(Array.from(keys)[0] as string)}
            >
              {typeOptions.map(option => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>

            <Select
              label="SRS Status"
              selectedKeys={[srsFilter]}
              onSelectionChange={keys => setSrsFilter(Array.from(keys)[0] as string)}
            >
              <SelectItem key="all">All Status</SelectItem>
              <SelectItem key="not-learned">Not Learned</SelectItem>
              <SelectItem key="learned">Learned</SelectItem>
              <SelectItem key="apprentice">Apprentice</SelectItem>
              <SelectItem key="guru">Guru</SelectItem>
              <SelectItem key="master-enlightened">Master/Enlightened</SelectItem>
              <SelectItem key="burned">Burned</SelectItem>
            </Select>

            <Select
              label="Sort By"
              selectedKeys={[sortBy]}
              onSelectionChange={keys => setSortBy(Array.from(keys)[0] as string)}
            >
              <SelectItem key="level">Level</SelectItem>
              <SelectItem key="word">Word</SelectItem>
              <SelectItem key="meaning">Meaning</SelectItem>
              <SelectItem key="type">Type</SelectItem>
              <SelectItem key="srs">SRS Stage</SelectItem>
            </Select>

            <Button
              onPress={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setSrsFilter('all');
                setSortBy('level');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Results */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Showing {filteredAndSortedData.length} of {vocabularyData.length} words
      </div>

      {/* Vocabulary Grid */}
      <div className="grid gap-4">
        {filteredAndSortedData.map(word => (
          <VocabularyCard
            key={word.id}
            word={word.word}
            meaning={word.meaning}
            type={word.type}
            level={word.level}
            attributes={word.attributes}
            srsStage={word.srsStage}
            nextReviewAt={word.nextReviewAt}
            unlockedAt={word.unlockedAt}
            updatedAt={word.updatedAt}
            formatNextReview={isClient ? formatNextReview : undefined}
            variant="full"
          />
        ))}
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No words found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
