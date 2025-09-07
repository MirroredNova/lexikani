'use client';

import { useState, Fragment, useCallback, useTransition } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { Tooltip } from '@heroui/tooltip';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Chip } from '@heroui/chip';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  regenerateAcceptedAnswersForWord,
  regenerateAllAcceptedAnswers,
} from '@/lib/server/admin.actions';
import { generateAcceptableAnswers } from '@/lib/utils/text';
import { Pagination } from '@/components/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Language } from '@/types';

interface VocabularyItem {
  id: number;
  word: string;
  meaning: string;
  level: number;
  type: string;
  attributes: Record<string, unknown> | null;
  acceptedAnswers: string[] | null;
  language: Language;
}

interface VocabularyData {
  data: VocabularyItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface VocabularyManagerProps {
  vocabularyData: VocabularyData;
  languages: Language[];
  filters: {
    searchTerm?: string;
    languageFilter?: string;
    levelFilter?: string;
    typeFilter?: string;
    sortBy?: string;
  };
}

const vocabularyTypes = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'phrase',
  'sentence',
  'number',
  'conjunction',
  'preposition',
  'pronoun',
  'determiner',
  'interjection',
];

export default function VocabularyManager({
  vocabularyData,
  languages,
  filters,
}: VocabularyManagerProps) {
  const [editingVocabulary, setEditingVocabulary] = useState<VocabularyItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedAnswers, setAcceptedAnswers] = useState<string>('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm || '');
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // URL-based filtering helpers
  const updateSearchParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset to first page when filters change
      if (Object.keys(updates).some(key => key !== 'page')) {
        params.delete('page');
      }

      startTransition(() => {
        router.push(`/admin/vocabulary?${params.toString()}`);
      });
    },
    [searchParams, router],
  );

  // Debounced search
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      const timeoutId = setTimeout(() => {
        updateSearchParams({ search: searchTerm });
      }, 500);
      return () => clearTimeout(timeoutId);
    },
    [updateSearchParams],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      return debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() });
    },
    [updateSearchParams],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Validate accepted answers JSON before submitting
      const acceptedAnswersValue = acceptedAnswers.trim();
      if (acceptedAnswersValue) {
        try {
          const parsed = JSON.parse(acceptedAnswersValue);
          if (!Array.isArray(parsed)) {
            setError('Accepted answers must be a JSON array');
            return;
          }
        } catch {
          setError('Invalid JSON format in accepted answers field');
          return;
        }
      }

      // Create a new FormData to ensure clean submission
      const cleanFormData = new FormData();
      cleanFormData.set('word', formData.get('word') as string);
      cleanFormData.set('meaning', formData.get('meaning') as string);
      cleanFormData.set('level', formData.get('level') as string);
      cleanFormData.set('type', formData.get('type') as string);
      cleanFormData.set('attributes', (formData.get('attributes') as string) || '');
      cleanFormData.set('acceptedAnswers', acceptedAnswersValue);

      if (!editingVocabulary) {
        cleanFormData.set('languageId', formData.get('languageId') as string);
      }

      let result;
      if (editingVocabulary) {
        result = await updateVocabulary(editingVocabulary.id, cleanFormData);
      } else {
        result = await createVocabulary(cleanFormData);
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      // Close modal and refresh
      closeModal();
      router.refresh();
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item: VocabularyItem) => {
    if (!confirm(`Are you sure you want to delete "${item.word}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteVocabulary(item.id);
      if (result.error) {
        setError(result.error);
      } else {
        // Refresh the page data
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      setError('Failed to delete vocabulary');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item?: VocabularyItem) => {
    setEditingVocabulary(item || null);
    setError('');
    // Set accepted answers for editing
    if (item?.acceptedAnswers) {
      setAcceptedAnswers(JSON.stringify(item.acceptedAnswers, null, 2));
    } else {
      setAcceptedAnswers('');
    }
    onOpen();
  };

  const closeModal = () => {
    setEditingVocabulary(null);
    setError('');
    setAcceptedAnswers('');
    onClose();
  };

  const clearFilters = () => {
    setSearchInput('');
    updateSearchParams({
      search: undefined,
      language: undefined,
      level: undefined,
      type: undefined,
      sort: undefined,
    });
  };

  const handleRegenerateAll = async () => {
    if (
      !confirm(
        'Regenerate accepted answers for ALL vocabulary? This will overwrite existing accepted answers.',
      )
    ) {
      return;
    }

    setBulkLoading(true);
    try {
      const languageId =
        filters.languageFilter === 'all' ? undefined : parseInt(filters.languageFilter || '');
      const result = await regenerateAllAcceptedAnswers(languageId);

      if (result.error) {
        setError(result.error);
      } else {
        alert(
          `Success: ${result.message}\n\nUpdated ${result.updatedCount} of ${result.totalCount} entries.`,
        );
        router.refresh();
      }
    } catch (error) {
      console.error('Error regenerating accepted answers:', error);
      setError('Failed to regenerate accepted answers');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleRegenerateWord = async (item: VocabularyItem) => {
    setIsLoading(true);
    try {
      const result = await regenerateAcceptedAnswersForWord(item.id);
      if (result.error) {
        setError(result.error);
      } else {
        alert(
          `Generated ${result.acceptedAnswers?.length || 0} accepted answers for "${item.word}"`,
        );
        router.refresh();
      }
    } catch (error) {
      console.error('Error regenerating accepted answers:', error);
      setError('Failed to regenerate accepted answers');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate JSON
  const isValidJSON = (str: string): boolean => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  };

  // Get unique levels from current vocabulary data
  const uniqueLevels = Array.from(new Set(vocabularyData.data.map(item => item.level))).sort(
    (a, b) => a - b,
  );

  return (
    <>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            <Button size="sm" variant="light" onPress={clearFilters}>
              Clear Filters
            </Button>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                label="Search"
                placeholder="Search words or meanings..."
                value={searchInput}
                onValueChange={handleSearchChange}
                isClearable
              />

              <Select
                label="Language"
                selectedKeys={filters.languageFilter ? [filters.languageFilter] : ['all']}
                onSelectionChange={keys =>
                  updateSearchParams({ language: Array.from(keys)[0] as string })
                }
              >
                <SelectItem key="all">All Languages</SelectItem>
                <Fragment>
                  {languages.map(lang => (
                    <SelectItem key={lang.id.toString()} textValue={lang.name}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </Fragment>
              </Select>

              <Select
                label="Level"
                selectedKeys={filters.levelFilter ? [filters.levelFilter] : ['all']}
                onSelectionChange={keys =>
                  updateSearchParams({ level: Array.from(keys)[0] as string })
                }
              >
                <SelectItem key="all">All Levels</SelectItem>
                <Fragment>
                  {uniqueLevels.map(level => (
                    <SelectItem key={level.toString()} textValue={`Level ${level}`}>
                      Level {level}
                    </SelectItem>
                  ))}
                </Fragment>
              </Select>

              <Select
                label="Type"
                selectedKeys={filters.typeFilter ? [filters.typeFilter] : ['all']}
                onSelectionChange={keys =>
                  updateSearchParams({ type: Array.from(keys)[0] as string })
                }
              >
                <SelectItem key="all">All Types</SelectItem>
                <Fragment>
                  {vocabularyTypes.map(type => (
                    <SelectItem key={type} textValue={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Fragment>
              </Select>

              <div className="flex items-end">
                <Button
                  color="primary"
                  startContent={<PlusIcon className="w-4 h-4" />}
                  onPress={() => openModal()}
                  className="w-full"
                >
                  Add Word
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Vocabulary Table */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Vocabulary ({vocabularyData.pagination.totalCount} total)
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {vocabularyData.data.length} of {vocabularyData.pagination.totalCount}{' '}
                entries
                {vocabularyData.pagination.totalPages > 1 &&
                  ` (Page ${vocabularyData.pagination.page} of ${vocabularyData.pagination.totalPages})`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                startContent={<ArrowPathIcon className="w-4 h-4" />}
                onPress={handleRegenerateAll}
                isLoading={bulkLoading}
                isDisabled={isLoading}
              >
                Regenerate All Accepted Answers
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="Vocabulary table">
              <TableHeader>
                <TableColumn>WORD</TableColumn>
                <TableColumn>MEANING</TableColumn>
                <TableColumn>ACCEPTED ANSWERS</TableColumn>
                <TableColumn>LANGUAGE</TableColumn>
                <TableColumn>LEVEL</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent="No vocabulary found"
                isLoading={isPending}
                loadingContent="Loading vocabulary..."
              >
                {vocabularyData.data.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.word}</TableCell>
                    <TableCell>{item.meaning}</TableCell>
                    <TableCell>
                      {item.acceptedAnswers && item.acceptedAnswers.length > 0 ? (
                        <Tooltip
                          content={
                            <div className="p-2 max-w-xs">
                              <p className="text-xs font-semibold mb-1">Accepted Answers:</p>
                              <div className="space-y-1">
                                {item.acceptedAnswers.map((answer, i) => (
                                  <div key={i} className="text-xs bg-success/10 px-2 py-1 rounded">
                                    &quot;{answer}&quot;
                                  </div>
                                ))}
                              </div>
                            </div>
                          }
                          placement="top"
                          showArrow
                        >
                          <div className="cursor-pointer">
                            <Chip size="sm" variant="flat" color="success">
                              {item.acceptedAnswers.length} answer
                              {item.acceptedAnswers.length !== 1 ? 's' : ''}
                            </Chip>
                          </div>
                        </Tooltip>
                      ) : (
                        <Chip size="sm" variant="flat" color="warning">
                          None
                        </Chip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color="primary">
                        {item.language.name}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color="secondary">
                        Level {item.level}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat">
                        {item.type}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          onPress={() => openModal(item)}
                          title="Edit word"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="secondary"
                          isIconOnly
                          onPress={() => handleRegenerateWord(item)}
                          isDisabled={isLoading}
                          title="Regenerate accepted answers"
                        >
                          <SparklesIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          isIconOnly
                          onPress={() => handleDelete(item)}
                          isDisabled={isLoading}
                          title="Delete word"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Pagination */}
        <Pagination
          currentPage={vocabularyData.pagination.page}
          totalPages={vocabularyData.pagination.totalPages}
          hasNextPage={vocabularyData.pagination.hasNextPage}
          hasPreviousPage={vocabularyData.pagination.hasPreviousPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {editingVocabulary ? 'Edit Vocabulary' : 'Add New Vocabulary'}
            </ModalHeader>
            <ModalBody className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Word"
                  name="word"
                  placeholder="e.g., hus"
                  defaultValue={editingVocabulary?.word || ''}
                  isRequired
                />

                <Input
                  label="Meaning"
                  name="meaning"
                  placeholder="e.g., house"
                  defaultValue={editingVocabulary?.meaning || ''}
                  isRequired
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {!editingVocabulary && (
                  <Select label="Language" name="languageId" isRequired>
                    <Fragment>
                      {languages.map(lang => (
                        <SelectItem key={lang.id.toString()} textValue={lang.name}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </Fragment>
                  </Select>
                )}

                <Input
                  label="Level"
                  name="level"
                  type="number"
                  min="1"
                  placeholder="1"
                  defaultValue={editingVocabulary?.level?.toString() || ''}
                  isRequired
                />

                <Select
                  label="Type"
                  name="type"
                  defaultSelectedKeys={editingVocabulary ? [editingVocabulary.type] : []}
                  isRequired
                >
                  <Fragment>
                    {vocabularyTypes.map(type => (
                      <SelectItem key={type} textValue={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Fragment>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Accepted Answers</label>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => {
                        // Get meaning from form or existing vocabulary
                        const formData = new FormData(
                          document.querySelector('form') as HTMLFormElement,
                        );
                        const currentMeaning =
                          (formData.get('meaning') as string) || editingVocabulary?.meaning || '';
                        if (currentMeaning) {
                          const generated = generateAcceptableAnswers(currentMeaning);
                          setAcceptedAnswers(JSON.stringify(generated, null, 2));
                        }
                      }}
                    >
                      Auto-Generate
                    </Button>
                  </div>
                  <Textarea
                    name="acceptedAnswers"
                    placeholder='["answer1", "answer2", "answer3"]'
                    value={acceptedAnswers}
                    onValueChange={setAcceptedAnswers}
                    description="JSON array of acceptable alternative answers (leave empty for none)"
                    minRows={3}
                    isInvalid={!!(acceptedAnswers.trim() && !isValidJSON(acceptedAnswers.trim()))}
                    errorMessage={
                      acceptedAnswers.trim() && !isValidJSON(acceptedAnswers.trim())
                        ? 'Invalid JSON format'
                        : undefined
                    }
                  />
                </div>

                <Textarea
                  label="Attributes (JSON)"
                  name="attributes"
                  placeholder='{"gender": "neuter", "article": "et"}'
                  defaultValue={
                    editingVocabulary?.attributes
                      ? JSON.stringify(editingVocabulary.attributes, null, 2)
                      : ''
                  }
                  description="Optional grammatical attributes in JSON format"
                  minRows={3}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={closeModal} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                {editingVocabulary ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
