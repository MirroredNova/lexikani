'use client';

import { useState, Fragment } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Form } from '@heroui/form';
import { Chip } from '@heroui/chip';
import { PlusIcon, PencilIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { createVocabulary, updateVocabulary, deleteVocabulary } from '@/lib/server/admin.actions';
import type { Language } from '@/types';

interface VocabularyItem {
  id: number;
  word: string;
  meaning: string;
  level: number;
  type: string;
  attributes: Record<string, unknown> | null;
  language: Language;
}

interface VocabularyManagerProps {
  initialVocabulary: VocabularyItem[];
  languages: Language[];
}

const vocabularyTypes = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'sentence', 'number'];

export default function VocabularyManager({
  initialVocabulary,
  languages,
}: VocabularyManagerProps) {
  const [vocabulary] = useState(initialVocabulary);
  const [editingVocabulary, setEditingVocabulary] = useState<VocabularyItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filter vocabulary based on selected filters
  const filteredVocabulary = vocabulary.filter(item => {
    if (selectedLanguage !== 'all' && item.language.id.toString() !== selectedLanguage)
      return false;
    if (selectedLevel !== 'all' && item.level.toString() !== selectedLevel) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    return true;
  });

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (editingVocabulary) {
        result = await updateVocabulary(editingVocabulary.id, formData);
      } else {
        result = await createVocabulary(formData);
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      // Refresh the page data
      window.location.reload();
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
        window.location.reload();
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
    onOpen();
  };

  const closeModal = () => {
    setEditingVocabulary(null);
    setError('');
    onClose();
  };

  const clearFilters = () => {
    setSelectedLanguage('all');
    setSelectedLevel('all');
    setSelectedType('all');
  };

  // Get unique levels from vocabulary
  const uniqueLevels = Array.from(new Set(vocabulary.map(item => item.level))).sort(
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Language"
                selectedKeys={[selectedLanguage]}
                onSelectionChange={keys => setSelectedLanguage(Array.from(keys)[0] as string)}
              >
                <SelectItem key="all">All Languages</SelectItem>
                <Fragment>
                  {languages.map(lang => (
                    <SelectItem key={lang.id.toString()}>{lang.name}</SelectItem>
                  ))}
                </Fragment>
              </Select>

              <Select
                label="Level"
                selectedKeys={[selectedLevel]}
                onSelectionChange={keys => setSelectedLevel(Array.from(keys)[0] as string)}
              >
                <SelectItem key="all">All Levels</SelectItem>
                <Fragment>
                  {uniqueLevels.map(level => (
                    <SelectItem key={level.toString()}>Level {level}</SelectItem>
                  ))}
                </Fragment>
              </Select>

              <Select
                label="Type"
                selectedKeys={[selectedType]}
                onSelectionChange={keys => setSelectedType(Array.from(keys)[0] as string)}
              >
                <SelectItem key="all">All Types</SelectItem>
                <Fragment>
                  {vocabularyTypes.map(type => (
                    <SelectItem key={type}>{type}</SelectItem>
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
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Vocabulary ({filteredVocabulary.length} of {vocabulary.length})
            </h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Vocabulary table">
              <TableHeader>
                <TableColumn>WORD</TableColumn>
                <TableColumn>MEANING</TableColumn>
                <TableColumn>LANGUAGE</TableColumn>
                <TableColumn>LEVEL</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No vocabulary found">
                {filteredVocabulary.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.word}</TableCell>
                    <TableCell>{item.meaning}</TableCell>
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          onPress={() => openModal(item)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          isIconOnly
                          onPress={() => handleDelete(item)}
                          isDisabled={isLoading}
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
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} size="2xl">
        <ModalContent>
          <Form action={handleSubmit}>
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
                        <SelectItem key={lang.id.toString()}>{lang.name}</SelectItem>
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
                      <SelectItem key={type}>{type}</SelectItem>
                    ))}
                  </Fragment>
                </Select>
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
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={closeModal} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                {editingVocabulary ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}
